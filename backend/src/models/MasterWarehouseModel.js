const db = require("../config/database");

const MasterWarehouseModel = {
  async findAll() {
    const sql = "SELECT * from gudang_induk ORDER BY id ASC";
    const results = await db.query(sql);
    return results.rows;
  },
  async findById(id) {
    const sql = "SELECT * from gudang_induk where id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  },
  async findByName(name) {
    const sql = "SELECT * from gudang_induk where nama = $1";
    const result = await db.query(sql, [name]);
    return result.rows[0] || null;
  },
  async findByCode(code) {
    const sql = "SELECT * from gudang_induk where kode = $1";
    const result = await db.query(sql, [code]);
    return result.rows[0] || null;
  },
  async create({ code, name, address, contact }) {
    const sql =
      "INSERT INTO gudang_induk(kode,nama,alamat,kontak) VALUES ($1,$2,$3,$4) RETURNING *";
    const result = await db.query(sql, [code, name, address, contact]);
    return result.rows[0];
  },
  async update(id, { code, name, address, contact }) {
    const sql =
      "UPDATE gudang_induk set kode = $1, nama = $2, alamat = $3, kontak = $4 WHERE id = $5";
    const result = await db.query(sql, [code, name, address, contact, id]);
    return result.rowCount > 0;
  },
  async hasLinkedBarang(id) {
    const sql = "SELECT 1 FROM barang where id_gudang_induk = $1 LIMIT 1 ";
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  },
  async delete(id) {
    const sql = "DELETE FROM gudang_induk WHERE id = $1";
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  },
};
module.exports = MasterWarehouseModel;
