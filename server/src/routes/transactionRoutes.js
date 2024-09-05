import express from "express";
import { getTransaction,abortTransaction, createTransaction } from "../controllers/transactionController.js";
import { authJWT } from "../middleware/authJWT.js";


const router = express.Router();

router.get("/see", authJWT,getTransaction);
router.post("/create", authJWT,createTransaction);
router.delete("/delete/:id", authJWT,abortTransaction);

export default router;