const express = require("express");
const router = express.Router();
const OutboundController = require("../controllers/OutboundController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/ready",
    authenticate,
    authorize("Staff Gudang", "Owner"),
    OutboundController.getReadyToLeave,
);
router.get(
    "/history",
    authenticate,
    authorize("Staff Gudang", "Owner"),
    OutboundController.getHistoryOutbound,
);
router.post(
    "/:id_barang/validate",
    authenticate,
    authorize("Staff Gudang", "Owner"),
    OutboundController.validateOutbound,
);

module.exports = router;