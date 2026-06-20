import { Dashboard } from "./pages/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PendataanBarang } from "./pages/Inbound/PendataanBarang.jsx";
import { PenentuanLokasi } from "./pages/Inbound/PenentuanLokasi.jsx";
import { PencarianBarang } from "./pages/Operasional/PencarianBarang.jsx";
import { MonitoringAging } from "./pages/Operasional/MonitoringAging.jsx";
import { ValidasiOutbound } from "./pages/Outbound/ValidasiOutbound.jsx";
import { Login } from "./Auth/Login.jsx";

// Komponen untuk memproteksi halaman
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Jika tidak ada token, tendang balik ke login
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

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

    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Navigate to="/login" replace />} />
    //     <Route path="/login" element={<Login />} />

    //     {/* Bungkus halaman yang rahasia dengan ProtectedRoute */}
    //     <Route path="/dashboard" element={
    //       <ProtectedRoute>
    //         <Dashboard />
    //       </ProtectedRoute>
    //     } />

    //     <Route path="/pendataan" element={
    //       <ProtectedRoute>
    //         <PendataanBarang />
    //       </ProtectedRoute>
    //     } />

    //     {/* ... Lakukan hal yang sama untuk route lainnya ... */}
    //   </Routes>
    // </Router>
  )
}