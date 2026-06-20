// src/api/zoneApi.js
// FR-07: Konfigurasi Zona
import { apiClient } from "./client";

export const zoneApi = {
  list: () => apiClient.get("/zones"),

  getById: (id) => apiClient.get(`/zones/${id}`),

  create: ({ kodeZona, namaZona, kapasitasMaks, deskripsi }) =>
    apiClient.post("/zones", {
      kode_zona: kodeZona,
      nama_zona: namaZona,
      kapasitas_maks: kapasitasMaks,
      deskripsi,
    }),

  update: (id, { kodeZona, namaZona, kapasitasMaks, deskripsi }) =>
    apiClient.put(`/zones/${id}`, {
      kode_zona: kodeZona,
      nama_zona: namaZona,
      kapasitas_maks: kapasitasMaks,
      deskripsi,
    }),

  remove: (id) => apiClient.delete(`/zones/${id}`),
};
