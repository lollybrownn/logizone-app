import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Download, TrendingUp, Package } from "lucide-react";
import { reportApi } from "../../api/reportApi";
import { useToast } from "../../context/ToastContext";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (value) =>
    value ? new Date(value).toLocaleString("id-ID", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";

function exportToCsv(filename, rows, headers) {
    const csvContent = [
        headers.map((h) => h.label).join(","),
        ...rows.map((row) => headers.map((h) => `"${String(row[h.key] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

export const Laporan = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState("pendapatan"); // 'pendapatan' | 'logistik'
    const [summary, setSummary] = useState(null);
    const [financial, setFinancial] = useState([]);
    const [logistic, setLogistic] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [summaryRes, financialRes, logisticRes] = await Promise.all([
                reportApi.summary(),
                reportApi.financial(),
                reportApi.logistic(),
            ]);
            setSummary(summaryRes.data);
            setFinancial(financialRes.data.financialSummary || []);
            setLogistic(logisticRes.data.activityLog || []);
        } catch (err) {
            toast.error(err.message || "Gagal memuat laporan");
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function handleExportPendapatan() {
        if (financial.length === 0) {
            toast.error("Tidak ada data pendapatan untuk diekspor");
            return;
        }
        exportToCsv("laporan-pendapatan.csv", financial, [
            { key: "tgl_keluar", label: "Tanggal" },
            { key: "label_barang", label: "Barang" },
            { key: "berat_barang", label: "Berat (kg)" },
            { key: "biaya_ekstra", label: "Biaya Tambahan" },
            { key: "total_biaya", label: "Total" },
        ]);
    }

    function handleExportLogistik() {
        if (logistic.length === 0) {
            toast.error("Tidak ada data logistik untuk diekspor");
            return;
        }
        exportToCsv("laporan-logistik.csv", logistic, [
            { key: "tanggal", label: "Tanggal" },
            { key: "aksi", label: "Aksi" },
            { key: "no_resi", label: "Barang" },
            { key: "keterangan", label: "Keterangan" },
        ]);
    }

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <nav className="text-[11px] text-gray-400 mb-2 font-medium">Owner &gt; Laporan</nav>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Laporan Owner</h1>
                        <p className="text-sm text-slate-400">Rekap logistik dan rekap pendapatan dari seluruh aktivitas gudang.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleExportPendapatan} className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
                            <Download size={14} /> Export Pendapatan
                        </button>
                        <button onClick={handleExportLogistik} className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
                            <Download size={14} /> Export Logistik
                        </button>
                    </div>
                </header>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-2">Total Pendapatan</p>
                            <h3 className="text-3xl font-bold mb-1">{formatRupiah(summary?.totalIncome)}</h3>
                            <p className="text-xs opacity-70">Dari {summary?.totalProcessedItems || 0} transaksi outbound</p>
                        </div>
                        <TrendingUp size={32} className="opacity-80" />
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Total Barang Diproses</p>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{summary?.totalProcessedItems || 0}</h3>
                            <p className="text-xs text-gray-400">Berdasarkan histori barang</p>
                        </div>
                        <Package size={32} className="text-gray-300" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab("pendapatan")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border ${activeTab === "pendapatan" ? "bg-white shadow-sm border-gray-200 text-gray-800" : "border-transparent text-gray-400"}`}
                    >
                        Rekap Pendapatan
                    </button>
                    <button
                        onClick={() => setActiveTab("logistik")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border ${activeTab === "logistik" ? "bg-white shadow-sm border-gray-200 text-gray-800" : "border-transparent text-gray-400"}`}
                    >
                        Laporan Logistik
                    </button>
                </div>

                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {activeTab === "pendapatan" ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                    <th className="px-8 py-5 font-medium">Tanggal</th>
                                    <th className="px-6 py-5 font-medium">Barang</th>
                                    <th className="px-6 py-5 font-medium text-center">Berat</th>
                                    <th className="px-6 py-5 font-medium text-center">Biaya Tambahan</th>
                                    <th className="px-6 py-5 font-medium text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {isLoading ? (
                                    <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400">Memuat data...</td></tr>
                                ) : financial.length > 0 ? (
                                    financial.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-50">
                                            <td className="px-8 py-4 text-gray-500">{formatDate(row.tgl_keluar)}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">{row.label_barang}</td>
                                            <td className="px-6 py-4 text-center text-gray-600">{row.berat_barang} kg</td>
                                            <td className="px-6 py-4 text-center text-gray-600">{formatRupiah(row.biaya_ekstra)}</td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-800">{formatRupiah(row.total_biaya)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">Tidak ada data pendapatan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                    <th className="px-8 py-5 font-medium">Tanggal</th>
                                    <th className="px-6 py-5 font-medium">Aksi</th>
                                    <th className="px-6 py-5 font-medium">Barang</th>
                                    <th className="px-6 py-5 font-medium">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px]">
                                {isLoading ? (
                                    <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400">Memuat data...</td></tr>
                                ) : logistic.length > 0 ? (
                                    logistic.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-50">
                                            <td className="px-8 py-4 text-gray-500">{formatDate(row.tanggal)}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{row.aksi}</td>
                                            <td className="px-6 py-4 text-gray-600">{row.no_resi}</td>
                                            <td className="px-6 py-4 text-gray-500">{row.keterangan}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">Tidak ada data logistik.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
