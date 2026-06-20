// src/api/warehouseApi.js
// FR-08: Konfigurasi Mitra Gudang Induk
import { apiClient } from "./client";

export const warehouseApi = {
  list: () => apiClient.get("/warehouses"),

  getById: (id) => apiClient.get(`/warehouses/${id}`),

  getByCode: (code) => apiClient.get(`/warehouses/code/${code}`),

  getByName: (name) => apiClient.get(`/warehouses/name/${encodeURIComponent(name)}`),

  create: ({ code, name, address, contact }) =>
    apiClient.post("/warehouses", { code, name, address, contact }),

  update: (id, { code, name, address, contact }) =>
    apiClient.put(`/warehouses/${id}`, { code, name, address, contact }),

  remove: (id) => apiClient.delete(`/warehouses/${id}`),
};
