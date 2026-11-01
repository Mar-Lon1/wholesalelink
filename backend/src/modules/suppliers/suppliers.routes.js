const express = require('express');
const { getSuppliers, getSupplierById } = require('./suppliers.controller');

const router = express.Router();

// Public endpoints — no auth required for browsing
router.get('/', getSuppliers);
router.get('/:id', getSupplierById);

module.exports = router;
