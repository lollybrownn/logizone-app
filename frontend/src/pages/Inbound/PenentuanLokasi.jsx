import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Search } from "lucide-react";
import { useZones } from "../../context/ZoneContext";
import { useToast } from "../../context/ToastContext";
import { barangApi } from "../../api/barangApi";
import { placementApi } from "../../api/placementApi";

export const PenentuanLokasi = () => {
    const toast = useToast();
    const { zones, refresh: refreshZones } = useZones();

    const [activeTab, setActiveTab] = useState("belum"); // 'belum' | 'sudah'
    const [search, setSearch] = useState("");

    const [unplaced, setUnplaced] = useState([]);
    const [placed, setPlaced] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState({}); // { [id_barang]: id_zona }
    const [submittingId, setSubmittingId] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [unplacedRes, placedRes] = await Promise.all([
                barangApi.unplaced(),
                barangApi.list({ status: "Stored", per_page: 100 }),
            ]);
            setUnplaced(unplacedRes.data.barang || []);
            setPlaced(placedRes.data.barang || []);
        } catch (err) {
            toast.error(err.message || "Gagal memuat data penempatan");
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredUnplaced = useMemo(() => {
        if (!search) return unplaced;
        const q = search.toLowerCase();
        return unplaced.filter(
            (b) => b.label_barang?.toLowerCase().includes(q) || b.no_resi?.toLowerCase().includes(q),
        );
    }, [unplaced, search]);

    const filteredPlaced = useMemo(() => {
        if (!search) return placed;
        const q = search.toLowerCase();
        return placed.filter(
            (b) =>
                b.label_barang?.toLowerCase().includes(q) ||
                b.no_resi?.toLowerCase().includes(q) ||
                b.nama_zona?.toLowerCase().includes(q),
        );
    }, [placed, search]);

    async function handleAssign(idBarang) {
        const idZona = selectedZone[idBarang];
        if (!idZona) {
            toast.error("Pilih zona terlebih dahulu");
            return;
        }
        setSubmittingId(idBarang);
        try {
            await placementApi.assign(idBarang, Number(idZona));
            toast.success("Barang berhasil ditempatkan ke zona");
            await Promise.all([loadData(), refreshZones()]);
        } catch (err) {
            toast.error(err.message || "Gagal menempatkan barang");
        } finally {
            setSubmittingId(null);
        }
    }

    async function handleMove(idBarang) {
        const idZona = selectedZone[idBarang];
        if (!idZona) {
            toast.error("Pilih zona tujuan terlebih dahulu");
            return;
        }
        setSubmittingId(idBarang);
        try {
            await placementApi.move(idBarang, Number(idZona));
            toast.success("Lokasi barang berhasil diperbarui");
            await Promise.all([loadData(), refreshZones()]);
        } catch (err) {
            toast.error(err.message || "Gagal memindahkan barang");
        } finally {
            setSubmittingId(null);
        }
    }

    const rows = activeTab === "belum" ? filteredUnplaced : filteredPlaced;

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
                    {zones.map((zone) => {
                        const progress = zone.kapasitas > 0 ? Math.round((zone.kapasitas_terisi / zone.kapasitas) * 100) : 0;
                        return (
                            <div key={zone.id} className="p-5 rounded-xl border border-gray-100 shadow-sm bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-gray-800">{zone.kode_zona}</span>
                                    <span className="text-[10px] bg-gray-50 px-2 py-1 rounded text-gray-400 font-bold border border-gray-100">
                                        {zone.kapasitas_terisi}/{zone.kapasitas}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase">{zone.nama_zona}</p>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filter & Search Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button
                            onClick={() => setActiveTab("belum")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "belum" ? "bg-white shadow-sm text-gray-800" : "text-gray-400"
                                }`}
                        >
                            Belum Ditempatkan <span className="ml-2 opacity-50 font-normal">{unplaced.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("sudah")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "sudah" ? "bg-white shadow-sm text-gray-800" : "text-gray-400"
                                }`}
                        >
                            Sudah Ditempatkan <span className="ml-2 opacity-50 font-normal">{placed.length}</span>
                        </button>
                    </div>

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400">Memuat data...</td>
                                </tr>
                            ) : rows.length > 0 ? (
                                rows.map((item) => (
                                    <tr key={item.id_barang} className="border-t border-gray-50">
                                        <td className="px-8 py-4 font-bold text-gray-900">{item.no_resi}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{item.label_barang}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{item.jumlah_koli}</td>
                                        <td className="px-6 py-4 text-center">
                                            {activeTab === "sudah" && (
                                                <span className="text-xs text-gray-500 mr-2">{item.nama_zona}</span>
                                            )}
                                            <select
                                                value={selectedZone[item.id_barang] || ""}
                                                onChange={(e) =>
                                                    setSelectedZone((prev) => ({ ...prev, [item.id_barang]: e.target.value }))
                                                }
                                                className="bg-gray-50 border border-gray-100 rounded-lg h-9 px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="">Pilih Zona</option>
                                                {zones.map((z) => (
                                                    <option key={z.id} value={z.id}>
                                                        {z.kode_zona} ({z.kapasitas - z.kapasitas_terisi} koli kosong)
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    activeTab === "belum" ? handleAssign(item.id_barang) : handleMove(item.id_barang)
                                                }
                                                disabled={submittingId === item.id_barang}
                                                className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-60"
                                            >
                                                {submittingId === item.id_barang
                                                    ? "..."
                                                    : activeTab === "belum" ? "Tetapkan" : "Perbarui"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
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
