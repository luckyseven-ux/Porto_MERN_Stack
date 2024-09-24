import Cart from '../models/cart_Schema.js';
import Product from '../models/product_Schema.js';

export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // Ambil cart berdasarkan userId dan populate produk di dalam items
    const cart = await Cart.findOne({ userId })
      .populate({
        path: 'items.productId',
        populate: { path: 'category', select: 'name' } // Populate category name
      });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Format ulang data produk di cart agar termasuk gambar dan kategori
    const formattedCart = {
      ...cart._doc,
      items: cart.items.map(item => ({
        ...item._doc,
        productId: {
          ...item.productId._doc,
          category: item.productId.category ? item.productId.category.name : "No Category",
          image: item.productId.image && item.productId.image.data && item.productId.image.contentType
            ? `data:${item.productId.image.contentType};base64,${item.productId.image.data.toString('base64')}`
            : null // Jika data gambar tidak ada, berikan nilai null atau placeholder image
        }
      }))
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
};



export const addCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Anggap sudah ada middleware auth

  try {
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);

    // Cek validitas quantity
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    let cart = await Cart.findOne({ userId });

    // Jika keranjang belum ada, buat baru
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cek jika stok cukup
    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock for this product' });
    }

    // Cek jika produk sudah ada di keranjang
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productId)
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    // (Opsional) Kurangi stok produk
    product.quantity -= quantity;
    await product.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in addCart:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const updateCart = async (req, res) => {
  const userId = req.user.id; // Ambil user ID dari request yang sudah di-autentikasi
  const { productId } = req.params; // Ambil productId dari URL params
  const { quantity } = req.body; // Ambil quantity dari body request

  try {
    // Cari cart berdasarkan userId
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Cari item yang sesuai dengan productId di dalam cart
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // Update quantity dari item yang ditemukan
    item.quantity = quantity;
    await cart.save(); // Simpan perubahan ke database

    // Kembalikan response sukses dengan cart yang sudah di-update
    res.status(200).json(cart);
  } catch (error) {
    // Tangani error dan kirim response error
    res.status(500).json({ error: error.message });
  }
};




export const removeCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    console.log('Cart items before:', cart.items);  // Debugging

    // Memastikan productId dalam format yang benar
    const updatedItems = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // Update items di dalam cart
    cart.items = updatedItems;
    console.log('Cart items before:', cart.items);  // Debugging
    console.log('Received productId:', productId);  // Debugging
    console.log('Cart items after:', cart.items);  // Debugging

    await cart.save();
    res.status(200).json(cart);
    console.log('Cart items after:', cart.items);   // Debugging
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};        

