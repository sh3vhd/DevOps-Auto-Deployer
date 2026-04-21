const { z } = require('zod');
const { prisma } = require('../prisma/client');

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive().optional()
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).nonempty(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2)
  })
});

async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress } = createOrderSchema.parse(req.body);

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== items.length) {
      return res.status(400).json({ success: false, message: 'Invalid cart contents' });
    }

    const orderItems = [];
    let total = 0;

    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        const err = new Error(`Product ${item.productId} is out of stock`);
        err.status = 400;
        throw err;
      }
      const priceAtPurchase = Number(product.price);
      total += priceAtPurchase * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase
      });
    });

    // Use a transaction to persist the order and decrement stock atomically.
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: req.user.sub,
          total,
          status: 'PENDING',
          shippingAddress,
          items: {
            createMany: {
              data: orderItems
            }
          }
        },
        include: {
          items: true
        }
      });

      await Promise.all(
        orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          })
        )
      );

      return createdOrder;
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message
      }));
      const err = new Error('Validation failed');
      err.status = 422;
      err.errors = formatted;
      return next(err);
    }
    return next(error);
  }
}

async function getMyOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.sub },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
  return res.json({ success: true, data: orders });
}

async function getOrderById(req, res) {
  const { id } = req.params;
  const order = await prisma.order.findFirst({
    where: { id: Number(id), userId: req.user.sub },
    include: { items: true }
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  return res.json({ success: true, data: order });
}

async function adminListOrders(req, res) {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return res.json({ success: true, data: orders });
}

async function adminUpdateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status }
    });
    return res.json({ success: true, data: order });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.status(500).json({ success: false, message: 'Unable to update order' });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  adminListOrders,
  adminUpdateOrderStatus
};
