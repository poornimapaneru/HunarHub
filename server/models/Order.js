const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        entrepreneur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entrepreneur',
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },

                productName: {
                    type: String,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        shippingAddress: {
            name: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },
        },

        status: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'processing',
                'completed',
                'cancelled',
            ],
            default: 'pending',
        },

        paymentMethod: {
            type: String,
            enum: ['cash_on_delivery', 'pay_on_pickup'],
            default: 'cash_on_delivery',
        },

        paymentStatus: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;