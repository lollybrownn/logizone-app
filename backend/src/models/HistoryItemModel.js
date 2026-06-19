const db = require("../config/database");

const HistoryItemModel = {
  async create({
    tipe_keluar,
    berat_barang = 0,
    biaya_ekstra = 0,
    total_biaya,
    id_barang,
    id_user_validator,
    connection = db,
  }) {
    const sql =
      "INSERT INTO history_barang(tipe_keluar,berat_barang,biaya_ekstra,total_biaya,id_barang,id_user_validator) VALUES ($1,$2,$3,$4,$5,$6)";
    const result = await connection.query(sql, [
      tipe_keluar,
      berat_barang,
      biaya_ekstra,
      total_biaya,
      id_barang,
      id_user_validator,
    ]);
    return result.rows[0];
  },

  async findTotalIncome(start_date, end_date) {
    const sql =
      "SELECT COALESCE(sum(total_biaya), 0) AS total_income FROM history_barang WHERE tgl_keluar BETWEEN $1 AND $2";
    const result = await db.query(sql, [start_date, end_date]);
    return result.rows[0] || 0;
  },

  async findRecapItems(start_date, end_date) {
    const sql = `SELECT 
      hb.total_biaya,
      hb.berat_barang,
      hb.biaya_tambahan,
      hb.tgl_keluar,
      b.no_resi,
      b.label_barang 
      FROM history_barang hb 
      JOIN barang b ON history_barang.id_barang = b.id  
      WHERE hb.tgl_keluar BETWEEN $1 AND $2 ORDER BY hb.tgl_keluar DESC`;
    const results = db.query(sql, [start_date, end_date]);
    return results.rows;
  },
  async findHistoryOutbound() {
    const sql =
      "SELECT hb.biaya_ekstra,hb.tgl_keluar,hb.berat_barang,hb.tipe_keluar,b.label_barang,b.jumlah_koli FROM history_barang hb JOIN barang b ON hb.id_barang =  b.id_barang WHERE b.status = $1";
    const results = await db.query(sql, ["Picked Up"]);
    return results.rows;
  },

  async findTotalProcessedItems(start_date, end_date) {
    const sql =
      "SELECT COUNT(id) FROM history_barang WHERE tgl_keluar BETWEEN $1 AND $2";
    const result = await db.query(sql, [start_date, end_date]);
    return result.rows[0] || 0;
  },
};

module.exports = HistoryItemModel;
