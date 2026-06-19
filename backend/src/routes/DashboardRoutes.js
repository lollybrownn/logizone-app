const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/DashboardController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/", authenticate, DashboardController.getDashboardInfo);

module.exports = router;