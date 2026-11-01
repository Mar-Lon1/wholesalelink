/**
 * Global error handler. Never leaks stack traces in production.
 */
function errorHandler(err, req, res, _next) {
  const isDev = process.env.NODE_ENV !== 'production';

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  // Prisma known errors
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'A record with that value already exists' });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  if (isDev) {
    console.error('[ERROR]', err);
  } else {
    console.error('[ERROR]', statusCode, message);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && !isDev ? 'Internal server error' : message,
    ...(isDev && { stack: err.stack }),
  });
}

/**
 * 404 handler for unmatched routes.
 */
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}

/**
 * Helper to create structured HTTP errors.
 */
function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

module.exports = { errorHandler, notFound, createError };
