const db = require("../config/database");

const ItemModel = {
  // -------------------------------------------------------------------------
  // READ
  // -------------------------------------------------------------------------

  async findAll({
    search,
    label_barang,
    no_resi,
    status,
    limit = 15,
    offset = 0,
  } = {}) {
    let sql = `
      SELECT
        b.*,
        z.nama_zona,
        g.nama_gudang
      FROM barang b
      LEFT JOIN zona z ON b.id_zona = z.id_zona
      LEFT JOIN gudang_induk g ON b.id_gudang_induk = g.id_gudang_induk
      WHERE 1=1
    `;
    const params = [];

    // Generic search: label_barang ATAU no_resi
    if (search) {
      sql += ` AND (b.label_barang LIKE ? OR b.no_resi LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Filter spesifik label
    if (label_barang) {
      sql += ` AND b.label_barang LIKE ?`;
      params.push(`%${label_barang}%`);
    }

    // Filter spesifik no_resi (exact)
    if (no_resi) {
      sql += ` AND b.no_resi = ?`;
      params.push(no_resi);
    }

    // Filter status
    if (status) {
      sql += ` AND b.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY b.tgl_masuk DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(sql, params);
    return rows;
  },

  async countAll({ search, label_barang, no_resi, status } = {}) {
    let sql = `SELECT COUNT(*) as total FROM barang b WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (b.label_barang LIKE ? OR b.no_resi LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (label_barang) {
      sql += ` AND b.label_barang LIKE ?`;
      params.push(`%${label_barang}%`);
    }
    if (no_resi) {
      sql += ` AND b.no_resi = ?`;
      params.push(no_resi);
    }
    if (status) {
      sql += ` AND b.status = ?`;
      params.push(status);
    }

    const [[{ total }]] = await db.query(sql, params);
    return total;
  },

  async findById(id_barang) {
    const sql = `
      SELECT
        b.*,
        z.nama_zona,
        g.nama_gudang
      FROM barang b
      LEFT JOIN zona z ON b.id_zona = z.id_zona
      LEFT JOIN gudang_induk g ON b.id_gudang_induk = g.id_gudang_induk
      WHERE b.id_barang = ?
    `;
    const [rows] = await db.query(sql, [id_barang]);
    return rows[0] || null;
  },

  async findByResi(no_resi) {
    const sql = `SELECT * FROM barang WHERE no_resi = ?`;
    const [rows] = await db.query(sql, [no_resi]);
    return rows[0] || null;
  },

  // -------------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------------

  async create({
    no_resi,
    label_barang,
    jumlah_koli,
    tgl_ambil = null,
    kota_asal_barang,
    kota_tujuan_keluar,
    biaya,
    nama_penerima,
    no_telp_penerima,
    nama_pengirim,
    no_telp_pengirim,
    id_gudang_induk,
    id_zona = null,
  }) {
    const sql = `
      INSERT INTO barang (
        no_resi, label_barang, jumlah_koli,
        tgl_ambil,
        kota_asal_barang, kota_tujuan_keluar, biaya,
        status,
        nama_penerima, no_telp_penerima,
        nama_pengirim, no_telp_pengirim,
        id_gudang_induk, id_zona
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
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
    ]);
    return this.findById(result.insertId);
  },

  // -------------------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------------------

  async update(id_barang, fields) {
    // Hanya update kolom yang dikirim (partial update)
    const allowed = [
      "no_resi",
      "label_barang",
      "jumlah_koli",
      "tgl_masuk",
      "tgl_ambil",
      "kota_asal_barang",
      "kota_tujuan_keluar",
      "biaya",
      "status",
      "nama_penerima",
      "no_telp_penerima",
      "nama_pengirim",
      "no_telp_pengirim",
      "id_gudang_induk",
      "id_zona",
    ];

    const setClauses = [];
    const params = [];

    for (const key of allowed) {
      if (key in fields) {
        setClauses.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }

    if (setClauses.length === 0) return null;

    params.push(id_barang);
    const sql = `UPDATE barang SET ${setClauses.join(", ")} WHERE id_barang = ?`;
    await db.query(sql, params);
    return this.findById(id_barang);
  },

  // -------------------------------------------------------------------------
  // ASSIGN ZONA — staff menentukan lokasi barang
  // -------------------------------------------------------------------------

  async assignZone(id_barang, id_zona, connection = db) {
    const sql = `
      UPDATE barang
      SET id_zona = ?, status = 'Stored'
      WHERE id_barang = ?
    `;
    await connection.query(sql, [id_zona, id_barang]);
    return this.findById(id_barang);
  },

  // -------------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------------

  async delete(id_barang) {
    const sql = `DELETE FROM barang WHERE id_barang = ?`;
    const [result] = await db.query(sql, [id_barang]);
    return result.affectedRows > 0;
  },

  async getGoodsByZone(id_zone) {
    const sql =
      "SELECT no_resi, label_barang, jumlah_koli, FROM barang JOIN zona z ON b.id_zone = z.id";
    const [results] = await db.query(sql, [id_zone]);
    return results;
  },
};

module.exports = ItemModel;
