const Entrepreneur = require('../models/Entrepreneur');

// Fields entrepreneurs are allowed to create or update
const allowedFields = [
    'name',
    'skill',
    'category',
    'location',
    'price',
    'icon',
    'description',
    'experience',
    'services',
    'images',
    'isAvailable',
];

// PUBLIC: Get approved entrepreneurs
const getEntrepreneurs = async (req, res) => {
    try {
        const filter = {
            verificationStatus: 'approved',
        };

        const { search, category, location } = req.query;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { skill: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) {
            filter.category = {
                $regex: category,
                $options: 'i',
            };
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: 'i',
            };
        }

        const entrepreneurs = await Entrepreneur.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: entrepreneurs.length,
            data: entrepreneurs,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch entrepreneurs.',
        });
    }
};

// ENTREPRENEUR: Get own profile
const getMyProfile = async (req, res) => {
    try {
        const entrepreneur = await Entrepreneur.findOne({
            user: req.user._id,
        });

        return res.status(200).json({
            success: true,
            data: entrepreneur,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch your profile.',
        });
    }
};

// ENTREPRENEUR: Create profile
const createProfile = async (req, res) => {
    try {
        const existingProfile = await Entrepreneur.findOne({
            user: req.user._id,
        });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: 'Entrepreneur profile already exists.',
            });
        }

        const profileData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                profileData[field] = req.body[field];
            }
        });

        profileData.user = req.user._id;
        profileData.verificationStatus = 'pending';

        const entrepreneur = await Entrepreneur.create(profileData);

        return res.status(201).json({
            success: true,
            message: 'Profile submitted for admin approval.',
            data: entrepreneur,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Unable to create entrepreneur profile.',
        });
    }
};

// ENTREPRENEUR: Update own profile
const updateProfile = async (req, res) => {
    try {
        const profileData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                profileData[field] = req.body[field];
            }
        });

        const entrepreneur = await Entrepreneur.findOneAndUpdate(
            { user: req.user._id },
            { $set: profileData },
            { new: true, runValidators: true }
        );

        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: 'Entrepreneur profile not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: entrepreneur,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Unable to update profile.',
        });
    }
};

// ADMIN: View all entrepreneur profiles
const getAllEntrepreneurs = async (req, res) => {
    try {
        const entrepreneurs = await Entrepreneur.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: entrepreneurs.length,
            data: entrepreneurs,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch entrepreneur records.',
        });
    }
};

// ADMIN: Approve or reject entrepreneur
const updateVerificationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be approved or rejected.',
            });
        }

        const entrepreneur = await Entrepreneur.findByIdAndUpdate(
            req.params.id,
            { verificationStatus: status },
            { new: true, runValidators: true }
        );

        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: 'Entrepreneur not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: `Entrepreneur ${status} successfully.`,
            data: entrepreneur,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update verification status.',
        });
    }
};

module.exports = {
    getEntrepreneurs,
    getMyProfile,
    createProfile,
    updateProfile,
    getAllEntrepreneurs,
    updateVerificationStatus,
};