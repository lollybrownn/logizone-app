// src/api/userApi.js
// FR-09: Konfigurasi Manajemen Akun Pengguna
import { apiClient } from "./client";

export const userApi = {
  list: () => apiClient.get("/users"),

  getById: (id) => apiClient.get(`/users/${id}`),

  getByUsername: (username) => apiClient.get(`/users/username/${username}`),

  getByRole: (role) => apiClient.get(`/users/role/${encodeURIComponent(role)}`),

  create: ({ username, password, role }) =>
    apiClient.post("/users", { username, password, role }),

  update: (id, { username, role, status }) =>
    apiClient.put(`/users/${id}`, { username, role, status }),

  remove: (id) => apiClient.delete(`/users/${id}`),
};
