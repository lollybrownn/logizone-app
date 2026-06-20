import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Search, Clock, AlertTriangle } from "lucide-react";

export const MonitoringAging = () => {
    // State untuk filter tab dan pencarian
    const [activeTab, setActiveTab] = useState("All Stock");
    const [searchQuery, setSearchQuery] = useState("");

    // Data dummy untuk mempermudah penyambungan ke database nanti
    const dataStok = [
        { id: 1, resi: "RES-001", nama: "Electronic", zona: "A1", koli: 2, tglKeluar: "2026-06-23", status: "Aging" },
        { id: 2, resi: "RES-002", nama: "Furniture", zona: "B2", koli: 1, tglKeluar: "2026-06-19", status: "Overdue" },
        { id: 3, resi: "RES-003", nama: "Ayam Frozen", zona: "C1", koli: 5, tglKeluar: "2026-06-25", status: "Normal" },
    ];

    // Logika filter berdasarkan tab dan input pencarian
    const filteredData = dataStok.filter((item) => {
        const matchesTab = activeTab === "All Stock" ? true : item.status === activeTab;
        const matchesSearch = 
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.resi.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.zona.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const summary = [
        { label: "AGING (H-3)", count: dataStok.filter(i => i.status === "Aging").length, icon: <Clock className="text-orange-400" size={20} />, color: "border-orange-100" },
        { label: "OVERDUE", count: dataStok.filter(i => i.status === "Overdue").length, icon: <AlertTriangle className="text-red-400" size={20} />, color: "border-red-100" },
    ];

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden bg-[#F8F9FA]">
            <Sidebar />

            <div className="flex-1 h-screen overflow-y-auto p-10">
                <header className="mb-8">
                    <nav className="text-[11px] text-gray-400 mb-2 flex gap-1 items-center font-medium">
                        <span>Operasional</span> <span>&gt;</span> <span className="text-gray-400">Monitoring Aging Stock</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Monitoring Aging Stock</h1>
                    <p className="text-sm text-slate-500">Pantau barang yang sudah melewati batas keluar barang.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {summary.map((item, idx) => (
                        <div key={idx} className={`p-6 rounded-xl border ${item.color} flex items-center gap-4 bg-white shadow-sm`}>
                            <div className="bg-orange-50/50 p-3 rounded-lg">{item.icon}</div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{item.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                    <div className="p-4 border-b border-gray-50 flex flex-col gap-4">
                        <div className="flex gap-6">
                            {["All Stock", "Aging", "Overdue"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                                        ? (tab === "Aging" ? "bg-orange-100 text-orange-600" : tab === "Overdue" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")
                                        : "text-gray-400 hover:bg-gray-50"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Cari barang, resi, atau zona..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-lg py-2 pl-10 pr-4 text-[11px] outline-none focus:ring-1 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

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
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50">
                                        <td className="px-8 py-4 font-bold text-gray-900">{item.resi}</td>
                                        <td className="px-6 py-4 text-center">{item.nama}</td>
                                        <td className="px-6 py-4 text-center">{item.zona}</td>
                                        <td className="px-6 py-4 text-center">{item.koli}</td>
                                        <td className="px-6 py-4 text-center">{item.tglKeluar}</td>
                                        <td className="px-8 py-4 text-center">{item.status}</td>
                                    </tr>
                                ))
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