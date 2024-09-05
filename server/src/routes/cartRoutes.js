import express from "express";
import { getCart,addCart,removeCart } from "../controllers/cartController.js";
import { authJWT } from "../middleware/authJWT.js";

const router = express.Router();

router.get("/see",authJWT, getCart);
router.post("/add",authJWT, addCart);
router.delete("/drop",authJWT, removeCart);

export default router;