import { Dashboard } from "./pages/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PendataanBarang } from "./pages/Inbound/PendataanBarang.jsx";
import { PenentuanLokasi } from "./pages/Inbound/PenentuanLokasi.jsx";
import { PencarianBarang } from "./pages/OPERASIONAL/PencarianBarang.jsx";
import { MonitoringAging } from "./pages/OPERASIONAL/MonitoringAging.jsx";
import { ValidasiOutbound } from "./pages/OUTBOUND/ValidasiOutbound.jsx";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pendataan" element={<PendataanBarang />} />
        <Route path="/lokasi" element={<PenentuanLokasi />} />
        <Route path="/pencarian" element={<PencarianBarang />} />
        <Route path="/monitoring" element={<MonitoringAging />} />
        <Route path="/validation" element={<ValidasiOutbound />} />
        {/* Route lainnya... */}
      </Routes>
    </Router>
  )
}