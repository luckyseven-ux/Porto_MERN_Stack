import express from "express";
import { getAddress, createAddress, deleteAddress } from '../controllers/addressController.js';
import { authJWT } from "../middleware/authJWT.js";

const router = express.Router();

router.get('/see', authJWT,getAddress);
router.post('/create', authJWT,createAddress);
router.delete('/drop/:addressId', authJWT,deleteAddress);


export default router;
//
//