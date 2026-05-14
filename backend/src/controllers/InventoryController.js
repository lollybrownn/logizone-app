const ItemModel = require("../models/ItemModel");

const InventoryController = {
  async getAgingItems(req, res) {
    try {
      const agingItems = ItemModel.getAgingItems();
      if (agingItems.length === 0) {
        return res.status(200).json({ success: true, message: "No data" });
      }
      return res.status(200).json({ success: true, data: { agingItems } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async getOverdueItems(req, res) {
    try {
      const overdueItems = ItemModel.fingAgingItems();
      if (overdueItems.length === 0) {
        return res.status(200).json({ success: true, message: "No data" });
      }
      return res.status(200).json({ success: true, data: { overdueItems } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = InventoryController;
