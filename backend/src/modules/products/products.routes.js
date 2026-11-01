const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  getMyProducts,
} = require('./products.controller');
const { authenticate, requireRole } = require('../../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Wholesaler only routes
router.get('/my/listings', authenticate, requireRole('WHOLESALER'), getMyProducts);
router.post('/', authenticate, requireRole('WHOLESALER'), createProduct);
router.patch('/:id', authenticate, requireRole('WHOLESALER'), updateProduct);
router.delete('/:id', authenticate, requireRole('WHOLESALER'), deactivateProduct);

module.exports = router;
