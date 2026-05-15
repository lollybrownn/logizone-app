const ItemModel = require("../models/ItemModel");
const ZonaModel = require("../models/ZoneModel");
const HistoryItemModel = require("../models/HistoryItemModel");

const DashboardController = {
  async getDashboardInfo(req, res) {
    try {
      const totalItems = ItemModel.countAll();
      const totalPendingItems = ItemModel.countAll({ status: "Pending" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
module.exports = DashboardController;
