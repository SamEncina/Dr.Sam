const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = {
    pool,
    connectDB,
};
