const express = require('express');
const router = express.Router();

const {
    getProducts,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

const {
    protect,
    authorize,
} = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// PUBLIC: Browse and search products
router.get('/', getProducts);

// ENTREPRENEUR: Manage own products
router.get('/my-products', protect, authorize('entrepreneur'), getMyProducts);

// Add product with up to 5 images
router.post(
    '/',
    protect,
    authorize('entrepreneur'),
    upload.array('images', 5),
    createProduct
);

// Update product with up to 5 images
router.put(
    '/:id',
    protect,
    authorize('entrepreneur'),
    upload.array('images', 5),
    updateProduct
);

// Delete product
router.delete('/:id', protect, authorize('entrepreneur'), deleteProduct);

module.exports = router;