const express = require("express");
const router = express.Router();
const Auth = require("../controllers/Auth");

/* GET users listing. */
router.post("/", Auth.googleLogin);

module.exports = router;
