const ServiceRequest = require('../models/ServiceRequest');
const Entrepreneur = require('../models/Entrepreneur');

// CUSTOMER: Create a service request
const createServiceRequest = async (req, res) => {
    try {
        const {
            entrepreneurId,
            service,
            description,
            location,
            preferredDate,
        } = req.body;

        if (!entrepreneurId || !service || !description || !location) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required service details.',
            });
        }

        const entrepreneur = await Entrepreneur.findOne({
            _id: entrepreneurId,
            verificationStatus: 'approved',
            isAvailable: true,
        });

        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: 'Entrepreneur is unavailable or not approved.',
            });
        }

        const request = await ServiceRequest.create({
            customer: req.user._id,
            entrepreneur: entrepreneur._id,
            service,
            description,
            location,
            preferredDate,
        });

        return res.status(201).json({
            success: true,
            message: 'Service request submitted successfully!',
            data: request,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Unable to create service request.',
        });
    }
};

// CUSTOMER: View own service requests
const getCustomerRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({
            customer: req.user._id,
        })
            .populate('entrepreneur', 'name skill location')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch service requests.',
        });
    }
};

// ENTREPRENEUR: View received requests
const getEntrepreneurRequests = async (req, res) => {
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

        const requests = await ServiceRequest.find({
            entrepreneur: entrepreneur._id,
        })
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch received requests.',
        });
    }
};

// ENTREPRENEUR: Update request status
const updateRequestStatus = async (req, res) => {
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

        const { status, entrepreneurResponse, agreedPrice } = req.body;

        const allowedTransitions = {
            accepted: ['pending'],
            rejected: ['pending'],
            in_progress: ['accepted'],
            completed: ['in_progress'],
        };

        if (!allowedTransitions[status]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request status.',
            });
        }

        const updateData = {
            status,
        };

        if (entrepreneurResponse !== undefined) {
            updateData.entrepreneurResponse = entrepreneurResponse;
        }

        if (agreedPrice !== undefined) {
            const price = Number(agreedPrice);

            if (!Number.isFinite(price) || price < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid agreed price.',
                });
            }

            updateData.agreedPrice = price;
        }

        const request = await ServiceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                entrepreneur: entrepreneur._id,
                status: { $in: allowedTransitions[status] },
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!request) {
            return res.status(409).json({
                success: false,
                message: 'Request not found or status transition not allowed.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Service request status updated successfully!',
            data: request,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update service request.',
        });
    }
};

// CUSTOMER: Cancel own request
const cancelServiceRequest = async (req, res) => {
    try {
        const request = await ServiceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                customer: req.user._id,
                status: { $in: ['pending', 'accepted'] },
            },
            {
                $set: { status: 'cancelled' },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!request) {
            return res.status(409).json({
                success: false,
                message: 'Request not found or cannot be cancelled.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Service request cancelled successfully.',
            data: request,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to cancel service request.',
        });
    }
};

// ADMIN: View and monitor all service requests
const getAllServiceRequests = async (req, res) => {
    try {
        const { status } = req.query;

        const validStatuses = [
            'pending',
            'accepted',
            'rejected',
            'in_progress',
            'completed',
            'cancelled',
        ];

        const filter = {};

        if (status) {
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid service request status.',
                });
            }

            filter.status = status;
        }

        const requests = await ServiceRequest.find(filter)
            .populate('customer', 'name email phone')
            .populate('entrepreneur', 'name skill location')
            .sort({ createdAt: -1 });

        const summary = {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            accepted: requests.filter(r => r.status === 'accepted').length,
            rejected: requests.filter(r => r.status === 'rejected').length,
            inProgress: requests.filter(r => r.status === 'in_progress').length,
            completed: requests.filter(r => r.status === 'completed').length,
            cancelled: requests.filter(r => r.status === 'cancelled').length,
        };

        return res.status(200).json({
            success: true,
            summary,
            count: requests.length,
            data: requests,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch all service requests.',
        });
    }
};

module.exports = {
    createServiceRequest,
    getCustomerRequests,
    getEntrepreneurRequests,
    updateRequestStatus,
    cancelServiceRequest,
    getAllServiceRequests,
};