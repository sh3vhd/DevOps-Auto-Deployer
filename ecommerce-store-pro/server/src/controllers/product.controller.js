const { z } = require('zod');
const { prisma } = require('../prisma/client');

const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z
    .preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number())
    .optional(),
  maxPrice: z
    .preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number())
    .optional(),
  page: z
    .preprocess((val) => (val !== undefined ? Number(val) : 1), z.number().min(1))
    .optional(),
  limit: z
    .preprocess((val) => (val !== undefined ? Number(val) : 12), z.number().min(1))
    .optional()
});

const productBodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).nonempty(),
  categoryId: z.number().int()
});

async function listProducts(req, res, next) {
  try {
    const parsed = productQuerySchema.parse(req.query);
    const { q, category, minPrice, maxPrice } = parsed;
    const page = parsed.page ?? 1;
    const limit = parsed.limit ?? 12;
    const skip = (page - 1) * limit;

    const where = {};
    // Flexible OR search across name & description.
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (category) {
      where.category = {
        slug: category
      };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = Number(maxPrice);
      }
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    return next(handleZodError(error));
  }
}

async function getProductBySlug(req, res) {
  const { slug } = req.params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  return res.json({ success: true, data: product });
}

async function createProduct(req, res, next) {
  try {
    const payload = productBodySchema.parse(req.body);
    const product = await prisma.product.create({ data: payload });
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return next(handleZodError(error));
  }
}

async function updateProduct(req, res, next) {
  try {
    const payload = productBodySchema.partial().parse(req.body);
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: payload
    });
    return res.json({ success: true, data: product });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return next(handleZodError(error));
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(500).json({ success: false, message: 'Unable to delete product' });
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

module.exports = {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
