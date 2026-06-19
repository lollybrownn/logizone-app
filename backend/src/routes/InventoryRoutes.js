const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/InventoryController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/aging",
    authenticate,
    authorize("Staff Operasional", "Staff Gudang", "Owner"),
    InventoryController.getAgingItems,
);
router.get(
    "/overdue",
    authenticate,
    authorize("Staff Operasional", "Staff Gudang", "Owner"),
    InventoryController.getOverdueItems,
);
router.get(
    "/monitoring",
    authenticate,
    authorize("Staff Operasional", "Staff Gudang", "Owner"),
    InventoryController.getMonitoringSummary,
);

module.exports = router;