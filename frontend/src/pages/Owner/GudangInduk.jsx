import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus, X } from "lucide-react";
import { warehouseApi } from "../../api/warehouseApi";
import { useToast } from "../../context/ToastContext";
import Pagination, { paginate } from "../../components/common/Pagination";

const PER_PAGE = 10;

const EMPTY_FORM = { name: "", code: "", contact: "", address: "" };

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-";

function WarehouseModal({ warehouse, onClose, onSaved }) {
    const toast = useToast();
    const isEdit = Boolean(warehouse);
    const [form, setForm] = useState(
        isEdit
            ? { name: warehouse.nama, code: warehouse.kode, contact: warehouse.kontak, address: warehouse.alamat || "" }
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

        if (!form.name || !form.code || !form.contact || !form.address) {
            setError("Semua kolom wajib diisi");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await warehouseApi.update(warehouse.id, form);
                toast.success("Gudang induk berhasil diperbarui");
            } else {
                await warehouseApi.create(form);
                toast.success("Gudang induk berhasil ditambahkan");
            }
            onSaved();
        } catch (err) {
            setError(err.message || "Gagal menyimpan gudang induk");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
                <div className="flex justify-between items-start mb-1">
                    <h2 className="text-lg font-bold text-gray-800">{isEdit ? "Edit Gudang Induk" : "Tambah Gudang Induk"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-xs text-gray-400 mb-6">Isi informasi gudang induk yang bekerja sama</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase">Nama Gudang Induk</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Kode</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => update("code", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Kontak</label>
                            <input
                                type="text"
                                value={form.contact}
                                onChange={(e) => update("contact", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase">Alamat</label>
                        <textarea
                            value={form.address}
                            onChange={(e) => update("address", e.target.value)}
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2 text-xs font-bold text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                            BATAL
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

export const GudangInduk = () => {
    const toast = useToast();
    const [warehouses, setWarehouses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState(null);
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(warehouses.length / PER_PAGE));
    const pageItems = useMemo(() => paginate(warehouses, page, PER_PAGE), [warehouses, page]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await warehouseApi.list();
            setWarehouses(res.data.warehouseList || []);
        } catch (err) {
            toast.error(err.message || "Gagal memuat data gudang induk");
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <nav className="text-[11px] text-gray-400 mb-2 font-medium">Owner &gt; Gudang Induk</nav>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Konfigurasi Gudang Induk</h1>
                        <p className="text-sm text-slate-400">Kelola daftar gudang induk yang bekerja sama.</p>
                    </div>
                    <button
                        onClick={() => setModalState("new")}
                        className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Plus size={16} /> Gudang Baru
                    </button>
                </header>

                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                <th className="px-8 py-5 font-medium">Nama Gudang</th>
                                <th className="px-6 py-5 font-medium">Kode</th>
                                <th className="px-6 py-5 font-medium">Kontak</th>
                                <th className="px-6 py-5 font-medium">Terdaftar</th>
                                <th className="px-6 py-5 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400">Memuat data...</td></tr>
                            ) : pageItems.length > 0 ? (
                                pageItems.map((w) => (
                                    <tr key={w.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-8 py-5 font-bold text-gray-800">{w.nama}</td>
                                        <td className="px-6 py-5 text-gray-500">{w.kode}</td>
                                        <td className="px-6 py-5">
                                            {w.kontak?.includes("@") ? (
                                                <a href={`mailto:${w.kontak}`} className="text-blue-600 underline">{w.kontak}</a>
                                            ) : (
                                                <span className="text-gray-600">{w.kontak}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-gray-500">{formatDate(w.created_at)}</td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => setModalState(w)} className="text-blue-600 font-semibold hover:underline">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">Belum ada gudang induk terdaftar.</td></tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={warehouses.length}
                        perPage={PER_PAGE}
                        onPageChange={setPage}
                    />
                </div>

                {modalState && (
                    <WarehouseModal
                        warehouse={modalState === "new" ? null : modalState}
                        onClose={() => setModalState(null)}
                        onSaved={() => {
                            setModalState(null);
                            loadData();
                        }}
                    />
                )}
            </div>
        </div>
    );
};
