const express = require("express");
const { 
    addUser,
    confirmPhone,
    checkPhone,
    getUserInfo,
    getProfile,
    loginUser,
    logoutUser
} = require("../controllers/userController");

const router = express.Router();

// Public Routes
router.post("/add", addUser);
router.post("/confirmphone", confirmPhone);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/checkphone", checkPhone);
router.post("/get", getUserInfo);
router.get("/auth", getProfile); 

module.exports = router;
