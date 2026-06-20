const db = require("../config/database");
const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");

const PlacementController = {
  // -----------------------------------------------------------------------
  // POST /api/placement/:id/assign
  // Body: { id_zona }
  // FR-01 step 2 (Penentuan Lokasi) + FR-03 (Auto Stock Management)
  // -----------------------------------------------------------------------
  async assignItemToZone(req, res) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { id_zona } = req.body;
      if (!id_zona) {
        await client.query("ROLLBACK");
        return res.status(422).json({ success: false, message: "Zona wajib dipilih" });
      }

      const zone = await ZoneModel.findById(id_zona, client);
      if (!zone) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Zona tidak ditemukan" });
      }

      const item = await ItemModel.findById(req.params.id, client);
      if (!item) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Barang tidak ditemukan" });
      }

      if (item.id_zona) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          message: "Barang sudah ditempatkan, gunakan endpoint update lokasi",
        });
      }

      const remaining = zone.kapasitas - zone.kapasitas_terisi;
      if (item.jumlah_koli > remaining) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          message: "Zona tersebut sudah penuh untuk menampung jumlah koli ini",
        });
      }

      await ZoneModel.adjustCapacity(zone.id, item.jumlah_koli, client);
      const updatedItem = await ItemModel.assignZone(item.id_barang, zone.id, client);

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Barang berhasil ditempatkan ke zona",
        data: { barang: updatedItem },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  },

  // -----------------------------------------------------------------------
  // PUT /api/placement/:id/move
  // Body: { id_zona }  (move an already-placed item to a different zone)
  // -----------------------------------------------------------------------
  async updateItemZone(req, res) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { id_zona } = req.body;
      if (!id_zona) {
        await client.query("ROLLBACK");
        return res.status(422).json({ success: false, message: "Zona tujuan wajib dipilih" });
      }

      const newZone = await ZoneModel.findById(id_zona, client);
      if (!newZone) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Zona tujuan tidak ditemukan" });
      }

      const item = await ItemModel.findById(req.params.id, client);
      if (!item) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Barang tidak ditemukan" });
      }

      if (!item.id_zona) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          message: "Barang belum ditempatkan di zona manapun, gunakan endpoint assign",
        });
      }

      if (item.id_zona === newZone.id) {
        await client.query("ROLLBACK");
        return res.status(409).json({ success: false, message: "Barang sudah berada di zona tersebut" });
      }

      const remaining = newZone.kapasitas - newZone.kapasitas_terisi;
      if (item.jumlah_koli > remaining) {
        await client.query("ROLLBACK");
        return res.status(409).json({ success: false, message: "Zona tujuan tidak memiliki kapasitas yang cukup" });
      }

      // Free up capacity in the old zone, consume capacity in the new zone
      await ZoneModel.adjustCapacity(item.id_zona, -item.jumlah_koli, client);
      await ZoneModel.adjustCapacity(newZone.id, item.jumlah_koli, client);
      const updatedItem = await ItemModel.assignZone(item.id_barang, newZone.id, client);

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Lokasi barang berhasil diperbarui",
        data: { barang: updatedItem },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  },
};

module.exports = PlacementController;
