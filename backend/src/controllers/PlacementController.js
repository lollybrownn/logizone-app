const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");
const PlacementController = {
  // Penempatan barang ke zona
  async assignItemToZone(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const zone = await ZoneModel.findById(req.body.id_zone);
      if (!zone) {
        return res
          .status(404)
          .json({ success: false, message: "Zone is not found in database" });
      }
      const item = await ItemModel.findById(req.params.id);
      if (!item) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
      const remaining_capacity = zone.kapasitas - item.jumlah_koli;
      if (remaining_capacity < 0) {
        return res.status(409).json({
          success: false,
          message: "Item can't be placed in that place due to the capacity",
        });
      }
      await ZoneModel.updateCapacity(zone.id, remaining_capacity, connection);
      await ItemModel.assignZone(item.id, zone.id, connection);
      await connection.commit();

      return res.status(200).json({
        success: true,
        message: "Successfully placed item into that zone",
      });
    } catch (error) {
      await connection.rollback();
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      connection.release();
    }
  },

  // Untuk update lokasi barang ke zona lain
  async updateItemZone(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const new_zone = await ZoneModel.findById(req.body.id_zone);
      if (!new_zone) {
        return res
          .status(404)
          .json({ success: false, message: "Zone is not found in database" });
      }
      const item = await ItemModel.findById(req.params.id);
      if (!item) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
      const previous_zone = await ZoneModel.findById(item.id_zona);
      const remaining_capacity = new_zone.kapasitas - item.jumlah_koli;
      if (remaining_capacity < 0) {
        return res.status(409).json({
          success: false,
          message: "Item can't be placed in that place due to the capacity",
        });
      }
      const new_capacity_for_previous_zone =
        previous_zone.kapasitas + item.jumlah_koli;
      await ZoneModel.updateCapacity(
        previous_zone.id,
        new_capacity_for_previous_zone,
        connection,
      );
      await ZoneModel.updateCapacity(
        new_zone.id,
        remaining_capacity,
        connection,
      );
      await ItemModel.assignZone(item.id, new_zone.id, connection);

      await connection.commit();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      connection.release();
    }
  },
};
