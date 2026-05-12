const db = require("../config/database");
const bcrpyt = require("bcryptjs");

const UserModel = {
  async findAll() {
    const sql = "SELECT id,username,role FROM users";
    const [rows] = await db.query(sql);
    return rows;
  },
  async findByUsername(username) {
    const sql = "SELECT id,username,role from users where username = ?";
    const [rows] = await db.query(sql, [username]);
    return rows[0] || null;
  },
  async findByRole(role) {
    const sql = "SELECT id,username,role FROM users where role = ?";
    const [rows] = await db.query(sql, [role]);
    return rows;
  },
  async findById(id) {
    const sql = "SELECT id,username,role FROM users where id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  },
  async create({ username, password, role }) {
    const hashed_password = await bcrpyt.hash(password, 10);
    const sql = "INSERT INTO users(username,password,role) VALUES (?,?,?)";
    const [result] = await db.query(sql, [username, hashed_password, role]);
    return this.findById(result.insertId);
  },
  async update({ id, username, role }) {
    const sql = "UPDATE users set username = ?, role = ? WHERE id =? ";
    await db.query(sql, [username, role]);
    return true;
  },
  async delete(id) {
    const sql = "DELETE FROM users where id = ?";
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  },
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrpyt.compare(plainPassword, hashedPassword);
  },
};

module.exports = UserModel;
