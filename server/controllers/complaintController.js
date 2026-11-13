const Complaint = require('../models/Complaint');

// CUSTOMER / ENTREPRENEUR: Submit a complaint
const createComplaint = async (req, res) => {
    try {
        const {
            againstUser,
            order,
            serviceRequest,
            subject,
            description,
        } = req.body;

        if (!subject || !subject.trim() || !description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Subject and description are required.',
            });
        }

        if (order && serviceRequest) {
            return res.status(400).json({
                success: false,
                message: 'A complaint can reference either an order or a service request, not both.',
            });
        }

        const complaint = await Complaint.create({
            reportedBy: req.user._id,
            againstUser: againstUser || undefined,
            order: order || undefined,
            serviceRequest: serviceRequest || undefined,
            subject: subject.trim(),
            description: description.trim(),
        });

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully.',
            complaint,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit complaint.',
        });
    }
};

// CUSTOMER / ENTREPRENEUR: View own complaints
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            reportedBy: req.user._id,
        })
            .populate('againstUser', 'name email')
            .populate('order')
            .populate('serviceRequest')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your complaints.',
        });
    }
};

// ADMIN: View all complaints
const getAllComplaints = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};

        if (status) {
            const validStatuses = [
                'open',
                'under_review',
                'resolved',
                'rejected',
            ];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid complaint status.',
                });
            }

            filter.status = status;
        }

        const complaints = await Complaint.find(filter)
            .populate('reportedBy', 'name email role')
            .populate('againstUser', 'name email role')
            .populate('order')
            .populate('serviceRequest')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch complaints.',
        });
    }
};

// ADMIN: Update complaint status and response
const updateComplaint = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;

        const validStatuses = [
            'open',
            'under_review',
            'resolved',
            'rejected',
        ];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid complaint status.',
            });
        }

        if (
            adminResponse !== undefined &&
            typeof adminResponse !== 'string'
        ) {
            return res.status(400).json({
                success: false,
                message: 'Admin response must be text.',
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.',
            });
        }

        complaint.status = status;

        if (adminResponse !== undefined) {
            complaint.adminResponse = adminResponse.trim();
        }

        if (status === 'resolved' || status === 'rejected') {
            complaint.resolvedAt = new Date();
        } else {
            complaint.resolvedAt = undefined;
        }

        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Complaint updated successfully.',
            complaint,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update complaint.',
        });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaint,
};