const db = require("../config/database");

const HistoryItemModel = {
  async create(
    { tipe_keluar, berat_barang = 0, biaya_ekstra = 0, total_biaya, id_barang, id_user_validator },
    connection = db,
  ) {
    const sql = `
      INSERT INTO history_barang (tipe_keluar, berat_barang, biaya_ekstra, total_biaya, id_barang, id_user_validator)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
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
    const sql = `
      SELECT COALESCE(SUM(total_biaya), 0) AS total_income
      FROM history_barang
      WHERE tgl_keluar BETWEEN $1 AND $2
    `;
    const result = await db.query(sql, [start_date, end_date]);
    return Number(result.rows[0].total_income);
  },

  async findRecapItems(start_date, end_date) {
    const sql = `
      SELECT
        hb.total_biaya,
        hb.berat_barang,
        hb.biaya_ekstra,
        hb.tgl_keluar,
        b.no_resi,
        b.label_barang
      FROM history_barang hb
      JOIN barang b ON hb.id_barang = b.id_barang
      WHERE hb.tgl_keluar BETWEEN $1 AND $2
      ORDER BY hb.tgl_keluar DESC
    `;
    const result = await db.query(sql, [start_date, end_date]);
    return result.rows;
  },

  async findHistoryOutbound() {
    const sql = `
      SELECT
        hb.id,
        hb.tipe_keluar,
        hb.tgl_keluar,
        hb.berat_barang,
        hb.biaya_ekstra,
        b.no_resi,
        b.label_barang,
        b.jumlah_koli
      FROM history_barang hb
      JOIN barang b ON hb.id_barang = b.id_barang
      ORDER BY hb.tgl_keluar DESC
    `;
    const result = await db.query(sql);
    return result.rows;
  },

  async findTotalProcessedItems(start_date, end_date) {
    const sql = `
      SELECT COUNT(id) AS total
      FROM history_barang
      WHERE tgl_keluar BETWEEN $1 AND $2
    `;
    const result = await db.query(sql, [start_date, end_date]);
    return Number(result.rows[0].total);
  },

  // FR-06: Laporan Logistik - chronological activity log (Inbound + Outbound)
  async getLogisticReport(start_date, end_date) {
    const sql = `
      SELECT
        hb.tgl_keluar AS tanggal,
        'OUTBOUND' AS aksi,
        b.no_resi,
        b.label_barang,
        CONCAT('Barang keluar - ', hb.tipe_keluar) AS keterangan
      FROM history_barang hb
      JOIN barang b ON hb.id_barang = b.id_barang
      WHERE hb.tgl_keluar BETWEEN $1 AND $2

      UNION ALL

      SELECT
        b.tgl_masuk AS tanggal,
        'PENDATAAN BARANG' AS aksi,
        b.no_resi,
        b.label_barang,
        'Barang baru didata masuk gudang' AS keterangan
      FROM barang b
      WHERE b.tgl_masuk BETWEEN $1 AND $2

      ORDER BY tanggal DESC
    `;
    const result = await db.query(sql, [start_date, end_date]);
    return result.rows;
  },
};

module.exports = HistoryItemModel;
