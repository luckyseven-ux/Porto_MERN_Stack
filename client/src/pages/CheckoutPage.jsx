import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState(location.state?.selectedProducts || []);

  const [customerDetails, setCustomerDetails] = useState({
    userId: '',  // Ubah dari 'user_Id' ke 'userId' agar sesuai dengan format API
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  // Menghitung total harga menggunakan useMemo
  const calculateTotal = useMemo(() => {
    console.log('Calculating total:', selectedProducts);
    return selectedProducts.reduce((total, item) => {
      if (!item.productId.price || isNaN(item.productId.price)) {
        console.error('Invalid price found in item:', item);
        return total;
      }
      return total + item.productId.price * item.quantity;
    }, 0);
  }, [selectedProducts]);

  // Memeriksa apakah token login ada di localStorage dan mengambil data pengguna
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page jika belum login
      return;
    }

    if (selectedProducts.length === 0) {
      const savedProducts = localStorage.getItem('selectedProducts');
      if (savedProducts) {
        setSelectedProducts(JSON.parse(savedProducts));
      } else {
        navigate('/cart'); // Jika tidak ada data, kembali ke keranjang
      }
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/see', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Sertakan token
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCustomerDetails({
            userId: userData.userId,  // Pastikan userId sesuai dengan API
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone: userData.phone,
          });
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Menangani checkout dengan useCallback untuk menghindari pembentukan ulang fungsi
  const handleCheckout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const selectedProduct = selectedProducts[0]; // Ambil produk pertama
      if (!selectedProduct || !selectedProduct._id) {
        throw new Error('Invalid product selected');
      }

      // Data yang akan dikirim ke API Midtrans
      const requestData = {
        productId: selectedProduct.productId, // Kirim productId
        quantity: selectedProduct.quantity || 1, // Atur jumlah sesuai kebutuhan
        customerDetails, // Menggunakan data customerDetails yang telah diisi otomatis
      };

      // Log data yang akan dikirim
      console.log("Data yang dikirim ke API Midtrans:", requestData);

      // Mengirim data ke API
      const response = await fetch('http://localhost:3000/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sertakan token
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.redirect_url) {
        // Arahkan pengguna ke URL pembayaran Midtrans
        window.location.href = data.redirect_url;
      } else {
        console.error('Failed to initiate transaction:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error initiating transaction:', error);
    }
  }, [selectedProducts, customerDetails]);
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex space-x-8">
        {/* Kolom Kiri - Alamat & Barang dalam Keranjang */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Pengiriman</h2>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold">ALAMAT PENGIRIMAN</h3>
            <p className="mt-2">
              <span className="font-semibold">komplek plp rt.002 005Kel.Serd</span> - rizky andi wibowo
            </p>
            <p className="text-gray-600">
              kantin bude kolam komplek plp rt.002/005Kel.Serdang Wetan Kec.Legok Kab.Tangerang,
              Legok, Kab. Tangerang, Banten, 6289530265292
            </p>
            <div className="flex mt-4 space-x-4">
              <button className="border border-gray-300 px-4 py-2 rounded-md">Ganti Alamat</button>
              <button className="border border-gray-300 px-4 py-2 rounded-md">Kirim ke Beberapa Alamat</button>
            </div>
          </div>

          {/* Barang dalam Keranjang */}
          <div>
        {selectedProducts.length > 0 ? (
          selectedProducts.map((item, index) => (
            <div key={index}>
              <p>{item.productId.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>Price: Rp {item.productId.price}</p>
            </div>
          ))
        ) : (
          <p>Tidak ada produk yang dipilih.</p>
        )}
      </div>
        </div>

        {/* Kolom Kanan - Ringkasan */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-6">Ringkasan belanja</h3>
          <div className="flex justify-between mb-4">
            <span>Total Harga ({selectedProducts.length} Barang)</span>
            <span>Rp{calculateTotal}</span>
          </div>
          <button
            className="bg-green-600 text-white w-full py-3 rounded-lg text-lg"
            onClick={handleCheckout}
          >
            Pilih Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
