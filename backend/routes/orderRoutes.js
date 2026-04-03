import express from 'express';
import {
    addOrderItems,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderStats
} from '../controllers/orderController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(optionalProtect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

// Admin routes
router.route('/admin/all').get(protect, admin, getAllOrders);
router.route('/admin/stats').get(protect, admin, getOrderStats);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id').delete(protect, admin, deleteOrder);

export default router;
