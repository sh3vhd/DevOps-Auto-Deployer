const { z } = require('zod');
const { prisma } = require('../prisma/client');

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2)
});

async function listCategories(req, res) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return res.json({ success: true, data: categories });
}

async function createCategory(req, res, next) {
  try {
    const payload = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data: payload });
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return next(handleZodError(error));
  }
}

async function updateCategory(req, res, next) {
  try {
    const payload = categorySchema.partial().parse(req.body);
    const { id } = req.params;
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: payload
    });
    return res.json({ success: true, data: category });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return next(handleZodError(error));
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: Number(id) } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(500).json({ success: false, message: 'Unable to delete category' });
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
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
