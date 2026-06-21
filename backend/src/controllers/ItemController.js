const ItemModel = require("../models/ItemModel");
const ZoneModel = require("../models/ZoneModel");
const MasterWarehouseModel = require("../models/MasterWarehouseModel");

// Must match the item_status ENUM defined in schema.sql exactly
const VALID_STATUSES = ["Pending", "Registered", "Stored", "Picked Up", "Completed"];

const ItemController = {
  // ---------------------------------------------------------------------
  // GET /api/barang
  // Query params: search, label_barang, no_resi, status, id_zona, page, per_page
  // ---------------------------------------------------------------------
  async showAll(req, res) {
    try {
      const {
        search,
        label_barang,
        no_resi,
        status,
        id_zona,
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
      const filters = { search, label_barang, no_resi, status, id_zona };

      const [barang, total] = await Promise.all([
        ItemModel.findAll({ ...filters, limit, offset }),
        ItemModel.countAll(filters),
      ]);

      if (search && barang.length === 0) {
        return res
          .status(200)
          .json({ success: true, message: "Barang tidak ditemukan", data: { barang: [] } });
      }

      return res.status(200).json({
        success: true,
        data: {
          barang,
          pagination: {
            total,
            page: Number(page),
            per_page: limit,
            total_pages: Math.ceil(total / limit) || 1,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ---------------------------------------------------------------------
  // GET /api/barang/:id
  // ---------------------------------------------------------------------
  async showById(req, res) {
    try {
      const barang = await ItemModel.findById(req.params.id);
      if (!barang) {
        return res
          .status(404)
          .json({ success: false, message: "Barang tidak ditemukan" });
      }
      return res.status(200).json({ success: true, data: { barang } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ---------------------------------------------------------------------
  // GET /api/barang/unplaced
  // ---------------------------------------------------------------------
  async showUnplaced(req, res) {
    try {
      const barang = await ItemModel.findUnplacedItems();
      return res.status(200).json({ success: true, data: { barang } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ---------------------------------------------------------------------
  // POST /api/barang   (FR-01: Pendataan Barang Masuk, VR-01..VR-08)
  // ---------------------------------------------------------------------
  async createBarang(req, res) {
    try {
      const {
        no_resi,
        label_barang,
        jumlah_koli,
        tgl_masuk,
        estimasi_tgl_keluar,
        kota_asal_barang,
        kota_tujuan_keluar,
        biaya,
        nama_penerima,
        no_telp_penerima,
        nama_pengirim,
        no_telp_pengirim,
        id_gudang_induk,
      } = req.body;

      // VR-02: ID Resi wajib diisi
      if (!no_resi) {
        return res.status(422).json({ success: false, message: "ID Resi wajib diisi" });
      }

      // VR-01: jumlah koli minimal 1
      if (jumlah_koli === undefined || jumlah_koli === null) {
        return res.status(422).json({ success: false, message: "Jumlah koli wajib diisi" });
      }
      // VR-03: hanya boleh angka bulat (integer)
      if (!Number.isInteger(Number(jumlah_koli))) {
        return res.status(422).json({ success: false, message: "Jumlah koli harus berupa angka bulat" });
      }
      if (Number(jumlah_koli) <= 0) {
        return res.status(422).json({ success: false, message: "Jumlah koli minimal 1" });
      }

      // VR-04: estimasi tanggal keluar wajib diisi
      if (!estimasi_tgl_keluar) {
        return res.status(422).json({ success: false, message: "Kolom estimasi tanggal keluar wajib diisi" });
      }

      // VR-05: nomor telepon wajib diisi dan hanya boleh berisi angka
      if (!no_telp_pengirim || !no_telp_penerima) {
        return res.status(422).json({
          success: false,
          message: "Nomor telepon pengirim dan penerima wajib diisi",
        });
      }
      const phonePattern = /^[0-9]+$/;
      if (!phonePattern.test(no_telp_pengirim) || !phonePattern.test(no_telp_penerima)) {
        return res.status(422).json({
          success: false,
          message: "Nomor telepon hanya boleh berisi angka",
        });
      }

      // VR-06: kota asal & kota tujuan wajib diisi
      if (!kota_asal_barang || !kota_tujuan_keluar) {
        return res.status(422).json({
          success: false,
          message: "Kota asal dan kota tujuan wajib diisi",
        });
      }

      // VR-07: biaya tidak boleh negatif
      if (biaya !== undefined && Number(biaya) < 0) {
        return res.status(422).json({ success: false, message: "Biaya tidak boleh bernilai negatif" });
      }

      // VR-08: estimasi tanggal keluar harus > tanggal masuk DAN > tanggal hari ini
      const masuk = tgl_masuk ? new Date(tgl_masuk) : new Date();
      const keluar = new Date(estimasi_tgl_keluar);
      const now = new Date();

      if (keluar <= masuk) {
        return res.status(422).json({
          success: false,
          message: "Estimasi tanggal keluar harus lebih besar dari tanggal barang masuk",
        });
      }
      if (keluar <= now) {
        return res.status(422).json({
          success: false,
          message: "Estimasi tanggal keluar harus lebih besar dari tanggal hari ini",
        });
      }

      if (!nama_pengirim || !nama_penerima) {
        return res.status(422).json({
          success: false,
          message: "Nama pengirim dan penerima wajib diisi",
        });
      }
      if (!id_gudang_induk) {
        return res.status(422).json({ success: false, message: "Gudang induk wajib dipilih" });
      }

      const warehouse = await MasterWarehouseModel.findById(id_gudang_induk);
      if (!warehouse) {
        return res.status(404).json({ success: false, message: "Gudang induk tidak ditemukan" });
      }

      const existing = await ItemModel.findByResi(no_resi);
      if (existing) {
        return res.status(409).json({ success: false, message: "Resi sudah digunakan" });
      }

      const barang = await ItemModel.create({
        no_resi,
        label_barang,
        jumlah_koli: Number(jumlah_koli),
        tgl_masuk,
        estimasi_tgl_keluar,
        kota_asal_barang,
        kota_tujuan_keluar,
        biaya: biaya !== undefined ? Number(biaya) : 0,
        nama_penerima,
        no_telp_penerima,
        nama_pengirim,
        no_telp_pengirim,
        id_gudang_induk,
      });

      return res.status(201).json({
        success: true,
        message: "Barang berhasil didata",
        data: { barang },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ---------------------------------------------------------------------
  // PUT /api/barang/:id
  // ---------------------------------------------------------------------
  async updateBarang(req, res) {
    try {
      const barang = await ItemModel.findById(req.params.id);
      if (!barang) {
        return res.status(404).json({ success: false, message: "Barang tidak ditemukan" });
      }

      if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
        return res.status(422).json({
          success: false,
          message: `Status is not valid. Option: ${VALID_STATUSES.join(", ")}`,
        });
      }

      if (req.body.jumlah_koli !== undefined) {
        if (!Number.isInteger(Number(req.body.jumlah_koli)) || Number(req.body.jumlah_koli) <= 0) {
          return res.status(422).json({
            success: false,
            message: "Jumlah koli harus berupa angka bulat minimal 1",
          });
        }
      }

      if (req.body.biaya !== undefined && Number(req.body.biaya) < 0) {
        return res.status(422).json({ success: false, message: "Biaya tidak boleh bernilai negatif" });
      }

      if (req.body.no_resi && req.body.no_resi !== barang.no_resi) {
        const duplicate = await ItemModel.findByResi(req.body.no_resi);
        if (duplicate) {
          return res.status(409).json({ success: false, message: "Resi sudah digunakan" });
        }
      }

      const updated = await ItemModel.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Barang berhasil diperbarui",
        data: { barang: updated },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ---------------------------------------------------------------------
  // DELETE /api/barang/:id
  // ---------------------------------------------------------------------
  async deleteBarang(req, res) {
    const db = require("../config/database");
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const barang = await ItemModel.findById(req.params.id, client);
      if (!barang) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Barang tidak ditemukan" });
      }

      // Free up the zone capacity this item was occupying before deleting it,
      // otherwise kapasitas_terisi stays permanently inflated.
      if (barang.id_zona && barang.status !== "Completed") {
        await ZoneModel.adjustCapacity(barang.id_zona, -barang.jumlah_koli, client);
      }

      await client.query("DELETE FROM barang WHERE id_barang = $1", [req.params.id]);

      await client.query("COMMIT");
      return res.status(200).json({ success: true, message: "Barang berhasil dihapus" });
    } catch (error) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  },

  // ---------------------------------------------------------------------
  // GET /api/barang/zone/:id_zone  - items currently placed in a zone
  // ---------------------------------------------------------------------
  async showByZone(req, res) {
    try {
      const zone = await ZoneModel.findById(req.params.id_zone);
      if (!zone) {
        return res.status(404).json({ success: false, message: "Zone tidak ditemukan" });
      }
      const results = await ItemModel.findItemsByZone(zone.id);
      return res.status(200).json({ success: true, data: { results } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = ItemController;
