const dns = require('dns');

// MongoDB DNS Fix
dns.setServers(['8.8.8.8']);

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const seedData = require('./utils/seedData');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const entrepreneurRoutes = require('./routes/entrepreneurRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Backend Health Check
app.get('/', (req, res) => {
    res.send('HunarHub Backend is Running Successfully!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entrepreneurs', entrepreneurRoutes);
app.use('/api/products', productRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        // Automatically initialize default categories
        await seedData();

        app.listen(PORT, () => {
            console.log(`HunarHub Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('HunarHub Server Startup Failed:', error.message);
        process.exit(1);
    }
};

startServer();