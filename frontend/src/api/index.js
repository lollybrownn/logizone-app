// src/api/index.js
// Re-exports every API module so pages can do:
//   import { barangApi, zoneApi, authApi } from "../../api";
export { apiClient } from "./client";
export { authApi } from "./authApi";
export { barangApi } from "./barangApi";
export { placementApi } from "./placementApi";
export { outboundApi } from "./outboundApi";
export { inventoryApi } from "./inventoryApi";
export { reportApi } from "./reportApi";
export { zoneApi } from "./zoneApi";
export { warehouseApi } from "./warehouseApi";
export { userApi } from "./userApi";
export { dashboardApi } from "./dashboardApi";
