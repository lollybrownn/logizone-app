// src/api/reportApi.js
// FR-06: Laporan Logistik & Laporan Pendapatan
import { apiClient } from "./client";

function dateQuery({ startDate, endDate } = {}) {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
}

export const reportApi = {
  summary: (range) => apiClient.get(`/reports/summary${dateQuery(range)}`),

  financial: (range) => apiClient.get(`/reports/financial${dateQuery(range)}`),

  logistic: (range) => apiClient.get(`/reports/logistic${dateQuery(range)}`),
};
