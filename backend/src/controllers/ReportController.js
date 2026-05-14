const HistoryItemModel = require("../models/HistoryItemModel");
const ItemModel = require("../models/ItemModel");

const ReportController = {
  async getTotalIncome(req, res) {
    try {
      let { start_date, end_date } = req.body;
      if (!start_date || !end_date) {
        end_date = new Date();
        start_date = new Date();

        start_date.setData(end_date.getData() - 30);
      }
      const totalIncome = await HistoryItemModel.findTotalIncome(
        start_date,
        end_date,
      );
      return res.status(200).json({ success: true, data: totalIncome });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async getFinancialSummary(req, res) {
    try {
      let { start_date, end_date } = req.body;
      if (!start_date || !end_date) {
        end_date = new Date();
        start_date = new Date();

        start_date.setData(end_date.getData() - 30);
      }
      const financialSummary = HistoryItemModel.findRecapItems(
        start_date,
        end_date,
      );
      if (financialSummary.length === 0) {
        return res
          .status(404)
          .json({ success: true, message: "There is no data in that date" });
      }
      return res.status(200).json({ success: true, data: financialSummary });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
module.exports = ReportController;
