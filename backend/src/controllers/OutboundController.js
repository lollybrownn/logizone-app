const db = require("../config/database");
const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");
const HistoryItemModel = require("../models/HistoryItemModel");

// Must match the exit_type ENUM defined in schema.sql exactly
const VALID_TIPE_KELUAR = ["Ambil di Gudang", "Diantar"];

const OutboundController = {
  // GET /api/outbound/ready
  async getReadyToLeave(req, res) {
    try {
      const items = await ItemModel.findAll({ status: "Stored" });
      if (!items || items.length === 0) {
        return res.status(200).json({ success: true, message: "No data", data: { items: [] } });
      }
      return res.status(200).json({ success: true, data: { items } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/outbound/history
  async getHistoryOutbound(req, res) {
    try {
      const items = await HistoryItemModel.findHistoryOutbound();
      return res.status(200).json({ success: true, data: { items } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/outbound/:id_barang/validate
  // Body: { tipe_keluar, berat_barang, biaya_ekstra }
  async validateOutbound(req, res) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { id_barang } = req.params;
      const { tipe_keluar, berat_barang = 0, biaya_ekstra = 0 } = req.body;
      const id_user = req.user ? req.user.id : req.body.id_user;

      if (!tipe_keluar || !VALID_TIPE_KELUAR.includes(tipe_keluar)) {
        await client.query("ROLLBACK");
        return res.status(422).json({
          success: false,
          message: `Kategori barang keluar tidak valid. Pilihan: ${VALID_TIPE_KELUAR.join(", ")}`,
        });
      }

      const isDelivery = tipe_keluar === "Diantar";

      // Weight is required (>0) specifically for delivery, not for warehouse pickup
      if (isDelivery && Number(berat_barang) <= 0) {
        await client.query("ROLLBACK");
        return res.status(422).json({
          success: false,
          message: "Berat barang harus lebih dari 0 untuk metode pengiriman (delivery)",
        });
      }

      if (Number(biaya_ekstra) < 0) {
        await client.query("ROLLBACK");
        return res.status(422).json({ success: false, message: "Biaya tambahan tidak boleh bernilai negatif" });
      }

      const item = await ItemModel.findById(id_barang, client);
      if (!item) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Barang tidak ditemukan" });
      }

      if (item.status === "Completed") {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          message: "Barang ini sudah divalidasi keluar sebelumnya",
        });
      }

      const biayaAwal = Number(item.biaya) || 0;
      const biayaEkstra = Number(biaya_ekstra) || 0;
      const total_biaya = biayaAwal + biayaEkstra;

      const history = await HistoryItemModel.create(
        {
          tipe_keluar,
          berat_barang: Number(berat_barang) || 0,
          biaya_ekstra: biayaEkstra,
          total_biaya,
          id_barang: item.id_barang,
          id_user_validator: id_user || null,
        },
        client,
      );

      await ItemModel.updateStatus(item.id_barang, "Completed", client);

      // Return the zone's capacity to the pool (kapasitas_terisi decreases)
      if (item.id_zona) {
        await ZoneModel.adjustCapacity(item.id_zona, -item.jumlah_koli, client);
      }

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Barang berhasil divalidasi keluar",
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
