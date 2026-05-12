const ZoneModel = require("../models/ZoneModel");

const ZoneController = {
  async getAllZones(req, res) {
    try {
      const zones = await ZoneModel.findAll();
      return res.status(200).json({ success: true, data: { zones } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getZoneById(req, res) {
    try {
      const zone = await ZoneModel.findById(req.params.id);
      if (!zone) {
        return res
          .status(404)
          .json({ success: false, message: "Zone not found" });
      }
      return res.status(200).json({ success: true, data: { zone } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async createZone(req, res) {
    try {
      const { nama_zona, kapasitas, deskripsi } = req.body;
      if (!nama_zona || !kapasitas) {
        return res.status(422).json({
          success: false,
          message: "Nama zona and kapasitas are required",
        });
      }
      const newZone = await ZoneModel.create({
        nama_zona,
        kapasitas,
        deskripsi,
      });
      return res.status(201).json({ success: true, data: newZone });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateZone(req, res) {
    try {
      const { id } = req.params;
      const { nama_zona, kapasitas, deskripsi } = req.body;
      const updated = await ZoneModel.update(id, {
        nama_zona,
        kapasitas,
        deskripsi,
      });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Zone not found or no changes made",
        });
      }
      return res
        .status(200)
        .json({ success: true, message: "Zone updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteZone(req, res) {
    try {
      const deleted = await ZoneModel.delete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Zone not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Zone deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = ZoneController;
