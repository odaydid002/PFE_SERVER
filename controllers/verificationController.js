const client = require("../config/twilioConfig");
const { storeCode, getCode } = require("../models/verificationModel");

const sendCode = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const code = Math.floor(100000 + Math.random() * 900000);
    storeCode(phone, code);

    try {
        await client.messages.create({
            body: `Your verification code is: ${code}`,
            from: process.env.TWILIO_PHONE,
            to: phone,
        });
        res.json({ message: "Verification code sent!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send SMS", error });
    }
};

const verifyCode = (req, res) => {
    const { phone, code } = req.body;
    const storedCode = getCode(phone);

    if (storedCode && storedCode == code) {
        res.json({ message: "Verification successful!" });
    } else {
        res.status(400).json({ message: "Invalid verification code" });
    }
};

module.exports = { sendCode, verifyCode };
