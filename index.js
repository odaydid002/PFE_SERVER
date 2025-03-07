const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const cookieParser = require("cookie-parser"); // ✅ Added for handling cookies
require("dotenv").config();

const userRoutes = require("./routes/users");
const documentsRoutes = require("./routes/documentsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define Allowed Origins
const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5000"];

// ✅ CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // ✅ Allow credentials (cookies, authorization headers, etc.)
}));

// ✅ Middleware
app.use(helmet());
app.use(cookieParser()); // ✅ Required for handling cookies
app.use(express.json());

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/docs", documentsRoutes);
app.use('/api/email', emailRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sms", verificationRoutes);

// ✅ Serve Static Assets
app.use("/assets", express.static(path.join(__dirname, "../../assets")));

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
