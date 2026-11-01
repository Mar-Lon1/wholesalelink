const express = require('express');
const { getMe, updateMe } = require('./users.controller');
const { authenticate } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

module.exports = router;
