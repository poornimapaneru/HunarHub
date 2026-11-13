const express = require('express');
const router = express.Router();

// Import Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// Import Controllers
const {
    createServiceRequest,
    getCustomerRequests,
    getEntrepreneurRequests,
    updateRequestStatus,
    cancelServiceRequest,
    getAllServiceRequests
} = require('../controllers/serviceRequestController');


// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Create a new service request
router.post(
    '/',
    protect,
    authorize('customer'),
    createServiceRequest
);

// Get customer's own service requests
router.get(
    '/my-requests',
    protect,
    authorize('customer'),
    getCustomerRequests
);

// Cancel a service request
router.patch(
    '/:id/cancel',
    protect,
    authorize('customer'),
    cancelServiceRequest
);


// ==========================================
// ENTREPRENEUR ROUTES
// ==========================================

// Get requests received by entrepreneur
router.get(
    '/received',
    protect,
    authorize('entrepreneur'),
    getEntrepreneurRequests
);

// Update service request status
router.patch(
    '/:id/status',
    protect,
    authorize('entrepreneur'),
    updateRequestStatus
);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all service requests with status-wise summary
router.get(
    '/admin/all',
    protect,
    authorize('admin'),
    getAllServiceRequests
);


module.exports = router;