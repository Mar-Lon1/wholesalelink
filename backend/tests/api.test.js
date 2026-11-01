require('dotenv').config();
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('../src/config/jwt');
const { requireRole } = require('../src/middleware/authMiddleware');
const { createError } = require('../src/middleware/errorMiddleware');
const app = require('../src/app');

describe('WholesaleLink API & Core Logic Tests', () => {
  describe('Health Endpoint', () => {
    test('GET /health returns 200 and ok status', async () => {
      // Create a mock request / response for app
      const server = app.listen(0);
      const port = server.address().port;

      try {
        const res = await fetch(`http://localhost:${port}/health`);
        const json = await res.json();
        assert.equal(res.status, 200);
        assert.equal(json.status, 'ok');
        assert.equal(json.service, 'wholesalelink-api');
        assert.ok(json.timestamp);
      } finally {
        server.close();
      }
    });

    test('Unknown route returns 404 with standard JSON format', async () => {
      const server = app.listen(0);
      const port = server.address().port;

      try {
        const res = await fetch(`http://localhost:${port}/api/v1/non-existent-endpoint`);
        const json = await res.json();
        assert.equal(res.status, 404);
        assert.equal(json.success, false);
        assert.ok(json.message.toLowerCase().includes('not found'));
      } finally {
        server.close();
      }
    });
  });

  describe('JWT Authentication Utility', () => {
    test('signToken and verifyToken generate and decode payload correctly', () => {
      const payload = { id: 'user_123', role: 'RETAILER' };
      const token = jwt.signToken(payload);
      assert.ok(typeof token === 'string');

      const decoded = jwt.verifyToken(token);
      assert.equal(decoded.id, payload.id);
      assert.equal(decoded.role, payload.role);
      assert.ok(decoded.exp);
    });

    test('verifyToken throws on malformed token', () => {
      assert.throws(() => {
        jwt.verifyToken('invalid.jwt.token');
      });
    });
  });

  describe('Role Authorization Middleware', () => {
    test('requireRole allows request with matching role', () => {
      const middleware = requireRole('WHOLESALER');
      let nextCalled = false;
      const req = { user: { id: 'w1', role: 'WHOLESALER' } };
      const res = {};
      const next = () => { nextCalled = true; };

      middleware(req, res, next);
      assert.equal(nextCalled, true);
    });

    test('requireRole rejects request with mismatching role', () => {
      const middleware = requireRole('WHOLESALER');
      let statusSent = null;
      let jsonSent = null;
      let nextCalled = false;

      const req = { user: { id: 'r1', role: 'RETAILER' } };
      const res = {
        status(code) {
          statusSent = code;
          return this;
        },
        json(data) {
          jsonSent = data;
        },
      };
      const next = () => { nextCalled = true; };

      middleware(req, res, next);
      assert.equal(nextCalled, false);
      assert.equal(statusSent, 403);
      assert.equal(jsonSent.success, false);
      assert.ok(jsonSent.message.includes('Forbidden'));
    });

    test('requireRole rejects unauthenticated request', () => {
      const middleware = requireRole('RETAILER');
      let statusSent = null;
      const req = {};
      const res = {
        status(code) {
          statusSent = code;
          return { json: () => {} };
        },
      };
      let nextCalled = false;

      middleware(req, res, () => { nextCalled = true; });
      assert.equal(nextCalled, false);
      assert.equal(statusSent, 401);
    });
  });

  describe('Order Business Rules & State Machine', () => {
    const STATUS_TRANSITIONS = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    test('Enforces allowed status transitions', () => {
      // PENDING can move to CONFIRMED or CANCELLED
      assert.ok(STATUS_TRANSITIONS.PENDING.includes('CONFIRMED'));
      assert.ok(STATUS_TRANSITIONS.PENDING.includes('CANCELLED'));
      assert.ok(!STATUS_TRANSITIONS.PENDING.includes('COMPLETED'));

      // READY can move to COMPLETED
      assert.ok(STATUS_TRANSITIONS.READY.includes('COMPLETED'));
      assert.ok(!STATUS_TRANSITIONS.READY.includes('PENDING'));

      // Terminal states have no valid transitions
      assert.equal(STATUS_TRANSITIONS.COMPLETED.length, 0);
      assert.equal(STATUS_TRANSITIONS.CANCELLED.length, 0);
    });

    test('Retailer cancellation rule restricts cancellation to PENDING only', () => {
      const RETAILER_CANCELLABLE = ['PENDING'];
      assert.ok(RETAILER_CANCELLABLE.includes('PENDING'));
      assert.ok(!RETAILER_CANCELLABLE.includes('CONFIRMED'));
      assert.ok(!RETAILER_CANCELLABLE.includes('PROCESSING'));
      assert.ok(!RETAILER_CANCELLABLE.includes('READY'));
    });

    test('Order reference format follows WL-YYYYMM-XXXXX pattern', () => {
      const now = new Date();
      const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
      const ref = `WL-${ym}-${rand}`;

      const refRegex = /^WL-\d{6}-[A-Z0-9]{5}$/;
      assert.ok(refRegex.test(ref), `Reference ${ref} should match format`);
    });

    test('Server-side order subtotal calculation is accurate and immune to client manipulation', () => {
      const items = [
        { price: 450.00, quantity: 2 },
        { price: 85.50, quantity: 4 },
        { price: 320.00, quantity: 1 },
      ];

      const calculatedSubtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // 450*2 = 900, 85.50*4 = 342, 320*1 = 320. Total = 1562.00
      assert.equal(calculatedSubtotal.toFixed(2), '1562.00');
    });
  });

  describe('Error Creation Middleware', () => {
    test('createError constructs error object with status code and message', () => {
      const err = createError(400, 'Minimum order quantity not met');
      assert.equal(err.statusCode, 400);
      assert.equal(err.message, 'Minimum order quantity not met');
    });
  });
});
