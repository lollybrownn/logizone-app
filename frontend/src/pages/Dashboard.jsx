import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { FileText, Box, MapPin, Truck, AlertTriangle, Activity } from "lucide-react";

const DashboardCard = ({ title, value, subtitle, icon, iconBgColor }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-md">
            <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {title}
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {value}
                </h3>
                <p className="text-gray-400 text-sm">
                    {subtitle}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${iconBgColor}`}>
                {icon}
            </div>
        </div>
    );
};

const DashboardContent = ({ children }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-3 px-4">
            {children}
        </div>
    );
};

export const Dashboard = () => {
    // Bagian ini tetap jadi komentar sesuai permintaanmu
    // const [user, setUser] = useState({ username: "", role: "" });

    // useEffect(() => {
    //     // Ambil data user dari localStorage saat halaman dibuka
    //     const savedUser = localStorage.getItem("user");
    //     if (savedUser) {
    //         setUser(JSON.parse(savedUser));
    //     }
    // }, []);

    const stats = [
        { title: "Total Resi", value: "4", subtitle: "Resi terdaftar", icon: <FileText size={20} className="text-blue-600" />, iconBgColor: "bg-blue-50" },
        { title: "Total Barang", value: "10", subtitle: "4 zona aktif", icon: <Box size={20} className="text-cyan-500" />, iconBgColor: "bg-cyan-50" },
        { title: "Belum Berlokasi", value: "2", subtitle: "Menunggu penempatan", icon: <MapPin size={20} className="text-orange-400" />, iconBgColor: "bg-orange-50" },
        { title: "Transaksi Outbound", value: "4", subtitle: "Total semua waktu", icon: <Truck size={20} className="text-green-500" />, iconBgColor: "bg-green-50" },
        { title: "Aging / Overdue", value: "1", subtitle: "Stok menua", icon: <AlertTriangle size={20} className="text-orange-500" />, iconBgColor: "bg-orange-100/50" },
        { title: "Aktivitas", value: "8", subtitle: "Log terbaru", icon: <Activity size={20} className="text-indigo-500" />, iconBgColor: "bg-indigo-50" },
    ];

    return (
        <div className="flex flex-row min-h-screen bg-[#F8F9FA]">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-6">
                <div className="p-4 mb-2">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Halo, owner 👋
                    </h1>
                    <p className="text-sm text-slate-500">
                        Anda login sebagai Owner. Berikut ringkasan operasi gudang hari ini.
                    </p>
                </div>

                <DashboardContent>
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
                </DashboardContent>

                {/* Bagian Aktivitas Terbaru */}
                <div className="mt-8 px-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-bold text-gray-800 text-lg">Aktivitas Terbaru</h2>
                            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Histori barang</button>
                        </div>

                        {/* Contoh list aktivitas agar mirip screenshot kedua */}
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Pindah Lokasi</p>
                                        <p className="text-xs text-gray-400">Dari zona ZN-A ke zona ZN-C</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">30/4/2026, 20.06.45</p>
                            </div>
                            {/* Tambahkan item lainnya di sini... */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}