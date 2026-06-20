const HistoryItemModel = require("../models/HistoryItemModel");

function resolveDateRange(query) {
  let { start_date, end_date } = query;
  if (!start_date || !end_date) {
    end_date = new Date();
    start_date = new Date();
    start_date.setDate(end_date.getDate() - 30);
  } else {
    start_date = new Date(start_date);
    end_date = new Date(end_date);
  }
  return { start_date, end_date };
}

const ReportController = {
  async getSummaryReport(req, res) {
    try {
      const { start_date, end_date } = resolveDateRange(req.query);
      const [totalIncome, totalProcessedItems] = await Promise.all([
        HistoryItemModel.findTotalIncome(start_date, end_date),
        HistoryItemModel.findTotalProcessedItems(start_date, end_date),
      ]);
      return res.status(200).json({
        success: true,
        data: { totalIncome, totalProcessedItems, start_date, end_date },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getFinancialReport(req, res) {
    try {
      const { start_date, end_date } = resolveDateRange(req.query);

      const [totalIncome, totalProcessedItems, financialSummary] = await Promise.all([
        HistoryItemModel.findTotalIncome(start_date, end_date),
        HistoryItemModel.findTotalProcessedItems(start_date, end_date),
        HistoryItemModel.findRecapItems(start_date, end_date),
      ]);

      if (financialSummary.length === 0) {
        return res.status(200).json({
          success: true,
          message: "There is no data in that date range",
          data: { financialSummary: [], totalIncome, totalProcessedItems },
        });
      }

      return res.status(200).json({
        success: true,
        data: { financialSummary, totalIncome, totalProcessedItems },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getLogisticReport(req, res) {
    try {
      const { start_date, end_date } = resolveDateRange(req.query);

      const [totalProcessedItems, totalIncome, activityLog] = await Promise.all([
        HistoryItemModel.findTotalProcessedItems(start_date, end_date),
        HistoryItemModel.findTotalIncome(start_date, end_date),
        HistoryItemModel.getLogisticReport(start_date, end_date),
      ]);

      if (activityLog.length === 0) {
        return res.status(200).json({
          success: true,
          message: "There is no data in that date range",
          data: { activityLog: [], totalProcessedItems, totalIncome },
        });
      }

      return res.status(200).json({
        success: true,
        data: { activityLog, totalIncome, totalProcessedItems },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = ReportController;
