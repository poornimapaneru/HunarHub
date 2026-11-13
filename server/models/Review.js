const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;