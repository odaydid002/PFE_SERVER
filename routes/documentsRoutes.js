const express = require("express");
const { getDocs, addDocs } = require("../controllers/documentsController");

const router = express.Router();

router.get("/getdocs", getDocs);
router.post("/adddocs", addDocs);

module.exports = router;
