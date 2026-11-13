const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
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

        service: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        preferredDate: {
            type: Date,
        },

        agreedPrice: {
            type: Number,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                'pending',
                'accepted',
                'rejected',
                'in_progress',
                'completed',
                'cancelled',
            ],
            default: 'pending',
        },

        entrepreneurResponse: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const ServiceRequest = mongoose.model(
    'ServiceRequest',
    serviceRequestSchema
);

module.exports = ServiceRequest;