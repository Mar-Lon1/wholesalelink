const { z } = require('zod');
const prisma = require('../../config/prisma');
const { createError } = require('../../middleware/errorMiddleware');

const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().optional(),
  unit: z.string().min(1, 'Unit is required'),
  price: z.number().positive('Price must be positive'),
  minimumOrderQuantity: z.number().int().min(1).default(1),
  availableQuantity: z.number().int().min(0, 'Available quantity cannot be negative'),
  active: z.boolean().default(true),
});

const updateProductSchema = createProductSchema.partial();

async function getProducts(req, res, next) {
  try {
    const {
      search,
      category,
      supplierId,
      location,
      sortBy = 'name',
      sortOrder = 'asc',
      page = '1',
      limit = '24',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(48, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = { name: 'name', price: 'price', createdAt: 'createdAt' };
    const orderByField = allowedSortFields[sortBy] || 'name';
    const orderByDir = sortOrder === 'desc' ? 'desc' : 'asc';

    const where = {
      active: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category: { equals: category, mode: 'insensitive' } }),
      ...(supplierId && { wholesalerId: supplierId }),
      ...(location && {
        wholesaler: {
          profile: { location: { contains: location, mode: 'insensitive' } },
        },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          wholesaler: {
            select: {
              id: true,
              profile: {
                select: { businessName: true, location: true, supplierType: true },
              },
            },
          },
        },
        orderBy: { [orderByField]: orderByDir },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    // Distinct categories for filter UI
    const categories = await prisma.product.findMany({
      where: { active: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    res.json({
      success: true,
      data: {
        products,
        categories: categories.map((c) => c.category),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, active: true },
      include: {
        wholesaler: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const data = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        ...data,
        price: data.price,
        wholesalerId: req.user.id,
      },
    });

    res.status(201).json({ success: true, message: 'Product created', data: { product } });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const data = updateProductSchema.parse(req.body);

    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw createError(404, 'Product not found');
    if (existing.wholesalerId !== req.user.id) throw createError(403, 'Forbidden');

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ success: true, message: 'Product updated', data: { product } });
  } catch (err) {
    next(err);
  }
}

async function deactivateProduct(req, res, next) {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw createError(404, 'Product not found');
    if (existing.wholesalerId !== req.user.id) throw createError(403, 'Forbidden');

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { active: false },
    });

    res.json({ success: true, message: 'Product deactivated', data: { product } });
  } catch (err) {
    next(err);
  }
}

async function getMyProducts(req, res, next) {
  try {
    const { page = '1', limit = '24' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(48, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { wholesalerId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where: { wholesalerId: req.user.id } }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deactivateProduct, getMyProducts };
