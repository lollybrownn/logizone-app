const MasterWarehouseModel = require("../models/MasterWarehouseModel");

const MasterWarehouseController = {
  async showAll(req, res) {
    try {
      const warehouseList = await MasterWarehouseModel.findAll();
      return res.status(200).json({ success: true, data: { warehouseList } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async showByCode(req, res) {
    try {
      const warehouse = await MasterWarehouseModel.findByCode(req.params.id);
      if (!warehouse) {
        return res
          .status(404)
          .json({ success: false, message: "Data not found" });
      }
      return res.status(200).json({ success: true, data: { warehouse } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async showByName(req, res) {
    try {
      const warehouse = await MasterWarehouseModel.findByName(req.params.name);
      if (!warehouse) {
        return res
          .status(404)
          .json({ success: false, message: "Data not found" });
      }
      return res.status(200).json({ success: true, data: { warehouse } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async createWarehouse(req, res) {
    try {
      const { code, name, address, contact } = req.body;
      if (!code || !name || !address || !contact) {
        return res
          .status(500)
          .json({ success: false, message: "All columns must be filled" });
      }
      const isTaken = await MasterWarehouseModel.findByCode(code);
      if (isTaken) {
        return res
          .status(409)
          .json({ success: false, message: "Code is already taken" });
      }
      await MasterWarehouseModel.create({ code, name, address, contact });
      return res
        .status(200)
        .json({ success: true, message: "Sucessfully added warehouse" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteWarehouse(req, res) {
    try {
      const deleted = await MasterWarehouseModel.delete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Master Warehouse not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Master Warehouse deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateWarehouse(req, res) {
    try {
      const { id } = req.params;
      const { code, name, contact, address } = req.body;
      if (!code || !name || !contact || !address) {
        return res
          .status(500)
          .json({ success: false, message: "All columns must be filled" });
      }
      const updated = await MasterWarehouseModel.update(id, {
        code,
        name,
        address,
        contact,
      });
      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Warehouse not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Warehouse updated" });
      return res
        .status(200)
        .json({ success: true, message: "Warehouse updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = MasterWarehouseController;
