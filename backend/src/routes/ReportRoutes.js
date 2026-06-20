const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/summary", authenticate, authorize("Owner"), ReportController.getSummaryReport);
router.get("/financial", authenticate, authorize("Owner"), ReportController.getFinancialReport);
router.get("/logistic", authenticate, authorize("Owner"), ReportController.getLogisticReport);

module.exports = router;