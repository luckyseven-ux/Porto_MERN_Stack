import mongoose from 'mongoose';
import moment from 'moment-timezone';
import crypto from 'crypto'; // Import crypto untuk generate ID

// Fungsi untuk mendapatkan waktu Jakarta
function getJakartaTime() {
  return moment().tz("Asia/Jakarta").toDate();
}

// Fungsi untuk mendapatkan nama hari dan tanggal dalam format string
function getFormattedDate() {
  return moment().tz("Asia/Jakarta").format('dddd, MMMM Do YYYY'); // Contoh: "Saturday, August 10th 2024"
}

// Fungsi untuk menghasilkan productId unik dengan 5 angka menggunakan crypto
function generateProductId() {
  return crypto.randomBytes(3).toString('hex').slice(0, 5); // Menghasilkan 5 karakter hex
}

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    default: generateProductId, // Menggunakan generateProductId sebagai nilai default
    unique: true // Pastikan productId unik
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'Rp'
  },
  quantity: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number, // Assuming weight is in grams or kilograms
    required: true // You can adjust this based on whether it's mandatory
  },
  unit: {
    type: String,
    default: 'pcs'
  },
  active: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    ref: 'Category',
    required: true},
  image:{
    data: Buffer,
    contentType: String
  },
  created_date: {
    type: Date,
    default: getJakartaTime
  },
  updated_date: {
    type: Date,
    default: getJakartaTime
  },
  created_day: {
    type: String,
    default: () => moment().tz("Asia/Jakarta").format('dddd') // Hari, misalnya "Saturday"
  },
  created_date_string: {
    type: String,
    default: getFormattedDate // Format string hari dan tanggal, misalnya "Saturday, August 10th 2024"
  }
});

// Middleware untuk memperbarui updated_date dengan waktu Jakarta
productSchema.pre('save', function(next) {
  this.updated_date = getJakartaTime();
  next();
});

// Mengganti primary key default (_id) dengan field id
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });
productSchema.virtual('id').get(function() {
  return this._id.toHexString().substring(0, 5); // Menggunakan 5 karakter pertama dari _id
});

productSchema.index({ name: 1 }, { unique: true });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
