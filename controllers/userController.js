const pool = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const secretKey = process.env.JWT_SECRET

// ✅ Middleware to check authentication
const authMiddleware = (req, res, next) => {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // ✅ Check both cookie & header

    if (!token) {
        return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }
};


// ✅ Protected Route
const getAuthenticatedUser = async (req, res) => {
    try {
        res.json({ id: req.user.id, role: req.user.role }); // Send user info
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Add New User
const addUser = async (req, res) => {
    try {
        const { fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, username, password } = req.body;
        const role = "client"
        // Hash Password & Username
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedUsername = await bcrypt.hash(username, salt); 

        // Store Data in Database
        const newUser = await pool.query(
            `INSERT INTO users (fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, username, password, role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
             RETURNING *`,
            [fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, hashedUsername, hashedPassword, role]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role }, 
            secretKey, 
            { expiresIn: "1h" }
        );

        // ✅ Try setting a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  
            sameSite: "Lax",
            path: "/",
        });

        // ✅ Also return the token in the response (for localStorage fallback)
        res.json({ msg: "Login successful", token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// logout
const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ msg: "Logged out successfully" });
};

// Update statusPhone
const confirmPhone = async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query(`UPDATE users SET phone_status = TRUE WHERE id = $1;`, [ id ]);
        res.json("Phone Verified");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};


// Check phone
const checkPhone = async (req, res) => {
    try {
        const { id } = req.body;
        const users = await pool.query("SELECT phone_status FROM users WHERE id = $1", [ id ]);
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { 
    addUser, 
    confirmPhone, 
    checkPhone, 
    loginUser, 
    logoutUser, 
    getAuthenticatedUser, 
    authMiddleware 
};