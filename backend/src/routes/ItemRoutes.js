const express = require("express");
const router = express.Router();
const ItemController = require("../controllers/ItemController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/unplaced", authenticate, authorize("Staff Gudang", "Owner"), ItemController.showUnplaced);
router.get("/zone/:id_zone", authenticate, authorize("Staff Gudang", "Owner"), ItemController.showByZone)
router.get(
    "/",
    authenticate,
    authorize("Staff Operasional", "Staff Gudang", "Owner"),
    ItemController.showAll,
);
router.get(
    "/:id",
    authenticate,
    authorize("Staff Operasional", "Staff Gudang", "Owner"),
    ItemController.showById,
);
router.post(
    "/",
    authenticate,
    authorize("Staff Operasional"),
    ItemController.createBarang,
);
router.put("/:id", authenticate, authorize("Staff Operasional", "Staff Gudang"), ItemController.updateBarang)
router.delete("/:id", authenticate, authorize("Staff Operasional", "Owner"), ItemController.deleteBarang);

module.exports = router;