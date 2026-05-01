import express from 'express';
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getMyReviews
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { reviewValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.route('/product/:id').get(getProductReviews);

// Protected routes
router.route('/').post(protect, reviewValidation, createReview);
router.route('/myreviews').get(protect, getMyReviews);
router.route('/:id')
    .put(protect, reviewValidation, updateReview)
    .delete(protect, deleteReview);

export default router;
