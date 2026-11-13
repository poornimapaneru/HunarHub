const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Entrepreneur = require('../models/Entrepreneur');

// CUSTOMER: Place a new order
const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (
            !Array.isArray(items) ||
            items.length === 0 ||
            !shippingAddress
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide order items and shipping details.',
            });
        }

        if (
            !shippingAddress.name ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: 'Complete shipping address is required.',
            });
        }

        if (
            paymentMethod &&
            !['cash_on_delivery', 'pay_on_pickup'].includes(paymentMethod)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method.',
            });
        }

        let createdOrder;

        await session.withTransaction(async () => {
            const orderItems = [];
            let totalAmount = 0;
            let entrepreneurId = null;

            for (const item of items) {
                if (
                    !mongoose.isValidObjectId(item.product) ||
                    !Number.isInteger(Number(item.quantity)) ||
                    Number(item.quantity) < 1
                ) {
                    throw new Error('Invalid product or quantity.');
                }

                const product = await Product.findOne({
                    _id: item.product,
                    status: 'active',
                    isAvailable: true,
                }).session(session);

                if (!product) {
                    throw new Error('Product is unavailable.');
                }

                if (
                    entrepreneurId &&
                    entrepreneurId.toString() !== product.entrepreneur.toString()
                ) {
                    throw new Error(
                        'Please place separate orders for different entrepreneurs.'
                    );
                }

                entrepreneurId = product.entrepreneur;

                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: product._id,
                        stock: { $gte: Number(item.quantity) },
                        status: 'active',
                        isAvailable: true,
                    },
                    {
                        $inc: { stock: -Number(item.quantity) },
                    },
                    {
                        new: true,
                        session,
                    }
                );

                if (!updatedProduct) {
                    throw new Error('Insufficient product stock.');
                }

                updatedProduct.isAvailable = updatedProduct.stock > 0;
                await updatedProduct.save({ session });

                const itemTotal =
                    product.price * Number(item.quantity);

                totalAmount += itemTotal;

                orderItems.push({
                    product: product._id,
                    productName: product.name,
                    price: product.price,
                    quantity: Number(item.quantity),
                });
            }

            const [order] = await Order.create(
                [
                    {
                        customer: req.user._id,
                        entrepreneur: entrepreneurId,
                        items: orderItems,
                        totalAmount,
                        shippingAddress,
                        paymentMethod: paymentMethod || 'cash_on_delivery',
                    },
                ],
                { session }
            );

            createdOrder = order;
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            data: createdOrder,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Unable to place order.',
        });

    } finally {
        await session.endSession();
    }
};

// CUSTOMER: View own order history
const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            customer: req.user._id,
        })
            .populate('entrepreneur', 'name location')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch order history.',
        });
    }
};

// ENTREPRENEUR: View received orders
const getEntrepreneurOrders = async (req, res) => {
    try {
        const entrepreneur = await Entrepreneur.findOne({
            user: req.user._id,
        });

        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: 'Entrepreneur profile not found.',
            });
        }

        const orders = await Order.find({
            entrepreneur: entrepreneur._id,
        })
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch received orders.',
        });
    }
};

// ENTREPRENEUR: Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const entrepreneur = await Entrepreneur.findOne({
            user: req.user._id,
            verificationStatus: 'approved',
        });

        if (!entrepreneur) {
            return res.status(403).json({
                success: false,
                message: 'Approved entrepreneur profile required.',
            });
        }

        const { status } = req.body;

        const allowedTransitions = {
            confirmed: ['pending'],
            processing: ['confirmed'],
            completed: ['processing'],
            cancelled: ['pending', 'confirmed'],
        };

        if (!allowedTransitions[status]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status.',
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                entrepreneur: entrepreneur._id,
                status: { $in: allowedTransitions[status] },
            },
            {
                $set: { status },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!order) {
            return res.status(409).json({
                success: false,
                message: 'Order not found or status transition not allowed.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully!',
            data: order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update order status.',
        });
    }
};

// ADMIN: View and monitor all orders
const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate('customer', 'name email phone')
            .populate('entrepreneur', 'name location')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 });

        const totalRevenue = orders.reduce(
            (total, order) => total + order.totalAmount,
            0
        );

        return res.status(200).json({
            success: true,
            count: orders.length,
            totalRevenue,
            data: orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch all orders.',
        });
    }
};

module.exports = {
    createOrder,
    getCustomerOrders,
    getEntrepreneurOrders,
    updateOrderStatus,
    getAllOrders,
};