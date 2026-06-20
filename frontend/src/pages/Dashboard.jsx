import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { FileText, Box, MapPin, Truck, AlertTriangle, Activity } from "lucide-react";

// Komponen Card (Desain tetap, data masuk lewat props)
const DashboardCard = ({ title, value, subtitle, icon, iconBgColor }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-md">
        <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{value || "0"}</h3>
            <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor}`}>{icon}</div>
    </div>
);

export const Dashboard = () => {
    // DATA DI SINI: Semua teks sudah ada, nilai defaultnya "0" atau ""
    // Saat sudah ada database, Anda tinggal ganti value: "0" jadi value: data.totalResi
    const [stats, setStats] = useState([
        { title: "Total Resi", value: "0", subtitle: "Resi terdaftar", icon: <FileText size={20} className="text-blue-600"/>, iconBgColor: "bg-blue-50" },
        { title: "Total Barang", value: "0", subtitle: "Zona aktif", icon: <Box size={20} className="text-cyan-500"/>, iconBgColor: "bg-cyan-50" },
        { title: "Belum Berlokasi", value: "0", subtitle: "Menunggu penempatan", icon: <MapPin size={20} className="text-orange-400"/>, iconBgColor: "bg-orange-50" },
        { title: "Transaksi Outbound", value: "0", subtitle: "Total semua waktu", icon: <Truck size={20} className="text-green-500"/>, iconBgColor: "bg-green-50" },
        { title: "Aging / Overdue", value: "0", subtitle: "Stok menua", icon: <AlertTriangle size={20} className="text-orange-500"/>, iconBgColor: "bg-orange-100/50" },
        { title: "Aktivitas", value: "0", subtitle: "Log terbaru", icon: <Activity size={20} className="text-indigo-500"/>, iconBgColor: "bg-indigo-50" },
    ]);

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden bg-[#F8F9FA]">
            <Sidebar className="flex-none" />

            <div className="flex-1 h-screen overflow-y-auto p-10">
                <div className="p-4 mb-2"> 
                    <h1 className="text-2xl font-bold flex items-center gap-2">Halo, owner 👋</h1>
                    <p className="text-sm text-slate-500">Anda login sebagai Owner. Berikut ringkasan operasi gudang hari ini.</p>
                </div>

                {/* Grid Card: SEMUA TEKS SUDAH ADA DI SINI */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-3 px-4">
                    {stats.map((item, index) => (
                        <DashboardCard 
                            key={index}
                            title={item.title}
                            value={item.value}
                            subtitle={item.subtitle}
                            icon={item.icon}
                            iconBgColor={item.iconBgColor}
                        />
                    ))}
                </div>

                {/* Aktivitas Terbaru */}
                <div className="mt-8 px-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-bold text-gray-800 text-lg">Aktivitas Terbaru</h2>
                            <button className="text-xs text-gray-400 hover:text-gray-600">Histori barang</button>
                        </div>
                        
                        {/* Area Aktivitas (Nanti di-map dari database) */}
                        <div className="text-center py-10 text-gray-400 text-sm">
                            Belum ada aktivitas terbaru...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};