import express from 'express';
import { getUser,register,login,logout } from '../controllers/userController.js';
import {authJWT } from '../middleware/authJWT.js';

const router = express.Router();

router.get('/see',authJWT,getUser);
router.post('/register',register);
router.post('/login',login);
router.post('/logout',authJWT,logout);


export default router;