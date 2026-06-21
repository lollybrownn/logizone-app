import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Search, MapPin, CheckCircle2, X } from "lucide-react";
import { outboundApi } from "../../api/outboundApi";
import { useToast } from "../../context/ToastContext";

const formatDate = (value) =>
    value ? new Date(value).toLocaleString("id-ID", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

function ValidateModal({ item, onClose, onValidated }) {
    const toast = useToast();
    const [tipeKeluar, setTipeKeluar] = useState("Ambil di Gudang");
    const [beratBarang, setBeratBarang] = useState("");
    const [biayaEkstra, setBiayaEkstra] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const isDelivery = tipeKeluar === "Diantar";

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (isDelivery && (!beratBarang || Number(beratBarang) <= 0)) {
            setError("Berat barang harus lebih dari 0 untuk metode pengiriman (Diantar)");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await outboundApi.validate(item.id_barang, {
                tipeKeluar,
                beratBarang: beratBarang === "" ? 0 : Number(beratBarang),
                biayaEkstra: biayaEkstra === "" ? 0 : Number(biayaEkstra),
            });
            toast.success(`Barang berhasil divalidasi keluar - Total: ${formatRupiah(res.data.total_biaya)}`);
            onValidated();
        } catch (err) {
            setError(err.message || "Gagal memvalidasi barang keluar");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                        <CheckCircle2 size={18} /> Validasi Outbond
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-xs text-gray-400 mb-6">{item.no_resi} &middot; {item.label_barang}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase">Kategori Pengeluaran</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setTipeKeluar("Ambil di Gudang")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${tipeKeluar === "Ambil di Gudang" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200"}`}
                            >
                                Ambil di Gudang
                            </button>
                            <button
                                type="button"
                                onClick={() => setTipeKeluar("Diantar")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${tipeKeluar === "Diantar" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200"}`}
                            >
                                Diantar
                            </button>
                        </div>
                    </div>

                    {isDelivery && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Berat Barang Rill (kg)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={beratBarang}
                                onChange={(e) => setBeratBarang(e.target.value)}
                                placeholder="cth. 12.5"
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase">Biaya Tambahan (opsional)</label>
                        <input
                            type="number"
                            min="0"
                            value={biayaEkstra}
                            onChange={(e) => setBiayaEkstra(e.target.value)}
                            placeholder="0"
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2 text-xs font-bold text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                            BATAL
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-xs font-bold text-white bg-[#1D5ABF] rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-60">
                            {isSubmitting ? "MEMPROSES..." : "Validasi Keluar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const ValidasiOutbound = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState("siap"); // 'siap' | 'riwayat'
    const [search, setSearch] = useState("");
    const [readyItems, setReadyItems] = useState([]);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [readyRes, historyRes] = await Promise.all([outboundApi.ready(), outboundApi.history()]);
            setReadyItems(readyRes.data.items || []);
            setHistory(historyRes.data.items || []);
        } catch (err) {
            toast.error(err.message || "Gagal memuat data outbound");
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredReady = readyItems.filter((item) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return item.label_barang?.toLowerCase().includes(q) || item.no_resi?.toLowerCase().includes(q);
    });

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                <header className="mb-8">
                    <nav className="text-[11px] text-gray-400 mb-2 font-medium">Owner &gt; Laporan</nav>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Validasi Outbond</h1>
                    <p className="text-sm text-slate-400">Pilih barang yang siap keluar gudang dan validasi pengambilannya.</p>
                </header>

                {/* Tab Selector */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("siap")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-2 transition-all ${activeTab === "siap" ? "bg-white shadow-sm border-gray-200 text-gray-800" : "border-transparent text-gray-400"}`}
                    >
                        <MapPin size={14} /> Siap Keluar
                    </button>
                    <button
                        onClick={() => setActiveTab("riwayat")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-2 transition-all ${activeTab === "riwayat" ? "bg-white shadow-sm border-gray-200 text-gray-800" : "border-transparent text-gray-400"}`}
                    >
                        Riwayat Outbond
                    </button>
                </div>

                {activeTab === "siap" ? (
                    <>
                        {/* Search Bar */}
                        <div className="relative mb-6 max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari barang, resi, atau zona..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {isLoading ? (
                            <p className="text-sm text-gray-400">Memuat data...</p>
                        ) : filteredReady.length === 0 ? (
                            <p className="text-sm text-gray-400 italic py-10 text-center">Tidak ada barang yang siap keluar gudang.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredReady.map((item) => (
                                    <div key={item.id_barang} className="border border-gray-100 rounded-xl p-5 shadow-sm bg-white">
                                        <p className="font-bold text-gray-800">{item.label_barang}</p>
                                        <p className="text-xs text-gray-400 mb-3">{item.no_resi}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                                            <MapPin size={12} /> {item.kota_asal_barang} &rarr; {item.kota_tujuan_keluar}
                                        </div>
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="w-full bg-[#1D5ABF] hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                                        >
                                            <CheckCircle2 size={14} /> Outbond Validation
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                    <th className="px-8 py-5 font-medium">Barang</th>
                                    <th className="px-6 py-5 font-medium text-center">Kategori</th>
                                    <th className="px-6 py-5 font-medium text-center">Jumlah Koli</th>
                                    <th className="px-6 py-5 font-medium text-center">Berat</th>
                                    <th className="px-6 py-5 font-medium text-center">Biaya Tambahan</th>
                                    <th className="px-6 py-5 font-medium text-center">Tanggal Keluar</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {history.length > 0 ? (
                                    history.map((h) => (
                                        <tr key={h.id} className="border-t border-gray-50">
                                            <td className="px-8 py-4">
                                                <p className="font-bold text-gray-800">{h.label_barang}</p>
                                                <p className="text-xs text-gray-400">{h.no_resi}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded text-[11px] font-medium border ${h.tipe_keluar === "Diantar" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                                                    {h.tipe_keluar}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">{h.jumlah_koli}</td>
                                            <td className="px-6 py-4 text-center text-gray-600">{h.berat_barang} kg</td>
                                            <td className="px-6 py-4 text-center text-gray-600">{formatRupiah(h.biaya_ekstra)}</td>
                                            <td className="px-6 py-4 text-center text-gray-500">{formatDate(h.tgl_keluar)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">Belum ada riwayat outbound.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedItem && (
                    <ValidateModal
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                        onValidated={() => {
                            setSelectedItem(null);
                            loadData();
                        }}
                    />
                )}
            </div>
        </div>
    );
};
