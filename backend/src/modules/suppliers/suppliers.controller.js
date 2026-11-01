const prisma = require('../../config/prisma');

async function getSuppliers(req, res, next) {
  try {
    const { search, location, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      role: 'WHOLESALER',
      profile: {
        active: true,
        ...(search && {
          businessName: { contains: search, mode: 'insensitive' },
        }),
        ...(location && { location: { contains: location, mode: 'insensitive' } }),
      },
    };

    const [suppliers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          profile: {
            select: {
              businessName: true,
              supplierType: true,
              contactName: true,
              phone: true,
              location: true,
              description: true,
              active: true,
            },
          },
          _count: { select: { products: { where: { active: true } } } },
        },
        skip,
        take: limitNum,
        orderBy: { profile: { businessName: 'asc' } },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        suppliers,
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

async function getSupplierById(req, res, next) {
  try {
    const { id } = req.params;

    const supplier = await prisma.user.findFirst({
      where: { id, role: 'WHOLESALER' },
      select: {
        id: true,
        profile: true,
        products: {
          where: { active: true },
          orderBy: { name: 'asc' },
        },
        _count: { select: { products: { where: { active: true } } } },
      },
    });

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.json({ success: true, data: { supplier } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSuppliers, getSupplierById };
