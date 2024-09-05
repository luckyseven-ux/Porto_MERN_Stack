import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  login_time: {
    type: Date,
    default: Date.now
  },
  logout_time: {
    type: Date,
    default: null
  }
});

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false,
    unique: true
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  reset_password_token: {
    type: String,
    default: null
  },
  reset_password_expires: {
    type: Number,
    default: null
  },
  sessions: [sessionSchema]
});

// Mengganti primary key default (_id) dengan field id
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

userSchema.index({ userId: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
