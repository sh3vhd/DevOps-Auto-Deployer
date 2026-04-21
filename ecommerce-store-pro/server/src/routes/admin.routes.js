const { Router } = require('express');
const { authRequired, adminOnly } = require('../middleware/auth.middleware');
const {
  adminListOrders,
  adminUpdateOrderStatus
} = require('../controllers/order.controller');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts
} = require('../controllers/product.controller');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

const router = Router();

router.use(authRequired, adminOnly);

router.get('/orders', adminListOrders);
router.patch('/orders/:id', adminUpdateOrderStatus);

router.get('/products', listProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/categories', listCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
