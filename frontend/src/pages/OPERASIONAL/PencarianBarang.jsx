import { Sidebar } from "../../components/Sidebar";
import { Search } from "lucide-react";

export const PencarianBarang = () => {
    // Data dikosongkan dulu sesuai instruksi
    const hasilPencarian = [];

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                {/* Header & Breadcrumb */}
                <header className="mb-8">
                    <nav className="text-[11px] text-gray-400 mb-2 flex gap-1 items-center font-medium">
                        <span>Operasional</span>
                        <span>&gt;</span>
                        <span className="text-gray-400">Pencarian Barang</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Pencarian Barang</h1>
                    <p className="text-sm text-slate-400">
                        Cari barang berdasarkan ID Resi atau nama barang
                    </p>
                </header>

                {/* Search Input Section */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input 
                                type="text" 
                                placeholder="ID Resi atau nama barang..." 
                                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-300"
                            />
                        </div>
                        <button className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95">
                            Cari
                        </button>
                    </div>
                </div>

                {/* Table Result Section */}
                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                <th className="px-8 py-5 font-medium">Resi</th>
                                <th className="px-6 py-5 font-medium text-center">Barang</th>
                                <th className="px-6 py-5 font-medium text-center">Jumlah Koli</th>
                                <th className="px-6 py-5 font-medium text-center">Status</th>
                                <th className="px-6 py-5 font-medium text-center">Tgl Masuk</th>
                                <th className="px-6 py-5 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {hasilPencarian.length > 0 ? (
                                // Data mapping nantinya di sini
                                null
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <p className="text-slate-400 text-sm font-medium">Mulai mencari...</p>
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