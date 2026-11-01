const { z } = require('zod');
const prisma = require('../../config/prisma');
const { createError } = require('../../middleware/errorMiddleware');

const updateProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  contactName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  location: z.string().min(2).optional(),
  supplierType: z.string().optional(),
  description: z.string().optional(),
});

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const data = updateProfileSchema.parse(req.body);

    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: data,
      create: { userId: req.user.id, businessName: '', contactName: '', phone: '', location: '', ...data },
    });

    res.json({ success: true, message: 'Profile updated', data: { profile } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe };
