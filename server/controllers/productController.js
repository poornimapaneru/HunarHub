const Product = require('../models/Product');
const Entrepreneur = require('../models/Entrepreneur');
const cloudinary = require('../config/cloudinary');

// Upload image to Cloudinary
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'hunarhub/products',
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        stream.end(file.buffer);
    });
};

// Convert existing image input into an array
const getExistingImages = (images) => {
    if (!images) return [];

    if (Array.isArray(images)) return images;

    try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [images];
    }
};

// PUBLIC: Get active products from approved entrepreneurs
const getProducts = async (req, res) => {
    try {
        const filter = {
            status: 'active',
            isAvailable: true,
        };

        const { search, category, minPrice, maxPrice } = req.query;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) {
            filter.category = {
                $regex: category,
                $options: 'i',
            };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const products = await Product.find(filter)
            .populate({
                path: 'entrepreneur',
                match: { verificationStatus: 'approved' },
                select: 'name location category averageRating',
            })
            .sort({ createdAt: -1 });

        const approvedProducts = products.filter(
            (product) => product.entrepreneur
        );

        return res.status(200).json({
            success: true,
            count: approvedProducts.length,
            data: approvedProducts,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch products.',
        });
    }
};

// ENTREPRENEUR: Get own products
const getMyProducts = async (req, res) => {
    try {
        const entrepreneur = await Entrepreneur.findOne({
            user: req.user._id,
        });

        if (!entrepreneur) {
            return res.status(404).json({
                success: false,
                message: 'Create your entrepreneur profile first.',
            });
        }

        const products = await Product.find({
            entrepreneur: entrepreneur._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch your products.',
        });
    }
};

// ENTREPRENEUR: Add product
const createProduct = async (req, res) => {
    try {
        const entrepreneur = await Entrepreneur.findOne({
            user: req.user._id,
            verificationStatus: 'approved',
        });

        if (!entrepreneur) {
            return res.status(403).json({
                success: false,
                message: 'Your entrepreneur profile must be approved first.',
            });
        }

        const { name, description, category, price, stock } = req.body;

        if (
            !name ||
            !description ||
            !category ||
            price === undefined ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            (stock !== undefined &&
                (!Number.isInteger(Number(stock)) || Number(stock) < 0))
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid product details.',
            });
        }

        const uploadedImages = req.files?.length
            ? await Promise.all(req.files.map(uploadToCloudinary))
            : [];

        const existingImages = getExistingImages(req.body.images);

        const product = await Product.create({
            entrepreneur: entrepreneur._id,
            name,
            description,
            category,
            price: Number(price),
            stock: stock === undefined ? 0 : Number(stock),
            images: [...existingImages, ...uploadedImages],
            isAvailable: Number(stock ?? 0) > 0,
        });

        return res.status(201).json({
            success: true,
            message: 'Product added successfully!',
            data: product,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Unable to add product.',
        });
    }
};

// ENTREPRENEUR: Update own product
const updateProduct = async (req, res) => {
    try {
        const entrepreneur = await Entrepreneur.findOne({
            user: req.user._id,
            verificationStatus: 'approved',
        });

        if (!entrepreneur) {
            return res.status(403).json({
                success: false,
                message: 'Approved entrepreneur profile required.',
            });
        }

        const allowedFields = [
            'name',
            'description',
            'category',
            'price',
            'stock',
            'images',
            'isAvailable',
            'status',
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (req.files?.length) {
            const uploadedImages = await Promise.all(
                req.files.map(uploadToCloudinary)
            );

            const existingImages = getExistingImages(req.body.images);

            updates.images = [...existingImages, ...uploadedImages];
        } else if (req.body.images !== undefined) {
            updates.images = getExistingImages(req.body.images);
        }

        if (updates.price !== undefined) {
            updates.price = Number(updates.price);
        }

        if (updates.stock !== undefined) {
            updates.stock = Number(updates.stock);
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                entrepreneur: entrepreneur._id,
            },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully!',
            data: product,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Unable to update product.',
        });
    }
};

// ENTREPRENEUR: Delete own product
const deleteProduct = async (req, res) => {
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

        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            entrepreneur: entrepreneur._id,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully!',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to delete product.',
        });
    }
};

module.exports = {
    getProducts,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};