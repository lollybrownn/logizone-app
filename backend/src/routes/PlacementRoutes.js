const express = require("express");
const router = express.Router();
const PlacementController = require("../controllers/PlacementController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.post(
    "/:id/assign",
    authenticate,
    authorize("Staff Gudang"),
    PlacementController.assignItemToZone,
);
router.put(
    "/:id/move",
    authenticate,
    authorize("Staff Gudang"),
    PlacementController.updateItemZone,
);

module.exports = router;