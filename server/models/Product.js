const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        entrepreneur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entrepreneur',
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        images: {
            type: [String],
            default: [],
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;