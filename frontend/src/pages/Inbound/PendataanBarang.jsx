import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus, PackageSearch } from "lucide-react";
import { ModalTambahBarang } from "../../components/ModalTambahBarang";
import { barangApi } from "../../api/barangApi";
import { useToast } from "../../context/ToastContext";

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "numeric", year: "numeric" }) : "-";

export const PendataanBarang = () => {
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataBarang, setDataBarang] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await barangApi.list({ per_page: 50 });
            setDataBarang(res.data.barang || []);
        } catch (err) {
            toast.error(err.message || "Gagal memuat data barang");
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Helper warna status sesuai gambar baru (hijau untuk completed, kuning untuk pending)
    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Stored": return "bg-blue-50 text-blue-600 border-blue-100";
            case "Picked Up": return "bg-cyan-50 text-cyan-600 border-cyan-100";
            case "Pending": return "bg-orange-50 text-orange-500 border-orange-100";
            case "Registered": return "bg-purple-50 text-purple-500 border-purple-100";
            default: return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pendataan Barang</h1>
                        <p className="text-sm text-slate-400">
                            Catat barang yang masuk setelah resi diterima
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Plus size={16} />
                        Barang Baru
                    </button>
                </div>

                {/* Table Section */}
                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[13px] text-gray-500">
                                    <th className="px-8 py-6 font-medium">Resi</th>
                                    <th className="px-6 py-6 font-medium">Barang</th>
                                    <th className="px-6 py-6 font-medium text-center">Jumlah Koli</th>
                                    <th className="px-6 py-6 font-medium text-center">Status</th>
                                    <th className="px-6 py-6 font-medium text-center">Tgl Masuk</th>
                                    <th className="px-6 py-6 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-24 text-center text-slate-400">
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : dataBarang.length > 0 ? (
                                    dataBarang.map((item) => (
                                        <tr key={item.id_barang} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-900">{item.no_resi}</td>
                                            <td className="px-6 py-5 text-gray-600">{item.label_barang}</td>
                                            <td className="px-6 py-5 text-center text-gray-600">{item.jumlah_koli}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded text-[12px] font-medium border ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center text-gray-500">{formatDate(item.tgl_masuk)}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-gray-300 text-xs">{item.nama_zona || "Belum ditempatkan"}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    /* Tampilan saat data kosong */
                                    <tr>
                                        <td colSpan="6" className="px-6 py-24 text-center border-t border-gray-50">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="bg-slate-50 p-4 rounded-full">
                                                    <PackageSearch size={40} className="text-slate-300" />
                                                </div>
                                                <div className="text-slate-400">
                                                    <p className="font-semibold text-gray-600">Belum ada barang tercatat</p>
                                                    <p className="text-xs">Klik tombol 'Barang Baru' untuk memulai pendataan.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <ModalTambahBarang
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onCreated={loadData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
