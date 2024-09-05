import Cart from '../models/cart_Schema.js';
import Product from '../models/product_Schema.js';

export const getCart = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
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
  
      let cart = await Cart.findOne({ userId });
  
      // Jika keranjang belum ada, buat baru
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Cek jika produk sudah ada di keranjang
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
  
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error in addCart:', error.message);
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
  
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  