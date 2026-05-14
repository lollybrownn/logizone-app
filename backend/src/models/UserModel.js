const db = require("../config/database");
const bcrpyt = require("bcryptjs");

const UserModel = {
  async findAll() {
    const sql = "SELECT id,username,role FROM users";
    const results = await db.query(sql);
    return results.rows;
  },
  async findByUsername(username) {
    const sql = "SELECT id,username,role from users where username = $1";
    const result = await db.query(sql, [username]);
    return result.rows[0] || null;
  },
  async findByRole(role) {
    const sql = "SELECT id,username,role FROM users where role = $1";
    const results = await db.query(sql, [role]);
    return results.rows;
  },
  async findById(id) {
    const sql = "SELECT id,username,role FROM users where id = $1";
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  },
  async create({ username, password, role }) {
    const hashed_password = await bcrpyt.hash(password, 10);
    const sql =
      "INSERT INTO users(username,password,role) VALUES ($1,$2,$3) RETURNING *";
    const result = await db.query(sql, [username, hashed_password, role]);
    return result.rows[0];
  },
  async update({ id, username, role }) {
    const sql = "UPDATE users set username = $1, role = $2 WHERE id =$3 ";
    const result = await db.query(sql, [username, role, id]);
    return result.rowCount > 0;
  },
  async delete(id) {
    const sql = "DELETE FROM users where id = $1";
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  },
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrpyt.compare(plainPassword, hashedPassword);
  },
};

module.exports = UserModel;
