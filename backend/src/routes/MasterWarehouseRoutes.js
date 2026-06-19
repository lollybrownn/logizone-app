const express = require("express");
const router = express.Router();
const MasterWarehouseController = require("../controllers/MasterWarehouseController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/code/:code", authenticate, MasterWarehouseController.showByCode);
router.get("/name/:name", authenticate, MasterWarehouseController.showByName);
router.get("/:id", authenticate, MasterWarehouseController.showById);
router.get("/", authenticate, MasterWarehouseController.showAll);
router.post("/", authenticate, authorize("Owner"), MasterWarehouseController.createWarehouse);
router.put("/:id", authenticate, authorize("Owner"), MasterWarehouseController.updateWarehouse);
router.delete("/:id", authenticate, authorize("Owner"), MasterWarehouseController.deleteWarehouse);

module.exports = router;