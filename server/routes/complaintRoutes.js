const express = require('express');
const router = express.Router();

const {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaint,
} = require('../controllers/complaintController');

const {
    protect,
    authorize,
} = require('../middleware/authMiddleware');

// CUSTOMER / ENTREPRENEUR: Submit complaint
router.post(
    '/',
    protect,
    authorize('customer', 'entrepreneur'),
    createComplaint
);

// CUSTOMER / ENTREPRENEUR: View own complaints
router.get(
    '/my',
    protect,
    authorize('customer', 'entrepreneur'),
    getMyComplaints
);

// ADMIN: View all complaints
router.get(
    '/admin/all',
    protect,
    authorize('admin'),
    getAllComplaints
);

// ADMIN: Update complaint status and response
router.patch(
    '/admin/:id',
    protect,
    authorize('admin'),
    updateComplaint
);

module.exports = router;