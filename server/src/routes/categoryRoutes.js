import express from 'express';
import { getAllCategories,createCategory,getCategoryById,updateCategory,deleteCategory } from '../controllers/categoryController.js';


const router = express.Router();

router.get('/see',getAllCategories);
router.post('/create',createCategory);
router.get('/see/:id',getCategoryById);
router.put('/update',updateCategory);
router.delete('/drop',deleteCategory);

export default router;