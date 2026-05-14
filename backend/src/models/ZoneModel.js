const db = require("../config/database");

const ZoneModel = {
  async findAll() {
    const sql = "SELECT * FROM zones";
    const results = await db.query(sql);
    return results.rows;
  },

  async findById(id) {
    const sql = "SELECT * FROM zones WHERE id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  },

  async create({ nama_zona, kapasitas, deskripsi }) {
    const sql =
      "INSERT INTO zones (nama_zona, kapasitas, deskripsi) VALUES ($1, $2, $3) RETURNING *";
    const result = await db.query(sql, [nama_zona, kapasitas, deskripsi]);
    return result.rows[0];
  },

  async update(id, { nama_zona, kapasitas, deskripsi }) {
    const sql =
      "UPDATE zones SET nama_zona = $1, kapasitas = $2, deskripsi = $3 WHERE id = $4";
    const result = await db.query(sql, [nama_zona, kapasitas, deskripsi, id]);
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
