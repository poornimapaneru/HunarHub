const express = require('express');
const router = express.Router();

const {
    getActiveCategories,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

const {
    protect,
    authorize,
} = require('../middleware/authMiddleware');

// PUBLIC: View active categories
router.get('/', getActiveCategories);

// ADMIN: View all categories
router.get('/admin/all', protect, authorize('admin'), getAllCategories);

// ADMIN: Create category
router.post('/', protect, authorize('admin'), createCategory);

// ADMIN: Update category
router.put('/:id', protect, authorize('admin'), updateCategory);

// ADMIN: Deactivate category
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;