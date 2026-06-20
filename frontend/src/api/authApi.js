// src/api/authApi.js
import { apiClient } from "./client";

export const authApi = {
  login: (username, password) =>
    apiClient.post("/auth/login", { username, password }),
  me: (opts) => apiClient.get("/auth/me", opts),
};
