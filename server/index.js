import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import { mongo } from './src/database/db.js';

// Load environment variables
dotenv.config();

// Initialize MongoDB connection
mongo();

const app = express();
const port = process.env.PORT || 3000;

// Configure session store with MongoDB
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  collectionName: 'sessions'
});

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 3600000 }
}));

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Routes
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/category', categoryRoutes);
app.use('/transaction', transactionRoutes);

app.get('/get-user', (req, res) => {
  const user = req.session.user;
  res.send(`Session user: ${user ? user.username : 'undefined'}`);
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
