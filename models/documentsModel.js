const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const createDocumentsTable = async () => {
    await pool.query(`
        CREATE TABLE users_documents (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            image_front VARCHAR(255) NOT NULL,
            image_back VARCHAR(255) NOT NULL,
            upload_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

//createDocumentsTable();

module.exports = pool;