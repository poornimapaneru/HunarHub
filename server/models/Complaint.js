const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        againstUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },

        serviceRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceRequest',
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ['open', 'under_review', 'resolved', 'rejected'],
            default: 'open',
        },

        adminResponse: {
            type: String,
            default: '',
        },

        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;