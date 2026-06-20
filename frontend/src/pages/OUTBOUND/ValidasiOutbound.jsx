import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { CheckCircle2, Search, MapPin } from "lucide-react";
import { ModalDetailBarang } from "../../components/ModalDetailBarang";

const ValidationModal = ({ onClose, onOpenDetail }) => {
    const [kategori, setKategori] = useState("Antar ke luar Kota");

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <CheckCircle2 size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Validasi Outbond</h2>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">Electronic</p>
                        <span onClick={onOpenDetail} className="text-blue-500 cursor-pointer font-bold">ⓘ</span>
                    </div>
                    <p className="text-xs text-gray-400">RSI - 119</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Kategori Pengambilan</label>
                        <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none">
                            <option value="Antar ke luar Kota">Antar ke luar Kota</option>
                            <option value="Ambil di Gudang">Ambil di Gudang</option>
                        </select>
                    </div>
                    {kategori === "Antar ke luar Kota" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Berat Barang (Kg)</label>
                                <input type="number" className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Biaya Total (Rp)</label>
                                <input type="number" className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder="Masukkan biaya" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-6 py-2.5 font-bold text-sm text-gray-600">BATAL</button>
                    <button className="px-6 py-2.5 font-bold text-sm bg-[#1D5ABF] text-white rounded-lg">Validasi</button>
                </div>
            </div>
        </div>
    );
};

export const ValidasiOutbound = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [activeTab, setActiveTab] = useState("Siap Keluar");
    const [searchQuery, setSearchQuery] = useState("");

    const dataDummy = [
        { id: 1, nama: "Ayam", resi: "002" },
        { id: 2, nama: "Elektronik", resi: "119" }
    ];

    const filteredData = dataDummy.filter((item) => 
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.resi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden bg-[#F8F9FA]">
            <Sidebar />
            <div className="flex-1 h-screen overflow-y-auto p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header & Breadcrumb */}
                    <header className="mb-8">
                        <nav className="text-[11px] text-gray-400 mb-2 flex gap-1 items-center font-medium">
                            <span>Outbound</span> <span>&gt;</span> <span className="text-gray-400">Validasi Outbound</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Validasi Outbound</h1>
                        <p className="text-sm text-slate-500">Pilih barang yang siap keluar dan validasi pengambilannya.</p>
                    </header>

                    {/* Filter Tab & Search */}
                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex gap-2">
                            {["Siap Keluar", "Riwayat"].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border ${
                                        activeTab === tab 
                                            ? "bg-white border-gray-200 text-gray-900 shadow-sm" 
                                            : "border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    {tab} Outbound <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">7</span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative flex-1 max-w-sm ml-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Cari resi, nama barang, gudang induk..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" 
                            />
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{item.nama}</h3>
                                        <p className="text-xs text-gray-400">{item.resi}</p>
                                    </div>
                                    {/* Rute kembali ditambahkan */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>Jakarta → Surabaya</span>
                                    </div>
                                    <button onClick={() => setShowModal(true)} className="w-full flex items-center justify-center gap-2 bg-[#1D5ABF] text-white py-2.5 rounded-lg font-semibold text-sm transition-all">
                                        <CheckCircle2 size={18} /> Outbond Validation
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm italic">Data tidak ditemukan.</p>
                        )}
                    </div>
                </div>
            </div>

            {showModal && <ValidationModal onClose={() => setShowModal(false)} onOpenDetail={() => setShowDetail(true)} />}
            <ModalDetailBarang isOpen={showDetail} onClose={() => setShowDetail(false)} />
        </div>
    );
};