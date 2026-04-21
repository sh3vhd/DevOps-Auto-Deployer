const { Router } = require('express');
const { authRequired } = require('../middleware/auth.middleware');
const { createOrder, getMyOrders, getOrderById } = require('../controllers/order.controller');

const router = Router();

router.use(authRequired);
router.post('/', createOrder);
router.get('/me', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
