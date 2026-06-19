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
  async showById(req, res) {
    try {
      const warehouse = await MasterWarehouseModel.findById(req.params.id);
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
      code = String(code).replace(/\s+/g, "");
      if (!code) {
        return res
          .status(500)
          .json({ success: false, message: "Code Mitra is'nt valid" });
      }
      const isTaken = await MasterWarehouseModel.findByCode(code);
      if (isTaken) {
        return res
          .status(409)
          .json({ success: false, message: "Code is already taken" });
      }
      const warehouse = await MasterWarehouseModel.create({ code, name, address, contact });
      return res
        .status(200)
        .json({ success: true, message: "Sucessfully added warehouse", data: { warehouse } });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteWarehouse(req, res) {
    try {
      const existing = await MasterWarehouseModel.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Warehouse not found" });
      }
      const isLinked = await MasterWarehouseModel.hasLinkedBarang(req.params.id);
      if (isLinked) {
        return res
          .status(404)
          .json({ success: false, message: "Can't deleted main warehouse cause still linked to items in warehouse" });
      }
      await MasterWarehouseModel.delete(req.params.id);
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
      const existing = await MasterWarehouseModel.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Warehouse not found" });
      }
      if (code) {
        code = String(code).replace(/\s+/g, "");
        if (code !== existing.kode_gudang_induk) {
          const isTaken = await MasterWarehouseModel.findByCode(code);
          if (isTaken) {
            return res
              .status(409)
              .json({ success: false, message: "Warehouse code already used" });
          }
        }
      }
      const updated = await MasterWarehouseModel.update(id, {
        code: kode_gudang_induk || existing.kode_gudang_induk,
        name: nama_gudang_induk || existing.nama_gudang_induk,
        addres: address !== undefined ? address : existing.alamat_gudang_induk,
        contact: contact || existing.kontak,
      });
      return res
        .status(200)
        .json({ success: true, message: "Warehouse updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = MasterWarehouseController;
