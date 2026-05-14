const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");

const VALID_STATUSES = ["Pending", "Stored", "Outbound"];

const BarangController = {
  // -------------------------------------------------------------------------
  // GET /api/barang
  // Query params: search, label_barang, no_resi, status, page, per_page
  // -------------------------------------------------------------------------
  async showAll(req, res) {
    try {
      const {
        search,
        label_barang,
        no_resi,
        status,
        page = 1,
        per_page = 15,
      } = req.query;

      if (status && !VALID_STATUSES.includes(status)) {
        return res.status(422).json({
          success: false,
          message: `Status is not valid. Pilihan: ${VALID_STATUSES.join(", ")}`,
        });
      }

      const limit = Number(per_page);
      const offset = (Number(page) - 1) * limit;
      const filters = { search, label_barang, no_resi, status };

      const [barang, total] = await Promise.all([
        ItemModel.findAll({ ...filters, limit, offset }),
        ItemModel.countAll(filters),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          barang,
          pagination: {
            total,
            page: Number(page),
            per_page: limit,
            total_pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // -------------------------------------------------------------------------
  // GET /api/barang/:id
  // -------------------------------------------------------------------------
  async showById(req, res) {
    try {
      const barang = await ItemModel.findById(req.params.id);
      if (!barang) {
        return res
          .status(404)
          .json({ success: false, message: "Good is not found" });
      }
      return res.status(200).json({ success: true, data: { barang } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // -------------------------------------------------------------------------
  // POST /api/barang
  // -------------------------------------------------------------------------
  async createBarang(req, res) {
    try {
      const {
        no_resi,
        label_barang,
        jumlah_koli,
        tgl_masuk,
        tgl_ambil,
        kota_asal_barang,
        kota_tujuan_keluar,
        biaya,
        nama_penerima,
        no_telp_penerima,
        nama_pengirim,
        no_telp_pengirim,
        id_gudang_induk,
        id_zona,
      } = req.body;

      // Validasi field wajib
      const required = {
        no_resi,
        label_barang,
        jumlah_koli,
        tgl_masuk,
        kota_asal_barang,
        kota_tujuan_keluar,
        biaya,
        nama_penerima,
        no_telp_penerima,
        nama_pengirim,
        no_telp_pengirim,
        id_gudang_induk,
      };
      const missing = Object.keys(required).filter(
        (k) => !required[k] && required[k] !== 0,
      );
      if (missing.length > 0) {
        return res.status(422).json({
          success: false,
          message: `This field must be filled: ${missing.join(", ")}`,
        });
      }

      // Cek duplikat no_resi
      const existing = await ItemModel.findByResi(no_resi);
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Resi is already use" });
      }

      const barang = await ItemModel.create({
        no_resi,
        label_barang,
        jumlah_koli,
        tgl_masuk,
        tgl_ambil,
        kota_asal_barang,
        kota_tujuan_keluar,
        biaya,
        nama_penerima,
        no_telp_penerima,
        nama_pengirim,
        no_telp_pengirim,
        id_gudang_induk,
        id_zona,
      });

      return res.status(201).json({
        success: true,
        message: "Successfuly added item",
        data: { barang },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // -------------------------------------------------------------------------
  // PUT /api/barang/:id
  // -------------------------------------------------------------------------
  async updateBarang(req, res) {
    try {
      const barang = await ItemModel.findById(req.params.id);
      if (!barang) {
        return res
          .status(404)
          .json({ success: false, message: "item not Found" });
      }

      if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
        return res.status(422).json({
          success: false,
          message: `Status is not valid. Option: ${VALID_STATUSES.join(", ")}`,
        });
      }

      // Cek duplikat no_resi jika diubah
      if (req.body.no_resi && req.body.no_resi !== barang.no_resi) {
        const duplicate = await ItemModel.findByResi(req.body.no_resi);
        if (duplicate) {
          return res
            .status(409)
            .json({ success: false, message: "Resi is already used" });
        }
      }

      const updated = await ItemModel.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Successfuly update item",
        data: { barang: updated },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // -------------------------------------------------------------------------
  // DELETE /api/barang/:id
  // -------------------------------------------------------------------------
  async deleteBarang(req, res) {
    try {
      const deleted = await ItemModel.delete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Barang tidak ditemukan" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Barang berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Menampilkan barang berdasarkan zona yang dicari
  async showByZone(req, res) {
    try {
      const search_zone = await ZoneModel.findById(req.body.id_zone);
      if (!search_zone) {
        return res
          .status(404)
          .json({ success: false, message: "Zone is not found" });
      }
      const results = await ItemModel.findItemsByZone(search_zone.nama_zona);
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "There are no item in that Zone" });
      }
      return res.status(200).json({ success: true, data: { results } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = ItemController;
