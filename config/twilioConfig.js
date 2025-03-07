require("dotenv").config();
const twilio = require("../node_modules/twilio");
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
module.exports = client;