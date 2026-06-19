const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { authenticate } = require("../middlewares/authMiddleware")
router.post("/login", AuthController.login);
router.get("/me", authenticate, AuthController.me)

module.exports = router;