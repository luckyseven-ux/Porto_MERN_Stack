import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Menambahkan indeks unik untuk memastikan satu pengguna hanya memiliki satu keranjang
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
}, { timestamps: true }); // Menambahkan timestamps untuk createdAt dan updatedAt

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
