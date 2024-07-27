import express from 'express';
import { register,login,logout } from '../controllers/userController.js';
import {authJWT } from '../middleware/authJWT.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout',authJWT,logout);

export default router;