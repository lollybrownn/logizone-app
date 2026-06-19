const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");
const HistoryItemModel = require("../models/HistoryItemModel");

const VALID_TIPE_KELUAR = ["Ambil di Gudang", "Diantar"];
const OutboundController = {
  async getReadyToLeave(req, res) {
    try {
      const items = await ItemModel.findAll({ status: "Stored" });
      if (!items) {
        return res

          .status(200)
          .json({ success: true, message: "No data", data: { items: [] } });
      }
      return res.status(200).json({ success: true, data: { items } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getHistoryOutbound(req, res) {
    try {
      const items = HistoryItemModel.findHistoryOutbound();
      return res.status(200).json({ success: true, data: { items } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async validateOutbound(req, res) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { id_barang } = req.params;
      const { tipe_keluar, berat_barang = 0, biaya_ekstra = 0 } = req.body;
      const id_user = req.user ? req.user.id : req.body.id_user;

      if (!tipe_keluar || !VALID_TIPE_KELUAR.includes(tipe_keluar)) {
        await client.query("ROLLBACK");
        return res
          .status(422)
          .json({ success: false, message: "Category Outbound is not valid" });
      }

      const isDelivery = tipe_keluar === "Diantar";

      if (!isDelivery && Number(berat_barang) <= 0) {
        await client.query("ROLLBACK");
        return res.status(422).json({
          success: false,
          message: "Item Weight must > 0 for shipping method",
        });
      }

      if (Number(biaya_ekstra) < 0) {
        await client.query("ROLLBACK");
        return res.status(422).json({
          success: false,
          message: "Extra cost must be greater than zero",
        });
      }

      const item = await ItemModel.findById(id_barang, client);
      if (!item) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
      if (item.status === "Completed") {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "This item is already delivered, or no longer in Warehouse",
        });
      }
      const biayaAwal = Number(biaya_awal) || 0;
      const total_biaya = Number(biayaAwal) + biaya_ekstra;

      const id_zone = item.id_zona;
      const zone = await ZoneModel.findById(id_zone);
      const new_capacity = zone.kapasitas + item.jumlah_koli;

      const history = await HistoryItemModel.create(
        {
          tipe_keluar: tipe_keluar,
          berat_barang: Number(berat_barang) || 0,
          biaya_ekstra: biaya_ekstra,
          total_biaya: total_biaya,
          id_barang: item.id,
          id_user_validator: id_user || null,
        },
        client,
      );
      await ItemModel.updateStatus(item.id, "Completed", client);
      if (item.id_zona) {
        await ZoneModel.adjustCapacity(id_zone, -item.jumlah_koli, client);
      }
      await client.query("COMMIT");
      res.status(200).json({
        success: true,
        message: "Success Validate Outbound Bosku",
        data: { history, total_biaya },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  },
};

module.exports = OutboundController;
