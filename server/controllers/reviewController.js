const Review = require('../models/Review');
const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');
const Entrepreneur = require('../models/Entrepreneur');
const Product = require('../models/Product');

// CUSTOMER: Submit a review
const createReview = async (req, res) => {
    try {
        const {
            entrepreneurId,
            productId,
            orderId,
            rating,
            comment,
        } = req.body;

        if (
            !entrepreneurId ||
            !orderId ||
            !rating ||
            !comment
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required review details.',
            });
        }

        if (
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5.',
            });
        }

        const entrepreneur = await Entrepreneur.findById(entrepreneurId);

        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: 'Entrepreneur not found.',
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            customer: req.user._id,
            entrepreneur: entrepreneurId,
            status: 'completed',
        });

        if (!order) {
            return res.status(403).json({
                success: false,
                message: 'Only customers with completed orders can review.',
            });
        }

        let product = null;

        if (productId) {
            product = await Product.findOne({
                _id: productId,
                entrepreneur: entrepreneurId,
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.',
                });
            }

            const purchasedProduct = order.items.some(
                (item) => item.product.toString() === productId
            );

            if (!purchasedProduct) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only review products you purchased.',
                });
            }
        }

        const existingReview = await Review.findOne({
            customer: req.user._id,
            order: orderId,
            ...(productId ? { product: productId } : { product: null }),
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this order.',
            });
        }

        const review = await Review.create({
            customer: req.user._id,
            entrepreneur: entrepreneurId,
            product: productId || undefined,
            order: orderId,
            rating: Number(rating),
            comment: comment.trim(),
        });

        // Update entrepreneur's average rating
        const ratingStats = await Review.aggregate([
            {
                $match: {
                    entrepreneur: entrepreneur._id,
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        if (ratingStats.length > 0) {
            await Entrepreneur.findByIdAndUpdate(
                entrepreneurId,
                {
                    averageRating: Number(
                        ratingStats[0].averageRating.toFixed(2)
                    ),
                    totalReviews: ratingStats[0].totalReviews,
                }
            );
        }

        return res.status(201).json({
            success: true,
            message: 'Review submitted successfully!',
            data: review,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to submit review.',
        });
    }
};

// PUBLIC: Get entrepreneur reviews
const getEntrepreneurReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            entrepreneur: req.params.entrepreneurId,
        })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch reviews.',
        });
    }
};

// PUBLIC: Get product reviews
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId,
        })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch product reviews.',
        });
    }
};

module.exports = {
    createReview,
    getEntrepreneurReviews,
    getProductReviews,
};