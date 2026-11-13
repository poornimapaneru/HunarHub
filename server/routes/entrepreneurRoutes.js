const express = require('express');
const router = express.Router();

const {
    getEntrepreneurs,
    getMyProfile,
    createProfile,
    updateProfile,
    getAllEntrepreneurs,
    updateVerificationStatus
} = require('../controllers/entrepreneurController');

const { getEntrepreneurEarnings } = require('../controllers/earningsController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getEntrepreneurs);

// Entrepreneur Routes
router.get('/my-profile', protect, authorize('entrepreneur'), getMyProfile);
router.post('/my-profile', protect, authorize('entrepreneur'), createProfile);
router.put('/my-profile', protect, authorize('entrepreneur'), updateProfile);

// Entrepreneur Earnings
router.get('/my-earnings', protect, authorize('entrepreneur'), getEntrepreneurEarnings);

// Admin Routes
router.get('/admin/all', protect, authorize('admin'), getAllEntrepreneurs);
router.patch('/admin/:id/verification', protect, authorize('admin'), updateVerificationStatus);

module.exports = router;