const pool = require("../models/userModel"); // Ensure pool is correctly imported
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

// Get User Info
const getUserInfo = async (req, res) => {
    try {
        const { id } = req.body;
        const infos = await pool.query(`
            SELECT fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, account_status, phone_status
            FROM users WHERE id = $1`, 
            [id]
        );

        if (infos.rows.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(infos.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Add New User
const addUser = async (req, res) => {
    try {
        const { fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, username, password } = req.body;
        const role = "client";

        // Hash Password & Username
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedUsername = await bcrypt.hash(username, salt);

        // Store Data in Database
        const newUser = await pool.query(
            `INSERT INTO users (fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, username, password, role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
             RETURNING id, email, fname, lname, role`, // Avoid returning sensitive info
            [fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, hashedUsername, hashedPassword, role]
        );

        res.json({ message: "User created successfully", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Confirm Phone Status
const confirmPhone = async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query(`UPDATE users SET phone_status = TRUE WHERE id = $1`, [id]);
        res.json({ message: "Phone Verified" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Check Phone Status
const checkPhone = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await pool.query("SELECT phone_status FROM users WHERE id = $1", [id]);

        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Find User by Email
const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0]; // Return single user object
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "User not found" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        
        // ✅ Store user in session
        req.session.user = { id: user.id, email: user.email, role: user.role };
        
        console.log(req.session)
        // ✅ Explicitly save session to ensure persistence
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session error" });
            }
            res.json({ message: "Login successful" });
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Something went wrong! Try again later", error });
    }
};


// Logout User
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Error logging out");
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
};

// Get Profile (Protected Route)
const getProfile = (req, res) => {
    console.log(req.session);
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ user: req.session.user });
};

module.exports = { 
    getUserInfo,
    addUser, 
    confirmPhone, 
    checkPhone,
    getProfile,
    loginUser,
    logoutUser
};
