import express from "express";
import { getCart,addCart,updateCart,removeCart } from "../controllers/cartController.js";
import { authJWT } from "../middleware/authJWT.js";

const router = express.Router();

router.get("/see",authJWT, getCart);
router.post("/add",authJWT, addCart);
router.put("/update/:productId",authJWT, updateCart);
router.delete("/drop/:productId",authJWT, removeCart);

export default router;