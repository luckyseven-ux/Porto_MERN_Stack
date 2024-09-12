import express from "express";
import {
  getProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/see", getProducts);
router.get("/see/:id", getProductById);
router.post("/create", postProduct);
router.put("/update/:id", updateProduct);
router.delete("/drop/:id", deleteProduct);

export default router;