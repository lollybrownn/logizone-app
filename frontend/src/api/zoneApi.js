// src/api/zoneApi.js
// FR-07: Konfigurasi Zona
import { apiClient } from "./client";

export const zoneApi = {
  list: () => apiClient.get("/zones"),

  getById: (id) => apiClient.get(`/zones/${id}`),

  create: ({ kodeZona, namaZona, kapasitas, deskripsi }) =>
    apiClient.post("/zones", {
      kode_zona: kodeZona,
      nama_zona: namaZona,
      kapasitas,
      deskripsi,
    }),

  update: (id, { kodeZona, namaZona, kapasitas, deskripsi }) =>
    apiClient.put(`/zones/${id}`, {
      kode_zona: kodeZona,
      nama_zona: namaZona,
      kapasitas,
      deskripsi,
    }),

  remove: (id) => apiClient.delete(`/zones/${id}`),
};
