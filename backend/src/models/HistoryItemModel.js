const db = require("../config/database");

const HistoryItemModel = {
  async create({
    berat_barang = 0,
    biaya_ekstra = 0,
    total_biaya,
    id_barang,
    id_user_validator,
    connection = db,
  }) {
    const sql =
      "INSERT INTO history_barang(berat_barang,biaya_ekstra,total_biaya,id_barang,id_user_validator) VALUES (,$1,$2,$3,$4,$5)";
    const result = await connection.query(sql, [
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
      "SELECT sum(total_biaya) FROM history_barang WHERE tanggal_keluar BETWEEN $1 AND $2";
    const result = await db.query(sql, [start_date, end_date]);
    return result.rows[0] || null;
  },

  async findRecapItems(start_date, end_date) {
    const sql =
      "SELECT hb.total_biaya,hb.beart_barang,hb.biaya_tambahan,hb.tanggal_keluar,b.label_barang FROM history_barang hb JOIN barang b ON history_barang.id_barang = b.id  WHERE hb.tanggal_keluar BETWEEN $1 AND $2";
    const results = db.query(sql, [start_date, end_date]);
    return results.rows;
  },
};

module.exports = HistoryItemModel;
