import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "./context/AppProviders";
import ProtectedRoute from "./components/common/ProtectedRoute";

import { Dashboard } from "./pages/Dashboard.jsx";
import { PendataanBarang } from "./pages/Inbound/PendataanBarang.jsx";
import { PenentuanLokasi } from "./pages/Inbound/PenentuanLokasi.jsx";
import { PencarianBarang } from "./pages/Operasional/PencarianBarang.jsx";
import { MonitoringAging } from "./pages/Operasional/MonitoringAging.jsx";
import { ValidasiOutbound } from "./pages/Outbound/ValidasiOutbound.jsx";
import { Laporan } from "./pages/Owner/Laporan.jsx";
import { ManajemenZona } from "./pages/Owner/ManajemenZona.jsx";
import { GudangInduk } from "./pages/Owner/GudangInduk.jsx";
import { ManajemenAkun } from "./pages/Owner/ManajemenAkun.jsx";
import Login from "./Auth/Login.jsx";

export const App = () => {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Any authenticated role */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pendataan" element={<PendataanBarang />} />
            <Route path="/lokasi" element={<PenentuanLokasi />} />
            <Route path="/pencarian" element={<PencarianBarang />} />
            <Route path="/monitoring" element={<MonitoringAging />} />
            <Route path="/validation" element={<ValidasiOutbound />} />
          </Route>

          {/* Owner-only pages */}
          <Route element={<ProtectedRoute roles={["Owner"]} />}>
            <Route path="/reports" element={<Laporan />} />
            <Route path="/zones" element={<ManajemenZona />} />
            <Route path="/warehouse" element={<GudangInduk />} />
            <Route path="/users" element={<ManajemenAkun />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AppProviders>
  );
};
