const db = require("../config/database");
const bcrpyt = require("bcryptjs");

const VALID_ROLES = ["Owner", "Staff Operasional", "Staff Gudang"];

const UserModel = {
  async findAll() {
    const sql = "SELECT id,username,role,status,created_at FROM users ORDER BY id ASC";
    const results = await db.query(sql);
    return results.rows;
  },
  async findByUsername(username) {
    const sql =
      "SELECT id,username, password, role, status from users where username = $1";
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
      "INSERT INTO users(username,password,role) VALUES ($1,$2,$3) RETURNING id, username, role, status, created_at";
    const result = await db.query(sql, [username, hashed_password, role]);
    return result.rows[0];
  },
  async update(id, { username, role, status }) {
    const allowed = { username, role, status };
    const setClauses = [];
    const params = [];
    let index = 1;

    for (const key of Object.keys(allowed)) {
      if (allowed[key] !== undefined) {
        setClauses.push(`${key} = $${index}`);
        params.push(allowed[key]);
        index++;
      }
    }

    if (setClauses.length === 0) return null;

    params.push(id);

    const sql = `
      UPDATE users
      SET ${setClauses.join(", ")}
      WHERE id = $${index}
      RETURNING id, username, role, status, created_at
    `;
    const result = await db.query(sql, params);
    return result.rows[0] || null;
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
module.exports.VALID_ROLES = VALID_ROLES;
