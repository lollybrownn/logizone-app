const db = require("../config/database");

const ZoneModel = {
  async findAll() {
    const sql = "SELECT * FROM zones ORDER BY id ASC";
    const results = await db.query(sql);
    return results.rows;
  },

  async findById(id) {
    const sql = "SELECT * FROM zones WHERE id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  },

  async findByCode(kode_zona) {
    const sql = "SELECT * FROM zona where kode_zona = $1";
    const result = await db.query(sql, [kode_zona]);
    return result.rows[0] || null;
  },

  async findByName(nama_zona) {
    const sql = "SELECT * FROM zona where nama_zona = $1";
    const result = await db.query(sql, [kode_zona]);
    return result.rows[0] || null;
  },

  async create({ kode_zona, nama_zona, kapasitas, deskripsi }) {
    const sql =
      "INSERT INTO zones (kode_zona, nama_zona, kapasitas, deskripsi, kapasitas_terisi) VALUES ($1, $2, $3,$4,0) RETURNING *";
    const result = await db.query(sql, [
      kode_zona,
      nama_zona,
      kapasitas,
      deskripsi,
    ]);
    return result.rows[0];
  },

  async update(id, { kode_zona, nama_zona, kapasitas, deskripsi }) {
    const sql =
      "UPDATE zones SET kode_zona = $1,nama_zona = $2, kapasitas = $3, deskripsi = $4 WHERE id = $5";
    const result = await db.query(sql, [
      kode_zona,
      nama_zona,
      kapasitas,
      deskripsi,
      id,
    ]);
    return result.rowCount > 0;
  },
  async adjustCapacity(id, deltaKoli, connection = db) {
    const sql =
      "UPDATE zones SET kapasitas_terisi = kapasitas_terisi + $1 WHERE id = $2 RETURNING *";
    const result = await db.query(sql, [deltaKoli, id]);
    return result.rows[0] || null;
  },
  async hasItem(id) {
    const sql =
      "SELECT 1 FROM barang WHERE id_zona = $1 and STATUS !='Completed' LIMIT 1";
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  },
  async updateCapacity(id, new_capacity, connection = db) {
    const sql = "UPDATE zones SET kapasitas = $1 WHERE id = $2";
    const result = await connection.query(sql, [new_capacity, id]);
    return result.rowCount > 0;
  },

  async delete(id) {
    const sql = "DELETE FROM zones WHERE id = $1";
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  },
};

module.exports = ZoneModel;
