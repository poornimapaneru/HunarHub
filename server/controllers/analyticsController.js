const User = require('../models/User');
const Entrepreneur = require('../models/Entrepreneur');
const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');
const Review = require('../models/Review');

// ==========================================
// ADMIN ANALYTICS AND DASHBOARD KPIs
// ==========================================

const getAdminAnalytics = async (req, res) => {
    try {

        // 1. USER ANALYTICS
        const [
            totalRegisteredEntrepreneurs,
            totalActiveUsers,
            totalRegisteredCustomers,
            totalApprovedEntrepreneurs
        ] = await Promise.all([

            User.countDocuments({
                role: 'entrepreneur'
            }),

            User.countDocuments({
                role: { $in: ['customer', 'entrepreneur'] },
                isActive: true
            }),

            User.countDocuments({
                role: 'customer'
            }),

            Entrepreneur.countDocuments({
                verificationStatus: 'approved'
            })

        ]);


        // 2. SERVICE REQUEST ANALYTICS
        const [
            totalServiceRequests,
            convertedServiceRequests,
            completedServiceRequests
        ] = await Promise.all([

            ServiceRequest.countDocuments(),

            ServiceRequest.countDocuments({
                status: {
                    $in: ['accepted', 'in_progress', 'completed']
                }
            }),

            ServiceRequest.countDocuments({
                status: 'completed'
            })

        ]);

        const serviceRequestConversionRate =
            totalServiceRequests > 0
                ? Number(
                    (
                        (convertedServiceRequests / totalServiceRequests) * 100
                    ).toFixed(2)
                )
                : 0;


        // 3. PRODUCT SALES ANALYTICS
        const productSales = await Order.aggregate([

            {
                $match: {
                    status: 'completed'
                }
            },

            {
                $group: {
                    _id: null,

                    totalProductsSold: {
                        $sum: {
                            $reduce: {
                                input: { $ifNull: ['$items', []] },
                                initialValue: 0,
                                in: {
                                    $add: ['$$value', '$$this.quantity']
                                }
                            }
                        }
                    },

                    totalCompletedOrders: {
                        $sum: 1
                    },

                    completedOrderValue: {
                        $sum: '$totalAmount'
                    }
                }
            }

        ]);

        const totalProductsSold =
            productSales.length > 0
                ? productSales[0].totalProductsSold
                : 0;

        const totalCompletedOrders =
            productSales.length > 0
                ? productSales[0].totalCompletedOrders
                : 0;

        const completedOrderValue =
            productSales.length > 0
                ? productSales[0].completedOrderValue
                : 0;


        // 4. COMPLETED ORDER EARNINGS PER ENTREPRENEUR
        const orderEarnings = await Order.aggregate([

            {
                $match: {
                    status: 'completed'
                }
            },

            {
                $group: {
                    _id: '$entrepreneur',

                    earnings: {
                        $sum: '$totalAmount'
                    }
                }
            }

        ]);


        // 5. COMPLETED SERVICE EARNINGS PER ENTREPRENEUR
        const serviceEarnings = await ServiceRequest.aggregate([

            {
                $match: {
                    status: 'completed',

                    agreedPrice: {
                        $type: 'number',
                        $gte: 0
                    }
                }
            },

            {
                $group: {
                    _id: '$entrepreneur',

                    earnings: {
                        $sum: '$agreedPrice'
                    }
                }
            }

        ]);


        // 6. COMBINE ENTREPRENEUR EARNINGS
        const entrepreneurEarnings = new Map();

        orderEarnings.forEach((item) => {

            const entrepreneurId = item._id.toString();

            entrepreneurEarnings.set(
                entrepreneurId,
                item.earnings
            );

        });

        serviceEarnings.forEach((item) => {

            const entrepreneurId = item._id.toString();

            const existingEarnings =
                entrepreneurEarnings.get(entrepreneurId) || 0;

            entrepreneurEarnings.set(
                entrepreneurId,
                existingEarnings + item.earnings
            );

        });

        let totalEstimatedEntrepreneurEarnings = 0;

        entrepreneurEarnings.forEach((earnings) => {

            totalEstimatedEntrepreneurEarnings += earnings;

        });

        // Average across all approved entrepreneur profiles
        const averageEntrepreneurEarnings =
            totalApprovedEntrepreneurs > 0
                ? Number(
                    (
                        totalEstimatedEntrepreneurEarnings /
                        totalApprovedEntrepreneurs
                    ).toFixed(2)
                )
                : 0;


        // 7. CUSTOMER SATISFACTION ANALYTICS
        const reviewAnalytics = await Review.aggregate([

            {
                $group: {
                    _id: null,

                    averageRating: {
                        $avg: '$rating'
                    },

                    totalReviews: {
                        $sum: 1
                    }
                }
            }

        ]);

        const averageCustomerRating =
            reviewAnalytics.length > 0
                ? Number(
                    reviewAnalytics[0].averageRating.toFixed(2)
                )
                : 0;

        const totalReviews =
            reviewAnalytics.length > 0
                ? reviewAnalytics[0].totalReviews
                : 0;


        // 8. SEND ANALYTICS RESPONSE
        res.status(200).json({

            success: true,

            message: 'Admin analytics fetched successfully',

            analytics: {

                users: {
                    totalRegisteredEntrepreneurs,
                    totalRegisteredCustomers,
                    totalActiveUsers,
                    totalApprovedEntrepreneurs
                },

                serviceRequests: {
                    totalServiceRequests,
                    convertedServiceRequests,
                    completedServiceRequests,
                    conversionRate: serviceRequestConversionRate
                },

                products: {
                    totalProductsSold,
                    totalCompletedOrders,
                    completedOrderValue
                },

                earnings: {
                    totalEstimatedEntrepreneurEarnings:
                        Number(totalEstimatedEntrepreneurEarnings.toFixed(2)),

                    averageEntrepreneurEarnings,

                    entrepreneursWithEarnings:
                        entrepreneurEarnings.size
                },

                customerSatisfaction: {
                    averageRating: averageCustomerRating,
                    totalReviews
                }

            }

        });

    } catch (error) {

        console.error('Admin Analytics Error:', error);

        res.status(500).json({

            success: false,

            message: 'Failed to fetch admin analytics',

            error: error.message

        });

    }
};


module.exports = {
    getAdminAnalytics
};