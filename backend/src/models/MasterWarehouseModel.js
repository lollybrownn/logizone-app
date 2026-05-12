const db = require("../config/database");

const MasterWarehouseModel = {
  async findAll() {
    const sql = "SELECT kode,nama,alamat from Gudang_Induk";
    const [rows] = await db.query(sql);
    return rows;
  },
  async findById(id) {
    const sql = "SELECT * from Gudang_Induk where id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  },
  async findByName(name) {
    const sql = "SELECT * from Gudang_Indul where nama = ?";
    const [rows] = await db.query(sql, [name]);
    return rows[0] || null;
  },
  async findByCode(code) {
    const sql = "SELECT * from Gudang_Induk where kode = ?";
    const [rows] = await db.query(sql, [code]);
    return rows[0] || null;
  },
  async create({ code, name, address, contact }) {
    const sql = "INSERT INTO Gudang_Induk VALUES (?,?,?,?)";
    const [result] = await db.query(sql, [code, name, address, contact]);
    return result.insertId;
  },
  async update({ code, name, address, contact }) {
    const sql =
      "UPDATE Gudang_Induk set kode = ?, nama = ?, alamat = ?, kontak = ?";
    await db.query(sql, [code, name, address, contact]);
  },
  async delete(id) {
    const sql = "DELETE FROM Gudang_Induk WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  },
};
module.exports = MasterWarehouseModel;
