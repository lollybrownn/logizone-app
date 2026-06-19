import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus, PackageSearch } from "lucide-react";
import { ModalTambahBarang } from "../../components/ModalTambahBarang";

export const PendataanBarang = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Data dikosongkan dulu untuk integrasi database nanti
    const dataBarang = [];

    // Helper warna status sesuai gambar baru (hijau untuk completed, kuning untuk pending)
    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Pending": return "bg-orange-50 text-orange-500 border-orange-100";
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
                                {dataBarang.length > 0 ? (
                                    dataBarang.map((item, index) => (
                                        <tr key={index} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-900">{item.resi}</td>
                                            <td className="px-6 py-5 text-gray-600">{item.barang}</td>
                                            <td className="px-6 py-5 text-center text-gray-600">{item.jumlah}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded text-[12px] font-medium border ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center text-gray-500">{item.tgl}</td>
                                            <td className="px-6 py-5 text-center">
                                                <button className="text-blue-600 hover:underline font-medium">Edit</button>
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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};