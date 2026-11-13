const express = require('express');
const router = express.Router();

// Import Authentication Middleware
const {
    protect,
    authorize
} = require('../middleware/authMiddleware');

// Import Analytics Controller
const {
    getAdminAnalytics
} = require('../controllers/analyticsController');

// Admin Analytics Route
router.get(
    '/',
    protect,
    authorize('admin'),
    getAdminAnalytics
);

module.exports = router;