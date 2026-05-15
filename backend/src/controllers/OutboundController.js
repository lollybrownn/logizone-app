const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");
const HistoryItemModel = require("../models/HistoryItemModel");

const OutboundController = {
  async getReadyToLeave(req, res) {
    try {
      const items = await ItemModel.findAll({status="Stored"});
      if(!items){
        return res.status(200).json({success:true, message:"No data"});
      }
      return res.status(200).json({success:true, data:{items}});
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getHistoryOutbound(req,res){
    try {
      const items = HistoryItemModel.findHistoryOutbound();
      return res.status(200).json({success:true, data: {items}});
    } catch (error) {
      return res.status(500).json({success:false, message: error.message});
    }

  },
  async validateOutbound(req, res) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { id_barang } = req.params;
      const { tipe_keluar,berat_barang = 0, biaya_ekstra = 0, id_user } = req.body;

      const item = await ItemModel.findById(id_barang, client);
      if (!item) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }

      const total_biaya = item.biaya + biaya_ekstra;
      const id_zone = item.id_zona;
      const zone = await ZoneModel.findById(id_zone);
      const new_capacity = zone.kapasitas + item.jumlah_koli;

      await HistoryItemModel.create(
        {
          tipe_keluar:tipe_keluar,
          berat_barang: berat_barang,
          biaya_ekstra: biaya_ekstra,
          total_biaya: total_biaya,
          id_barang: item.id,
          id_user_validator: id_user,
        },
        client,
      );
      await ItemModel.updateStatus(item.id, "Outbound", client);
      await ZoneModel.updateCapacity(id_zone, new_capacity, client);

      await client.query("COMMIT");
      res
        .status(200)
        .json({ success: true, message: "Success Validate Outbound Bosku" });
    } catch (error) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  },
};

module.exports = OutboundController;
