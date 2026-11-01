const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus, reorder } = require('./orders.controller');
const { authenticate, requireRole } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, requireRole('RETAILER'), createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);
router.post('/:id/reorder', authenticate, requireRole('RETAILER'), reorder);

module.exports = router;
