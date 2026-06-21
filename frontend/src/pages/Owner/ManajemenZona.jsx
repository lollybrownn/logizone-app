import { useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus, X } from "lucide-react";
import { useZones } from "../../context/ZoneContext";
import { useToast } from "../../context/ToastContext";
import { zoneApi } from "../../api/zoneApi";
import Pagination, { paginate } from "../../components/common/Pagination";

const PER_PAGE = 10;

const EMPTY_FORM = { kodeZona: "", namaZona: "", kapasitas: "", deskripsi: "" };

function ZonaModal({ zone, onClose, onSaved }) {
    const toast = useToast();
    const isEdit = Boolean(zone);
    const [form, setForm] = useState(
        isEdit
            ? { kodeZona: zone.kode_zona, namaZona: zone.nama_zona, kapasitas: zone.kapasitas, deskripsi: zone.deskripsi || "" }
            : EMPTY_FORM,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.kodeZona || !form.namaZona || !form.kapasitas) {
            setError("Kode, nama, dan kapasitas wajib diisi");
            return;
        }
        if (Number(form.kapasitas) <= 0) {
            setError("Kapasitas harus lebih dari 0");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = { ...form, kapasitas: Number(form.kapasitas) };
            if (isEdit) {
                await zoneApi.update(zone.id, payload);
                toast.success("Zona berhasil diperbarui");
            } else {
                await zoneApi.create(payload);
                toast.success("Zona berhasil dibuat");
            }
            onSaved();
        } catch (err) {
            setError(err.message || "Gagal menyimpan zona");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-lg font-bold text-gray-800">{isEdit ? "Edit Zona" : "Zona Baru"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Kode</label>
                            <input
                                type="text"
                                value={form.kodeZona}
                                onChange={(e) => update("kodeZona", e.target.value)}
                                placeholder="ZN-D"
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Kapasitas</label>
                            <input
                                type="number"
                                min="1"
                                value={form.kapasitas}
                                onChange={(e) => update("kapasitas", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase">Nama</label>
                        <input
                            type="text"
                            value={form.namaZona}
                            onChange={(e) => update("namaZona", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase">Deskripsi</label>
                        <input
                            type="text"
                            value={form.deskripsi}
                            onChange={(e) => update("deskripsi", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2 text-xs font-bold text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-xs font-bold text-white bg-[#1D5ABF] rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-60">
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const ManajemenZona = () => {
    const { zones, refresh } = useZones();
    const [modalState, setModalState] = useState(null); // null | 'new' | zone object
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(zones.length / PER_PAGE));
    const pageItems = useMemo(() => paginate(zones, page, PER_PAGE), [zones, page]);

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Manajemen Zona Gudang</h1>
                        <p className="text-sm text-blue-400">Tambah, ubah, dan hapus zona penyimpanan</p>
                    </div>
                    <button
                        onClick={() => setModalState("new")}
                        className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Plus size={16} /> Zona Baru
                    </button>
                </header>

                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                <th className="px-8 py-5 font-medium">Kode</th>
                                <th className="px-6 py-5 font-medium">Nama Zona</th>
                                <th className="px-6 py-5 font-medium">Deskripsi</th>
                                <th className="px-6 py-5 font-medium text-center">Kapasitas Koli</th>
                                <th className="px-6 py-5 font-medium text-center">Terisi</th>
                                <th className="px-6 py-5 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {pageItems.length > 0 ? (
                                pageItems.map((zone) => (
                                    <tr key={zone.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-8 py-5 font-bold text-blue-600">{zone.kode_zona}</td>
                                        <td className="px-6 py-5 text-gray-700">{zone.nama_zona}</td>
                                        <td className="px-6 py-5 text-gray-400">{zone.deskripsi || "-"}</td>
                                        <td className="px-6 py-5 text-center text-gray-600">{zone.kapasitas}</td>
                                        <td className="px-6 py-5 text-center text-gray-600">{zone.kapasitas_terisi}/{zone.kapasitas}</td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => setModalState(zone)} className="text-blue-600 font-semibold hover:underline">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">
                                        Belum ada zona terdaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={zones.length}
                        perPage={PER_PAGE}
                        onPageChange={setPage}
                    />
                </div>

                {modalState && (
                    <ZonaModal
                        zone={modalState === "new" ? null : modalState}
                        onClose={() => setModalState(null)}
                        onSaved={() => {
                            setModalState(null);
                            refresh();
                        }}
                    />
                )}
            </div>
        </div>
    );
};
