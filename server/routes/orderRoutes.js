const express = require('express');
const router = express.Router();

const {
    createOrder,
    getCustomerOrders,
    getEntrepreneurOrders,
    updateOrderStatus,
    getAllOrders,
} = require('../controllers/orderController');

const {
    protect,
    authorize,
} = require('../middleware/authMiddleware');

// CUSTOMER: Place order and view order history
router.post('/', protect, authorize('customer'), createOrder);

router.get('/my-orders', protect, authorize('customer'), getCustomerOrders);

// ENTREPRENEUR: Manage received orders
router.get(
    '/received',
    protect,
    authorize('entrepreneur'),
    getEntrepreneurOrders
);

router.patch(
    '/:id/status',
    protect,
    authorize('entrepreneur'),
    updateOrderStatus
);

// ADMIN: Monitor all orders
router.get(
    '/admin/all',
    protect,
    authorize('admin'),
    getAllOrders
);

module.exports = router;