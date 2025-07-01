const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Auth middleware
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @route   POST /api/upload/profile-pic
// @desc    Upload profile picture
router.post('/profile-pic', protect, upload.single('profilePic'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.buffer, {
            folder: 'rhapid-profile-pics',
            transformation: [{ width: 150, height: 150, crop: 'fill' }],
        });

        const userId = req.user.rows[0].id;
        await pool.query('UPDATE users SET profile_pic_url = $1 WHERE id = $2', [result.secure_url, userId]);

        res.json({
            message: 'Image uploaded successfully',
            url: result.secure_url,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
