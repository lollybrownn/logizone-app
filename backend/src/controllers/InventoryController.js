const ItemModel = require("../models/ItemModel");


const InventoryController = {
  async getAgingItems(req, res) {
    try {
      const agingItems = await ItemModel.findAgingItems();
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
      const overdueItems = await ItemModel.findOverdueItems();
      if (overdueItems.length === 0) {
        return res.status(200).json({ success: true, message: "No data" });
      }
      return res.status(200).json({ success: true, data: { overdueItems } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async getMonitoringSummary(req, res) {
    try {
      const [agingItems, overdueItems] = await Promise.all([
        ItemModel.findAgingItems,
        ItemModel.findOverdueItems,
      ]);
      return res.status(200).json({
        success: true,
        data: {
          summary: { aging: agingItems.length, overdue: overdueItems.length },
          agingItems,
          overdueItems,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = InventoryController;
