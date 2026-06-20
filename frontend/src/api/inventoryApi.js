// src/api/inventoryApi.js
// FR-05: Aging & Overdue Stock
import { apiClient } from "./client";

export const inventoryApi = {
  aging: () => apiClient.get("/inventory/aging"),

  overdue: () => apiClient.get("/inventory/overdue"),

  // Combined summary + both lists, matches the All/Aging/Overdue tab UI (Gambar 7.8)
  monitoring: () => apiClient.get("/inventory/monitoring"),
};
