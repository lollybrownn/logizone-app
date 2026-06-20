// src/api/barangApi.js
// FR-01: Pendataan Barang Masuk
// FR-02: Pencarian barang via ID Resi/Nama
import { apiClient } from "./client";

export const barangApi = {
  // params: { search, label_barang, no_resi, status, id_zona, page, per_page }
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
    ).toString();
    return apiClient.get(`/barang${query ? `?${query}` : ""}`);
  },

  unplaced: () => apiClient.get("/barang/unplaced"),

  byZone: (idZone) => apiClient.get(`/barang/zone/${idZone}`),

  getById: (id) => apiClient.get(`/barang/${id}`),

  create: (payload) => apiClient.post("/barang", payload),

  update: (id, payload) => apiClient.put(`/barang/${id}`, payload),

  remove: (id) => apiClient.delete(`/barang/${id}`),
};
