import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Search, Clock, AlertTriangle } from "lucide-react";

export const MonitoringAging = () => {
    // State untuk filter tab sesuai gambar (All Stock, Aging, Overdue)
    const [activeTab, setActiveTab] = useState("All Stock");

    // Ringkasan status di bagian atas sesuai referensi
    const summary = [
        { label: "AGING (H-3)", count: 1, icon: <Clock className="text-orange-400" size={20} />, color: "border-orange-100" },
        { label: "OVERDUE", count: 1, icon: <AlertTriangle className="text-red-400" size={20} />, color: "border-red-100" },
    ];

    // Data dikosongkan sesuai permintaan
    const dataStok = [];

    return (
        <div className="flex flex-row min-h-screen bg-white">
            {/* Sidebar di sisi kiri */}
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Monitoring Aging Stock</h1>
                    <p className="text-sm text-blue-400">Pantau barang yang sudah melewati batas keluar barang</p>
                </header>

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {summary.map((item, idx) => (
                        <div key={idx} className={`p-6 rounded-xl border ${item.color} flex items-center gap-4 bg-white shadow-sm`}>
                            <div className="bg-orange-50/50 p-3 rounded-lg">
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Container dengan Tab dan Search */}
                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                    <div className="p-4 border-b border-gray-50 flex flex-col gap-4">
                        {/* Tab Switcher sesuai referensi visual */}
                        <div className="flex gap-6">
                            {["All Stock", "Aging", "Overdue"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                        activeTab === tab 
                                        ? (tab === "Aging" ? "bg-orange-100 text-orange-600" : tab === "Overdue" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")
                                        : "text-gray-400 hover:bg-gray-50"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Cari barang, resi, atau zona..." 
                                className="w-full bg-white border border-gray-100 rounded-lg py-2 pl-10 pr-4 text-[11px] outline-none focus:ring-1 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {/* Content Table */}
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[12px] text-gray-500 bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-4 font-medium">Resi</th>
                                <th className="px-6 py-4 font-medium text-center">Nama Barang</th>
                                <th className="px-6 py-4 font-medium text-center">Zona</th>
                                <th className="px-6 py-4 font-medium text-center">Jumlah Koli</th>
                                <th className="px-6 py-4 font-medium text-center">Estimasi Tgl Keluar</th>
                                <th className="px-8 py-4 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            {dataStok.length > 0 ? (
                                null // Mapping data di sini nanti
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <p className="text-gray-400 italic text-sm">Tidak ada data untuk kategori {activeTab}.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};