import mongoose from 'mongoose';
import User from '../models/user_schema.js'

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  grossAmount: {
    type: Number,
    required: true,
  },
  transactionToken: {
    type: String,
    required: true,
  },
  customerDetails: {
    userId: {
      type: String,
      required: true,
    },
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
  },
  status: {
    type: String,
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware untuk mengisi customerDetails berdasarkan userId
transactionSchema.pre('save', async function (next) {
  if (!this.customerDetails.first_name) {
    try {
      const user = await User.findOne({ userId: this.customerDetails.userId });
      if (user) {
        this.customerDetails.first_name = user.first_name;
        this.customerDetails.last_name = user.last_name;
        this.customerDetails.email = user.email;
        this.customerDetails.phone = user.phone;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
