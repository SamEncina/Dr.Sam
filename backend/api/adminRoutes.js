const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
            req.user = result.rows[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check for admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// @route   POST /api/admin/send-email
// @desc    Send email to all users
// @access  Private/Admin
router.post('/send-email', protect, admin, async (req, res) => {
    const { subject, message } = req.body;

    try {
        const result = await pool.query('SELECT email FROM users');
        const emails = result.rows.map(row => row.email);

        // Here you would integrate with an email service like SendGrid, Nodemailer, etc.
        // For this example, we'll just log the emails to the console.
        console.log(`Sending email to: ${emails.join(', ')}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);

        res.json({ message: 'Email sent successfully to all users.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
