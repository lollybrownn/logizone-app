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
    let index = 1;

    // Generic search
    if (search) {
      sql += `
        AND (
          b.label_barang ILIKE $${index}
          OR b.no_resi ILIKE $${index + 1}
        )
      `;

      params.push(`%${search}%`, `%${search}%`);
      index += 2;
    }

    // Filter label_barang
    if (label_barang) {
      sql += ` AND b.label_barang ILIKE $${index}`;
      params.push(`%${label_barang}%`);
      index++;
    }

    // Filter no_resi
    if (no_resi) {
      sql += ` AND b.no_resi = $${index}`;
      params.push(no_resi);
      index++;
    }

    // Filter status
    if (status) {
      sql += ` AND b.status = $${index}`;
      params.push(status);
      index++;
    }

    sql += `
      ORDER BY b.tgl_masuk DESC
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    params.push(Number(limit), Number(offset));

    const result = await db.query(sql, params);

    return result.rows;
  },

  async findAgingItems() {
    const sql = `
      SELECT *,sum(id) as total_barang_aging
      FROM barang
      WHERE NOW() >= tanggal_keluar - INTERVAL '3 days'
      AND NOW() < tanggal_keluar
    `;

    const result = await db.query(sql);

    return result.rows;
  },

  async findOverdueItems() {
    const sql = `
      SELECT *,sum(id) as total_barang_overdue
      FROM barang
      WHERE tanggal_keluar < NOW()
    `;

    const result = await db.query(sql);

    return result.rows;
  },

  async countAll({ search, label_barang, no_resi, status } = {}) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM barang b
      WHERE 1=1
    `;

    const params = [];
    let index = 1;

    if (search) {
      sql += `
        AND (
          b.label_barang ILIKE $${index}
          OR b.no_resi ILIKE $${index + 1}
        )
      `;

      params.push(`%${search}%`, `%${search}%`);
      index += 2;
    }

    if (label_barang) {
      sql += ` AND b.label_barang ILIKE $${index}`;
      params.push(`%${label_barang}%`);
      index++;
    }

    if (no_resi) {
      sql += ` AND b.no_resi = $${index}`;
      params.push(no_resi);
      index++;
    }

    if (status) {
      sql += ` AND b.status = $${index}`;
      params.push(status);
      index++;
    }

    const result = await db.query(sql, params);

    return Number(result.rows[0].total);
  },

  async findItemsByZone(id_zone) {
    const sql = `
      SELECT
        b.no_resi,
        b.label_barang,
        b.jumlah_koli
      FROM barang b
      JOIN zona z
        ON b.id_zona = z.id_zona
      WHERE z.id_zona = $1
    `;

    const result = await db.query(sql, [id_zone]);

    return result.rows;
  },

  async findById(id_barang, connection = db) {
    const sql = `
      SELECT
        b.*,
        z.nama_zona,
        g.nama_gudang
      FROM barang b
      LEFT JOIN zona z ON b.id_zona = z.id_zona
      LEFT JOIN gudang_induk g ON b.id_gudang_induk = g.id_gudang_induk
      WHERE b.id_barang = $1
    `;

    const result = await connection.query(sql, [id_barang]);

    return result.rows[0] || null;
  },

  async findByResi(no_resi) {
    const sql = "SELECT * FROM barang WHERE no_resi = $1";

    const result = await db.query(sql, [no_resi]);

    return result.rows[0] || null;
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
        no_resi,
        label_barang,
        jumlah_koli,
        tgl_ambil,
        kota_asal_barang,
        kota_tujuan_keluar,
        biaya,
        status,
        nama_penerima,
        no_telp_penerima,
        nama_pengirim,
        no_telp_pengirim,
        id_gudang_induk,
        id_zona
      )
      VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        'Pending',
        $8, $9, $10,
        $11, $12, $13
      )
      RETURNING *
    `;

    const result = await db.query(sql, [
      no_resi,
      label_barang,
      jumlah_koli,
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

    return result.rows[0];
  },

  // -------------------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------------------

  async update(id_barang, fields, connection = db) {
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

    let index = 1;

    for (const key of allowed) {
      if (key in fields) {
        setClauses.push(`${key} = $${index}`);

        params.push(fields[key]);

        index++;
      }
    }

    if (setClauses.length === 0) {
      return null;
    }

    params.push(id_barang);

    const sql = `
      UPDATE barang
      SET ${setClauses.join(", ")}
      WHERE id_barang = $${index}
      RETURNING *
    `;

    const result = await connection.query(sql, params);

    return result.rows[0] || null;
  },

  async updateStatus(id_barang, new_status, connection = db) {
    const sql = "UPDATE barang SET status = $1 WHERE id = $2";
    const result = connection.query(sql, [new_status, id_barang]);
    return result.rows[0] || null;
  },

  // -------------------------------------------------------------------------
  // ASSIGN ZONA
  // -------------------------------------------------------------------------

  async assignZone(id_barang, id_zona, connection = db) {
    const sql = `
      UPDATE barang
      SET
        id_zona = $1,
        status = 'Stored'
      WHERE id_barang = $2
      RETURNING *
    `;

    const result = await connection.query(sql, [id_zona, id_barang]);

    return result.rows[0];
  },

  // -------------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------------

  async delete(id_barang) {
    const sql = "DELETE FROM barang WHERE id_barang = $1";

    const result = await db.query(sql, [id_barang]);

    return result.rowCount > 0;
  },
};

module.exports = ItemModel;
