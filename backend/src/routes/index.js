const express = require("express");
const router = express.Router();

const AuthRoutes = require("./AuthRoutes");
const UserRoutes = require("./UserRoutes");
const ItemRoutes = require("./ItemRoutes");
const MasterWarehouseRoutes = require("./MasterWarehouseRoutes");
const ZoneRoutes = require("./ZoneRoutes");
const PlacementRoutes = require("./PlacementRoutes");
const OutboundRoutes = require("./OutboundRoutes");
const InventoryRoutes = require("./InventoryRoutes");
const ReportRoutes = require("./ReportRoutes");
const DashboardRoutes = require("./DashboardRoutes");

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/barang", ItemRoutes);
router.use("/warehouses", MasterWarehouseRoutes);
router.use("/zones", ZoneRoutes);
router.use("/placement", PlacementRoutes);
router.use("/outbound", OutboundRoutes);
router.use("/inventory", InventoryRoutes);
router.use("/reports", ReportRoutes);
router.use("/dashboard", DashboardRoutes);

module.exports = router;
