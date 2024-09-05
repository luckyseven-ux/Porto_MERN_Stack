import { snap } from '../middleware/midtransClient.js'; // Midtrans client
import Product from '../models/product_Schema.js'; // Model Product
import Transaction from '../models/transaction_Schema.js'; // Model Transaction
import crypto from 'crypto'; // Untuk generate orderId
import fetch from 'node-fetch'; // Untuk meminta data dari API


// Fungsi untuk menghasilkan orderId yang unik menggunakan randomBytes
function generateOrderId() {
  return 'order-' + crypto.randomBytes(8).toString('hex');
}

// Mendapatkan transaksi berdasarkan orderId
export const getTransaction = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Cari transaksi berdasarkan orderId
    const transaction = await Transaction.findOne({ orderId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Membuat transaksi baru
export const createTransaction = async (req, res) => {
  try {
    const { productId, quantity, customerDetails } = req.body;

    // Validasi produk
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Invalid product' });
    }
    const url = 'https://app.sandbox.midtrans.com/snap/v1/transactions'
    // Hitung total pembayaran di server
    const grossAmount = product.price * quantity;

    // Generate orderId secara unik menggunakan randomBytes
    const orderId = generateOrderId();

    const transactionDetails = {
      transaction_details: {
        order_id: orderId, // ID pesanan unik
        gross_amount: grossAmount, // Total pembayaran
      },
      customer_details: customerDetails,
      credit_card: { secure: true } // Credit card setting
    };

    // Buat transaksi dengan Midtrans
    const transaction = await snap.createTransaction(transactionDetails);
 


    // Simpan transaksi ke database
    const newTransaction = new Transaction({
      orderId,
      product: productId,
      quantity,
      grossAmount,
      transactionToken: transaction.token,
      customerDetails,
      status: 'pending',
    });
    await newTransaction.save();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.SERVER_KEY_MIDTRANS).toString('base64')
      },
      body: JSON.stringify(transactionDetails)
    });
    const data = await response.json();
    const transactionRedirectUrl = transaction.redirect_url;

    res.status(200).json({ transactionToken: data.token ,redirect_url:transactionRedirectUrl});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Membatalkan transaksi
export const abortTransaction = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Cari transaksi di database
    const transaction = await Transaction.findOne({ orderId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Batalkan transaksi di Midtrans
    await snap.transaction.cancel(orderId);

    // Update status transaksi di database
    transaction.status = 'cancelled';
    await transaction.save();

    res.status(200).json({ message: 'Transaction cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
