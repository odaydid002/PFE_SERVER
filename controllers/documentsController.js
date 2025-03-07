const pool = require("../models/documentsModel");

// Get All Documents
const getDocs = async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users_documents");
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Add New Document
const addDocs = async (req, res) => {
    try {
        const { user_id, image_front, image_back, upload_datetime } = req.body;

        // Store Data in Database
        const newDoc = await pool.query(
            `INSERT INTO users_documents ( user_id, image_front, image_back, upload_datetime ) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [ user_id, image_front, image_back, upload_datetime ]
        );

        res.json(newDoc.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { getDocs, addDocs };
