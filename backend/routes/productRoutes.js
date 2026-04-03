import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { productValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, productValidation, createProduct);
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, productValidation, updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;
