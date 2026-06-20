import { Sidebar } from "../../components/Sidebar";
import { Search } from "lucide-react";

export const PencarianBarang = () => {
    // Kosongkan data agar siap dihubungkan dengan database/API
    const hasilPencarian = [];

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden bg-[#F8F9FA]">
            <Sidebar />

            <div className="flex-1 h-screen overflow-y-auto p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header & Breadcrumb */}
                    <header className="mb-8">
                        <nav className="text-[11px] text-gray-400 mb-2 flex gap-1 items-center font-medium">
                            <span>Operasional</span>
                            <span>&gt;</span>
                            <span className="text-gray-400">Pencarian Barang</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pencarian Barang</h1>
                        <p className="text-sm text-slate-500">
                            Tetapkan zona untuk barang di gudang.
                        </p>
                    </header>

                    {/* Search Input Section */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95">
                                Cari
                            </button>
                        </div>
                    </div>

                    {/* Table Result Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[13px] text-gray-500 border-b border-gray-100">
                                    <th className="px-8 py-5 font-medium">SKU</th>
                                    <th className="px-6 py-5 font-medium">Nama</th>
                                    <th className="px-6 py-5 font-medium">Resi</th>
                                    <th className="px-6 py-5 font-medium">Zona</th>
                                    <th className="px-6 py-5 font-medium">Status</th>
                                    <th className="px-6 py-5 font-medium">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {hasilPencarian.length > 0 ? (
                                    /* Mapping database di sini nanti */
                                    hasilPencarian.map((item, index) => (
                                        <tr key={index}>
                                            {/* Isi tabel */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-24 text-center text-slate-400 text-sm font-medium">
                                            Masukkan ID Resi, SKU, atau Nama untuk mencari barang...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};