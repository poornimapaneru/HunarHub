const express = require('express');
const router = express.Router();

const {
    createReview,
    getEntrepreneurReviews,
    getProductReviews,
} = require('../controllers/reviewController');

const {
    protect,
    authorize,
} = require('../middleware/authMiddleware');

// CUSTOMER: Submit a review
router.post(
    '/',
    protect,
    authorize('customer'),
    createReview
);

// PUBLIC: View entrepreneur reviews
router.get(
    '/entrepreneur/:entrepreneurId',
    getEntrepreneurReviews
);

// PUBLIC: View product reviews
router.get(
    '/product/:productId',
    getProductReviews
);

module.exports = router;