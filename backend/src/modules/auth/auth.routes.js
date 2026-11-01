const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, logout, me } = require('./auth.controller');
const { authenticate } = require('../../middleware/authMiddleware');

const router = express.Router();

// Rate limit: 10 auth attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

module.exports = router;
