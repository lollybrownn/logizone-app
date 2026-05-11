const MasterWarehouseModel = require("../models/MasterWarehouseModel");

const MasterWarehouseController = {
  async showAll(req, res) {
    try {
      const warehouseList = await MasterWarehouseModel.findAll();
      return res.status(200).json({ sucess: true, data: { warehouseList } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async showByCode(req, res) {
    try {
      const warehouse = await MasterWarehouseModel.findByCode(req.params.id);
      if (!warehosuse) {
        return res
          .status(404)
          .json({ sucess: false, message: "Data not found" });
      }
      return res.status(200).json({ success: true, data: { warehouse } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async showByName(req, res) {
    try {
      const warehouse = await MasterWarehouseModel.findByName(req.params.name);
      if (!warehosuse) {
        return res
          .status(404)
          .json({ sucess: false, message: "Data not found" });
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
          .json({ sucess: false, message: "All columns must be filled" });
      }
      const isTaken = await MasterWarehouseModel.findByCode(code);
      if (isTaken) {
        return res
          .status(401)
          .json({ sucess: false, message: "Code is already taken" });
      }
      await MasterWarehouseModel.create(code, name, address, contact);
      return res
        .status(200)
        .json({ sucess: true, message: "Sucessfully added warehouse" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = MasterWarehouseController;
