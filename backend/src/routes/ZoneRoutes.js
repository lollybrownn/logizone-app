const express = require("express");
const router = express.Router();
const ZoneController = require("../controllers/ZoneController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/",
    authenticate,
    authorize("Owner", "Staff Gudang", "Staff Operasional"),
    ZoneController.getAllZones,
);
router.get(
    "/:id",
    authenticate,
    authorize("Owner", "Staff Gudang", "Staff Operasional"),
    ZoneController.getZoneById,
);
router.post("/", authenticate, authorize("Owner"), ZoneController.createZone);
router.put("/:id", authenticate, authorize("Owner"), ZoneController.updateZone);
router.delete("/:id", authenticate, authorize("Owner"), ZoneController.deleteZone);

module.exports = router;