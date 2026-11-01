const { z } = require('zod');
const prisma = require('../../config/prisma');
const { createError } = require('../../middleware/errorMiddleware');

// Allowed status transitions
const STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

// Retailer can only cancel while PENDING
const RETAILER_CANCELLABLE_STATUSES = ['PENDING'];

function generateOrderRef() {
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `WL-${ym}-${rand}`;
}

const createOrderSchema = z.object({
  wholesalerId: z.string().min(1, 'Wholesaler ID is required'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'At least one item is required'),
  deliveryMethod: z.enum(['PICKUP', 'DELIVERY']).default('PICKUP'),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

async function createOrder(req, res, next) {
  try {
    const data = createOrderSchema.parse(req.body);

    // Validate wholesaler exists and is active
    const wholesaler = await prisma.user.findFirst({
      where: { id: data.wholesalerId, role: 'WHOLESALER' },
      include: { profile: true },
    });
    if (!wholesaler || !wholesaler.profile?.active) {
      throw createError(400, 'Wholesaler not found or inactive');
    }

    // Fetch and validate all products
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true, wholesalerId: data.wholesalerId },
    });

    if (products.length !== productIds.length) {
      throw createError(400, 'One or more products are invalid, inactive, or do not belong to this wholesaler');
    }

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    let subtotal = 0;

    // Validate quantities
    for (const item of data.items) {
      const product = productMap[item.productId];
      if (item.quantity < product.minimumOrderQuantity) {
        throw createError(
          400,
          `Minimum order for "${product.name}" is ${product.minimumOrderQuantity} ${product.unit}`
        );
      }
      if (item.quantity > product.availableQuantity) {
        throw createError(
          400,
          `Insufficient stock for "${product.name}". Available: ${product.availableQuantity} ${product.unit}`
        );
      }
      subtotal += parseFloat(product.price) * item.quantity;
    }

    // Create order with snapshot items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          reference: generateOrderRef(),
          retailerId: req.user.id,
          wholesalerId: data.wholesalerId,
          deliveryMethod: data.deliveryMethod,
          deliveryAddress: data.deliveryAddress,
          notes: data.notes,
          subtotal: subtotal.toFixed(2),
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              productName: productMap[item.productId].name,
              productUnit: productMap[item.productId].unit,
              priceAtOrder: productMap[item.productId].price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return newOrder;
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: { order } });
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    let where = {};
    if (req.user.role === 'RETAILER') {
      where.retailerId = req.user.id;
    } else if (req.user.role === 'WHOLESALER') {
      where.wholesalerId = req.user.id;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          retailer: { select: { profile: { select: { businessName: true, contactName: true, phone: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: { select: { id: true, name: true, active: true } } } },
        retailer: { select: { profile: true } },
      },
    });

    if (!order) throw createError(404, 'Order not found');

    // Role-scoped access
    if (req.user.role === 'RETAILER' && order.retailerId !== req.user.id) {
      throw createError(403, 'Forbidden');
    }
    if (req.user.role === 'WHOLESALER' && order.wholesalerId !== req.user.id) {
      throw createError(403, 'Forbidden');
    }

    res.json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = z
      .object({ status: z.enum(['CONFIRMED', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED']) })
      .parse(req.body);

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) throw createError(404, 'Order not found');

    // Authorization
    if (req.user.role === 'WHOLESALER' && order.wholesalerId !== req.user.id) {
      throw createError(403, 'Forbidden');
    }
    if (req.user.role === 'RETAILER') {
      // Retailer can only cancel while pending
      if (status !== 'CANCELLED') throw createError(403, 'Retailers can only cancel orders');
      if (!RETAILER_CANCELLABLE_STATUSES.includes(order.status)) {
        throw createError(400, `Cannot cancel order in status "${order.status}"`);
      }
    }

    // Validate transition
    const allowed = STATUS_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw createError(400, `Cannot transition from ${order.status} to ${status}`);
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true },
    });

    res.json({ success: true, message: `Order status updated to ${status}`, data: { order: updated } });
  } catch (err) {
    next(err);
  }
}

async function reorder(req, res, next) {
  try {
    const originalOrder = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });

    if (!originalOrder) throw createError(404, 'Order not found');
    if (originalOrder.retailerId !== req.user.id) throw createError(403, 'Forbidden');

    // Re-validate current product availability
    const productIds = originalOrder.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    const unavailable = originalOrder.items.filter((i) => !productMap[i.productId]);

    if (unavailable.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Some products are no longer available',
        data: { unavailable: unavailable.map((i) => i.productName) },
      });
    }

    let subtotal = 0;
    for (const item of originalOrder.items) {
      const product = productMap[item.productId];
      if (item.quantity > product.availableQuantity) {
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.availableQuantity}`,
        });
      }
      subtotal += parseFloat(product.price) * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        reference: generateOrderRef(),
        retailerId: req.user.id,
        wholesalerId: originalOrder.wholesalerId,
        deliveryMethod: originalOrder.deliveryMethod,
        deliveryAddress: originalOrder.deliveryAddress,
        subtotal: subtotal.toFixed(2),
        items: {
          create: originalOrder.items.map((item) => ({
            productId: item.productId,
            productName: productMap[item.productId].name,
            productUnit: productMap[item.productId].unit,
            priceAtOrder: productMap[item.productId].price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, message: 'Reorder placed successfully', data: { order } });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, reorder };
