const Category = require('../models/Category');

// Generate URL-friendly slug
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
};

// PUBLIC: Get all active categories
const getActiveCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories.',
        });
    }
};

// ADMIN: Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories.',
        });
    }
};

// ADMIN: Create category
const createCategory = async (req, res) => {
    try {
        const { name, description, skills } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required.',
            });
        }

        const slug = generateSlug(name);

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid category name.',
            });
        }

        const existingCategory = await Category.findOne({
            $or: [
                { name: name.trim() },
                { slug },
            ],
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'Category already exists.',
            });
        }

        const category = await Category.create({
            name: name.trim(),
            slug,
            description: description || '',
            skills: Array.isArray(skills) ? skills : [],
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create category.',
        });
    }
};

// ADMIN: Update category
const updateCategory = async (req, res) => {
    try {
        const { name, description, skills, isActive } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Category name cannot be empty.',
                });
            }

            category.name = name.trim();
            category.slug = generateSlug(name);
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message: 'Skills must be an array.',
                });
            }

            category.skills = skills;
        }

        if (isActive !== undefined) {
            if (typeof isActive !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'isActive must be true or false.',
                });
            }

            category.isActive = isActive;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            category,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Category name or slug already exists.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update category.',
        });
    }
};

// ADMIN: Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        // Deactivate instead of permanently deleting
        category.isActive = false;
        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category deactivated successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate category.',
        });
    }
};

module.exports = {
    getActiveCategories,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};