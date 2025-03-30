const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { login, logout, register } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
