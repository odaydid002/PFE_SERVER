const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const userRoutes = require("./routes/users");
const documentsRoutes = require("./routes/documentsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS and Allow Credentials
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5000", "https://pfe-server-sandy.vercel.app", "https://pjr.vercel.app"],
    credentials: true
}));

// ✅ Session Middleware (Must be before routes)
app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  // ✅ Set `true` only in production with HTTPS
        httpOnly: true,
        sameSite: "lax", // ✅ Allows cookies across different origins
        maxAge: 1000 * 60 * 24  * 60  // 1 hour session duration
    }
}));

// ✅ Middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// ✅ API Routes (Must be after session middleware)
app.use("/api/users", userRoutes);
app.use("/api/docs", documentsRoutes);
app.use('/api/email', emailRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sms", verificationRoutes);

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
