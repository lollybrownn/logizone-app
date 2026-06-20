const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");
const HistoryItemModel = require("../models/HistoryItemModel");

const DashboardController = {
  async getDashboardInfo(req, res) {
    try {
      const [
        totalItems,
        totalPendingItems,
        totalStoredItems,
        agingItems,
        overdueItems,
        zones,
      ] = await Promise.all([
        ItemModel.countAll(),
        ItemModel.countAll({ status: "Pending" }),
        ItemModel.countAll({ status: "Stored" }),
        ItemModel.findAgingItems(),
        ItemModel.findOverdueItems(),
        ZoneModel.findAll(),
      ]);

      const totalCapacity = zones.reduce((sum, z) => sum + z.kapasitas, 0);
      const totalFilled = zones.reduce((sum, z) => sum + z.kapasitas_terisi, 0);

      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const totalIncome = await HistoryItemModel.findTotalIncome(thirtyDaysAgo, today);

      return res.status(200).json({
        success: true,
        data: {
          totalItems,
          totalPendingItems,
          totalStoredItems,
          totalAging: agingItems.length,
          totalOverdue: overdueItems.length,
          zoneUtilization: {
            totalCapacity,
            totalFilled,
            percentage: totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0,
          },
          totalIncomeLast30Days: totalIncome,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = DashboardController;
