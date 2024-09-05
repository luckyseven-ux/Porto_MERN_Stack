import express from "express";
import {
  getProducts,
  postProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/see", getProducts);
router.post("/create", postProduct);
router.put("/update/:id", updateProduct);
router.delete("/drop/:id", deleteProduct);

export default router;