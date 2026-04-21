const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { prisma } = require('../prisma/client');
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} = require('../utils/token');

const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number');

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true',
  domain: process.env.COOKIE_DOMAIN || undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

async function register(req, res, next) {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'USER'
      }
    });

    return respondWithTokens(user, res, 201);
  } catch (error) {
    return next(handleZodError(error));
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return respondWithTokens(user, res, 200);
  } catch (error) {
    return next(handleZodError(error));
  }
}

async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true }
    });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ success: true, message: 'Logged out successfully' });
}

async function refresh(req, res) {
  try {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(incomingToken);
    const stored = await prisma.refreshToken.findFirst({
      where: { token: incomingToken, revoked: false }
    });

    if (!stored) {
      return res.status(401).json({ success: false, message: 'Token has been revoked' });
    }

    if (stored.expiry && stored.expiry < new Date()) {
      await prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revoked: true }
      });
      return res.status(401).json({ success: false, message: 'Refresh token expired' });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true }
    });

    return respondWithTokens(user, res, 200);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
}

function handleZodError(error) {
  if (error instanceof z.ZodError) {
    const formatted = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message
    }));
    const err = new Error('Validation failed');
    err.status = 422;
    err.errors = formatted;
    return err;
  }
  return error;
}

async function respondWithTokens(user, res, statusCode) {
  // Issue short-lived access token for API calls and long-lived refresh token for silent renewal.
  const accessToken = createAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = createRefreshToken({ sub: user.id });

  const refreshExpiry = new Date();
  refreshExpiry.setDate(refreshExpiry.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiry: refreshExpiry,
      revoked: false
    }
  });

  // Cookies allow the SPA to refresh in the background while also returning tokens in the body for clients without cookie access.
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message: 'Authentication successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    }
  });
}

module.exports = {
  register,
  login,
  logout,
  refresh
};
