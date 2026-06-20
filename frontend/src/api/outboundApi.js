// src/api/outboundApi.js
// FR-04: Outbound Validation (Validasi Barang Keluar)
import { apiClient } from "./client";

export const outboundApi = {
  ready: () => apiClient.get("/outbound/ready"),

  history: () => apiClient.get("/outbound/history"),

  // tipeKeluar: "Ambil di Gudang" | "Diantar"
  validate: (idBarang, { tipeKeluar, beratBarang = 0, biayaEkstra = 0 }) =>
    apiClient.post(`/outbound/${idBarang}/validate`, {
      tipe_keluar: tipeKeluar,
      berat_barang: beratBarang,
      biaya_ekstra: biayaEkstra,
    }),
};
