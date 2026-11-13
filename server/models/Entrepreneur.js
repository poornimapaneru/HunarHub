const mongoose = require('mongoose');

const entrepreneurSchema = new mongoose.Schema(
    {
        // Link Entrepreneur Profile with User Account
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
            sparse: true,
        },

        id: {
            type: Number,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        skill: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: String,
            required: true,
        },

        icon: {
            type: String,
            default: '👨‍🔧',
        },

        description: {
            type: String,
            required: true,
        },

        experience: {
            type: String,
            required: true,
        },

        services: {
            type: String,
            required: true,
        },

        // Product / Profile Gallery
        images: {
            type: [String],
            default: [],
        },

        // Entrepreneur Availability
        isAvailable: {
            type: Boolean,
            default: true,
        },

        // Admin Verification
        verificationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },

        // Ratings
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Entrepreneur = mongoose.model(
    'Entrepreneur',
    entrepreneurSchema
);

module.exports = Entrepreneur;