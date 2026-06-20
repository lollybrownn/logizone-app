// src/api/dashboardApi.js
import { apiClient } from "./client";

export const dashboardApi = {
  summary: () => apiClient.get("/dashboard"),
};
