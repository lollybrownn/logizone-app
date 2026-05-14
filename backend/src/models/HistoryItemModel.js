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
      "INSERT INTO History_Barang(berat_barang,biaya_ekstra,total_biaya,id_barang,id_user_validator) VALUES (,$1,$2,$3,$4,$5)";
    const result = await connection.query(sql, [
      berat_barang,
      biaya_ekstra,
      total_biaya,
      id_barang,
      id_user_validator,
    ]);
    return result.rows[0];
  },
};

module.exports = HistoryItemModel;
