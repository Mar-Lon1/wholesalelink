const { z } = require('zod');
const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');
const { signToken, setAuthCookie, clearAuthCookie } = require('../../config/jwt');
const { createError } = require('../../middleware/errorMiddleware');

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['RETAILER', 'WHOLESALER'], { required_error: 'Role must be RETAILER or WHOLESALER' }),
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  location: z.string().min(2, 'Location is required'),
  supplierType: z.string().optional(),
  description: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw createError(409, 'An account with that email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        profile: {
          create: {
            businessName: data.businessName,
            contactName: data.contactName,
            phone: data.phone,
            location: data.location,
            supplierType: data.supplierType,
            description: data.description,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
      },
    });

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    res.status(201).json({ success: true, message: 'Registration successful', data: { user, token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true },
    });

    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatch) {
      throw createError(401, 'Invalid email or password');
    }

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, message: 'Login successful', data: { user: safeUser, token } });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
}

async function me(req, res) {
  res.json({ success: true, data: { user: req.user } });
}

module.exports = { register, login, logout, me };
