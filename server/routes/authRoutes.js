const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
} = require('../controllers/authController');

// Customer / Entrepreneur Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

module.exports = router;