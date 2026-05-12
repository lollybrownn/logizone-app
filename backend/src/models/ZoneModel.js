const db = require("../config/database");

const ZoneModel = {
  async findAll() {
    const sql = "SELECT * FROM zones";
    const [rows] = await db.query(sql);
    return rows;
  },

  async findById(id) {
    const sql = "SELECT * FROM zones WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  },

  async create({ nama_zona, kapasitas, deskripsi }) {
    const sql =
      "INSERT INTO zones (nama_zona, kapasitas, deskripsi) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [nama_zona, kapasitas, deskripsi]);
    return this.findById(result.insertId);
  },

  async update(id, { nama_zona, kapasitas, deskripsi }) {
    const sql =
      "UPDATE zones SET nama_zona = ?, kapasitas = ?, deskripsi = ? WHERE id = ?";
    const [result] = await db.query(sql, [nama_zona, kapasitas, deskripsi, id]);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const sql = "DELETE FROM zones WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = ZoneModel;
