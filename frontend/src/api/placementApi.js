// src/api/placementApi.js
// FR-01 (step 2: Penentuan Lokasi) / FR-03: Auto Stock Management
import { apiClient } from "./client";

export const placementApi = {
  // Assign an unplaced item to a zone for the first time
  assign: (idBarang, idZona) =>
    apiClient.post(`/placement/${idBarang}/assign`, { id_zona: idZona }),

  // Move an already-placed item to a different zone
  move: (idBarang, idZona) =>
    apiClient.put(`/placement/${idBarang}/move`, { id_zona: idZona }),
};
