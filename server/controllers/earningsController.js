const Entrepreneur = require('../models/Entrepreneur');
const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');

// Get Entrepreneur Earnings Overview
const getEntrepreneurEarnings = async (req, res) => {
    try {
        const entrepreneur = await Entrepreneur.findOne({
            user: req.user._id
        });

        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: 'Entrepreneur profile not found'
            });
        }

        const [completedOrders, completedServices] = await Promise.all([
            Order.find({
                entrepreneur: entrepreneur._id,
                status: 'completed'
            }).select('totalAmount'),

            ServiceRequest.find({
                entrepreneur: entrepreneur._id,
                status: 'completed'
            }).select('agreedPrice')
        ]);

        const orderEarnings = completedOrders.reduce(
            (total, order) => total + Number(order.totalAmount || 0),
            0
        );

        const serviceEarnings = completedServices.reduce(
            (total, service) => total + Number(service.agreedPrice || 0),
            0
        );

        res.status(200).json({
            success: true,
            earnings: {
                completedOrders: completedOrders.length,
                completedServices: completedServices.length,
                orderEarnings,
                serviceEarnings,
                totalEstimatedEarnings: orderEarnings + serviceEarnings
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch earnings',
            error: error.message
        });
    }
};

module.exports = {
    getEntrepreneurEarnings
};