import express from "express";
import { getAddress, createAddress,setDefaultAddress, deleteAddress,provinceId,cityId,shipping } from '../controllers/addressController.js';
import { authJWT } from "../middleware/authJWT.js";

const router = express.Router();

router.get('/see', authJWT,getAddress);
router.post('/create', authJWT,createAddress);
router.put('/default/:addressId', authJWT,setDefaultAddress);
router.delete('/drop/:addressId', authJWT,deleteAddress);
router.get('/prov',provinceId);
router.get('/city',cityId);
router.post('/shiping',shipping);


export default router;
//
//