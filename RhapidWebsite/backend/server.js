const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const { connectDB } = require('./config/db');
const authRoutes = require('./api/authRoutes');
const uploadRoutes = require('./api/uploadRoutes');

// Connect to database
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Rhapid API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
