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
      const { kode_zona, nama_zona, kapasitas, deskripsi } = req.body;
      if (!kode_zona || !nama_zona || !kapasitas === undefined) {
        return res.status(422).json({
          success: false,
          message: "Zone code, zone name and Capacity are required",
        });
      }
      if (Number(kapasitas) <= 0) {
        return res.status(422).json({ success: false, message: "Capacity must be greater than 0" });
      }
      const duplicate = await ZoneModel.findDuplicate(kode_zona, nama_zona);
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Zone code or Zone name already registered",
        });
      }
      const newZone = await ZoneModel.create({
        kode_zona,
        nama_zona,
        kapasitas,
        deskripsi,
      });
      return res.status(201).json({ success: true, data: newZone, message: "Successfuly add zone" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateZone(req, res) {
    try {
      const { id } = req.params;
      const { kode_zona, nama_zona, kapasitas, deskripsi } = req.body;
      const existing = await ZoneModel.findById(id)
      if (!existing) {
        return res.status(404).json({ success: false, message: "Zone not found" })
      }
      if (kapasitas !== undefined && Number(kapasitas) <= 0) {
        return res.status(422).json({
          success: false,
          message: "Capacity must be greater than 0",
        });
      }
      if (kapasitas !== undefined && Number(kapasitas) < existing.kapasitas_terisi) {
        return res.status(422).json({
          success: false,
          message: "Maximum capacity must be greater than the currenct filled capacity (${existing.kapasitas_terisi})",
        });
      }
      if (kode_zona || nama_zona) {
        const duplicate = await ZoneModel.findDuplicate({
          kode_zona: kode_zona || existing.kode_zona,
          nama_zona: nama_zona || existing.nama_zona, excludeId: id
        })
        if (duplicate) {
          return res.status(409).json({
            success: false, message: "Name or Zone Code already used"
          })
        }
      }
      const updated = await ZoneModel.update(id, {
        kode_zona,
        nama_zona,
        kapasitas,
        deskripsi,
      });

      return res
        .status(200)
        .json({ success: true, message: "successfully update zone " });
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
