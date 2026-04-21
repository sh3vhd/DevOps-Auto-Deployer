const { Router } = require('express');
const {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { listCategories } = require('../controllers/category.controller');
const { authRequired, adminOnly } = require('../middleware/auth.middleware');

const router = Router();

router.get('/', listProducts);
router.get('/categories', listCategories);
router.get('/:slug', getProductBySlug);

router.post('/', authRequired, adminOnly, createProduct);
router.patch('/:id', authRequired, adminOnly, updateProduct);
router.delete('/:id', authRequired, adminOnly, deleteProduct);

module.exports = router;
