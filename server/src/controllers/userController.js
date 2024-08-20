import { mongo } from '../database/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import User from '../models/user_schema.js'

export const register = async (req, res) => {
  const { username, email, password, retype_password } = req.body;

  // Validasi password dan retype_password
  if (password !== retype_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Periksa apakah pengguna sudah ada
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat ID unik dengan panjang 5 karakter menggunakan kombinasi dari crypto.randomBytes
    let userId;
    let userExists;

    do {
      userId = crypto.randomBytes(3).toString('hex');
      userExists = await User.findOne({ userId });
    } while (userExists);

    // Buat pengguna baru
    const newUser = new User({
      userId,
      username,
      email,
      password: hashedPassword,
      created_time: new Date()
    });

    // Simpan pengguna ke database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      // Tangani error duplicate key
      const duplicateField = Object.keys(error.keyValue)[0];
      res.status(400).json({ message: `Duplicate key error: ${duplicateField} already exists`, error: error.keyValue });
    } else {
      res.status(500).json({ message: 'Database error', error: error.message });
    }
  }
};

  export const login = async (req, res) => {
    const { username,email, password } = req.body;
    try{
        const user = await User.findOne({
            $or: [
              { username: username },
              { email: email }
            ]
          });
        if(!user){
            return res.status(400).json({ message: 'Username not found' });
        }
        if (!user.password.startsWith('$2b$')){
            return res.status(400).json({ message: 'not valid with database password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: ' wrong Password ' });

        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('username', user.username, { httpOnly: true });

        res.status(200).json({ message: 'Login successfully', token: token });
        return console.log(token)

        
        // Kirim token ke server Flask
    /*try {
        await fetch('http://localhost:5000/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
      } catch (fetchError) {
        console.error('Error sending token to Flask:', fetchError);
        // Tambahkan logika penanganan error jika diperlukan
      } */
  
      // Send response
      return res.json({ token, user_id: user.id });
  
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    }

    export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Decoded user ID:', userId);

    // Cari pengguna berdasarkan userId yang didapatkan dari token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Mencatat waktu logout untuk session terakhir yang belum memiliki logout_time
    await User.updateOne(
      { _id: userId },
      { $set: { logout_time: new Date() } }
    );

    // Hapus cookie (jika diperlukan)
    res.clearCookie('username');

    res.json({ message: 'Logout recorded successfully' });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

