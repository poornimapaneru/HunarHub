const Category = require('../models/Category');

const defaultCategories = [
    {
        name: 'Cobbler',
        slug: 'cobbler',
        description: 'Professional shoe repair and footwear services.',
        skills: ['Shoe Repair', 'Shoe Polishing', 'Footwear Making'],
    },
    {
        name: 'Potter',
        slug: 'potter',
        description: 'Traditional pottery and handmade clay products.',
        skills: ['Clay Pottery', 'Handmade Pots', 'Ceramic Art'],
    },
    {
        name: 'Tailor',
        slug: 'tailor',
        description: 'Custom stitching, alterations and clothing services.',
        skills: ['Stitching', 'Clothing Alteration', 'Custom Tailoring'],
    },
    {
        name: 'Artisan',
        slug: 'artisan',
        description: 'Traditional handmade crafts and artistic products.',
        skills: ['Handicrafts', 'Wood Craft', 'Handmade Decoration'],
    },
    {
        name: 'Small Vendor',
        slug: 'small-vendor',
        description: 'Local small businesses and handmade product sellers.',
        skills: ['Local Products', 'Handmade Goods', 'Small Business'],
    },
];

const seedData = async () => {
    try {
        for (const category of defaultCategories) {
            await Category.findOneAndUpdate(
                { slug: category.slug },
                { $set: category },
                { upsert: true, new: true }
            );
        }

        console.log('Default categories initialized successfully.');
    } catch (error) {
        console.error('Category initialization failed:', error.message);
        throw error;
    }
};

module.exports = seedData;