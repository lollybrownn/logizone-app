import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Search } from "lucide-react";

export const PenentuanLokasi = () => {
    // State untuk tab: 'belum' atau 'sudah'
    const [activeTab, setActiveTab] = useState("belum");

    // Data dummy untuk zona (ZN-A)
    const zones = [
        { name: "ZN-A", capacity: "2/100", label: "Zona A - Umum", progress: 2 },
        { name: "ZN-A", capacity: "2/100", label: "Zona A - Umum", progress: 2 },
        { name: "ZN-A", capacity: "2/100", label: "Zona A - Umum", progress: 2 },
        { name: "ZN-A", capacity: "2/100", label: "Zona A - Umum", progress: 2 },
    ];

    // Data barang dikosongkan dulu untuk database nanti
    const dataBarang = [];

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Penentuan Lokasi Penyimpanan</h1>
                    <p className="text-sm text-blue-500 font-medium">Tetapkan zona untuk barang di gudang</p>
                </header>

                {/* Zona Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {zones.map((zone, idx) => (
                        <div key={idx} className="p-5 rounded-xl border border-gray-100 shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-gray-800">{zone.name}</span>
                                <span className="text-[10px] bg-gray-50 px-2 py-1 rounded text-gray-400 font-bold border border-gray-100">
                                    {zone.capacity}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase">{zone.label}</p>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                    className="bg-blue-600 h-1.5 rounded-full" 
                                    style={{ width: `${zone.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter & Search Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button 
                            onClick={() => setActiveTab("belum")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "belum" ? "bg-white shadow-sm text-gray-800" : "text-gray-400"
                            }`}
                        >
                            Belum Ditempatkan <span className="ml-2 opacity-50 font-normal">3</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab("sudah")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "sudah" ? "bg-white shadow-sm text-gray-800" : "text-gray-400"
                            }`}
                        >
                            Sudah Ditempatkan <span className="ml-2 opacity-50 font-normal">4</span>
                        </button>
                    </div>

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari barang, resi, atau zona..." 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                <th className="px-8 py-5 font-medium">Resi</th>
                                <th className="px-6 py-5 font-medium text-center">Nama Barang</th>
                                <th className="px-6 py-5 font-medium text-center">Jumlah Koli</th>
                                <th className="px-6 py-5 font-medium text-center">
                                    {activeTab === "belum" ? "Pilih Zona" : "Zona Saat Ini"}
                                </th>
                                <th className="px-6 py-5 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {dataBarang.length > 0 ? (
                                // Mapping data nantinya di sini
                                null
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">
                                        Data barang {activeTab === "belum" ? "yang belum ditempatkan" : "yang sudah ditempatkan"} kosong.
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