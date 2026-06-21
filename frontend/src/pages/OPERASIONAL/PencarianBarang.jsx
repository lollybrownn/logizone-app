import { useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Search } from "lucide-react";
import { barangApi } from "../../api/barangApi";
import { useToast } from "../../context/ToastContext";
import Pagination, { paginate } from "../../components/common/Pagination";

const PER_PAGE = 10;

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "numeric", year: "numeric" }) : "-";

const getStatusStyle = (status) => {
    switch (status) {
        case "Completed": return "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
        case "Stored": return "bg-blue-50 text-blue-800 border-blue-200 font-bold";
        case "Picked Up": return "bg-cyan-50 text-cyan-800 border-cyan-200 font-bold";
        case "Pending": return "bg-orange-50 text-orange-800 border-orange-200 font-bold";
        case "Registered": return "bg-purple-50 text-purple-800 border-purple-200 font-bold";
        default: return "bg-gray-100 text-gray-900 border-gray-300 font-bold";
    }
};

export const PencarianBarang = () => {
    const toast = useToast();
    const [keyword, setKeyword] = useState("");
    const [hasilPencarian, setHasilPencarian] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(hasilPencarian.length / PER_PAGE));
    const pageItems = useMemo(() => paginate(hasilPencarian, page, PER_PAGE), [hasilPencarian, page]);

    async function handleSearch(e) {
        e.preventDefault();
        if (!keyword.trim()) {
            toast.error("Silakan masukkan kata kunci pencarian (Nama atau ID Barang)");
            return;
        }
        setIsLoading(true);
        try {
            const res = await barangApi.list({ search: keyword.trim(), per_page: 100 });
            setHasilPencarian(res.data.barang || []);
            setHasSearched(true);
            setPage(1);
        } catch (err) {
            toast.error(err.message || "Gagal melakukan pencarian");
        } finally {
            setIsLoading(false);
        }
    }

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
                <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="ID Resi atau nama barang..."
                                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-60"
                        >
                            {isLoading ? "Mencari..." : "Cari"}
                        </button>
                    </div>
                </form>

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
                                <th className="px-6 py-5 font-medium text-center">Zona</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {pageItems.length > 0 ? (
                                pageItems.map((item) => (
                                    <tr key={item.id_barang} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 font-bold text-gray-900">{item.no_resi}</td>
                                        <td className="px-6 py-5 text-center text-gray-600">{item.label_barang}</td>
                                        <td className="px-6 py-5 text-center text-gray-600">{item.jumlah_koli}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded text-[12px] font-medium border ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center text-gray-500">{formatDate(item.tgl_masuk)}</td>
                                        <td className="px-6 py-5 text-center text-gray-500">{item.nama_zona || "-"}</td>
                                    </tr>
                                ))
                            ) : hasSearched ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <p className="text-slate-400 text-sm font-medium">Barang tidak ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <p className="text-slate-400 text-sm font-medium">Mulai mencari...</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={hasilPencarian.length}
                        perPage={PER_PAGE}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </div>
    );
};
