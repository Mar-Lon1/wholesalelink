require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route modules
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');
const supplierRoutes = require('./modules/suppliers/suppliers.routes');
const productRoutes = require('./modules/products/products.routes');
const orderRoutes = require('./modules/orders/orders.routes');

const app = express();

// Security headers
app.use(helmet());

// CORS — credentials mode required for HttpOnly cookies
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174,http://localhost:5175')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Check allowed origins list
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow any Vercel deployment (*.vercel.app)
      if (origin.endsWith('.vercel.app')) return callback(null, true);

      // In development allow any localhost / 127.0.0.1 port
      if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check (unauthenticated)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'wholesalelink-api' });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
