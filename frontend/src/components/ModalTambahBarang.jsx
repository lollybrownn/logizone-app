import { useEffect, useState } from "react";
import { X, Package, Truck, MapPin, Users, CalendarDays, Wallet } from "lucide-react";
import { warehouseApi } from "../api/warehouseApi";
import { barangApi } from "../api/barangApi";
import { useToast } from "../context/ToastContext";

const EMPTY_FORM = {
    label_barang: "",
    jumlah_koli: 1,
    no_resi: "",
    id_gudang_induk: "",
    kota_asal_barang: "",
    kota_tujuan_keluar: "",
    nama_pengirim: "",
    no_telp_pengirim: "",
    nama_penerima: "",
    no_telp_penerima: "",
    tgl_masuk: new Date().toISOString().slice(0, 10),
    estimasi_tgl_keluar: "",
    biaya: "",
};

export const ModalTambahBarang = ({ isOpen, onClose, onCreated }) => {
    const toast = useToast();
    const [warehouses, setWarehouses] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setForm(EMPTY_FORM);
        setError("");
        warehouseApi
            .list()
            .then((res) => setWarehouses(res.data.warehouseList))
            .catch((err) => toast.error(err.message || "Gagal memuat daftar gudang induk"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await barangApi.create({
                ...form,
                jumlah_koli: Number(form.jumlah_koli),
                biaya: form.biaya === "" ? 0 : Number(form.biaya),
                id_gudang_induk: Number(form.id_gudang_induk),
            });
            toast.success("Barang berhasil didata");
            onCreated?.();
            onClose();
        } catch (err) {
            setError(err.message || "Gagal menyimpan data barang");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                <div className="p-8 pb-4 relative flex-none">
                    <button type="button" onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">Data Barang Baru</h2>
                    <p className="text-sm text-gray-400">Isi detail barang</p>
                </div>

                <div className="p-8 pt-0 overflow-y-auto flex-1 custom-scrollbar">
                    <form id="form-tambah-barang" className="flex flex-col gap-8" onSubmit={handleSubmit}>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* 1. Identitas Barang */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Package size={18} /> <span>Identitas Barang</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Label Barang"
                                    placeholder="Input label"
                                    value={form.label_barang}
                                    onChange={(e) => update("label_barang", e.target.value)}
                                    required
                                />
                                <InputGroup
                                    label="Jumlah Koli"
                                    type="number"
                                    min="1"
                                    value={form.jumlah_koli}
                                    onChange={(e) => update("jumlah_koli", e.target.value)}
                                    required
                                />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 2. Resi & Gudang Induk */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Truck size={18} /> <span>Resi & Gudang Induk</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Nomor Resi"
                                    placeholder="Input resi"
                                    value={form.no_resi}
                                    onChange={(e) => update("no_resi", e.target.value)}
                                    required
                                />
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase">Gudang Induk</label>
                                    <select
                                        value={form.id_gudang_induk}
                                        onChange={(e) => update("id_gudang_induk", e.target.value)}
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        <option value="">Pilih Gudang induk</option>
                                        {warehouses.map((w) => (
                                            <option key={w.id} value={w.id}>{w.nama}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 3. Rute Pengiriman */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <MapPin size={18} /> <span>Rute Pengiriman</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Kota Asal Barang Datang"
                                    placeholder="Input kota asal"
                                    value={form.kota_asal_barang}
                                    onChange={(e) => update("kota_asal_barang", e.target.value)}
                                    required
                                />
                                <InputGroup
                                    label="Kota Tujuan Barang Keluar"
                                    placeholder="Input kota tujuan"
                                    value={form.kota_tujuan_keluar}
                                    onChange={(e) => update("kota_tujuan_keluar", e.target.value)}
                                    required
                                />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 4. Pengirim & Penerima */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Users size={18} /> <span>Pengirim & Penerima</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                <InputGroup label="Nama Pengirim" placeholder="Input nama pengirim" value={form.nama_pengirim} onChange={(e) => update("nama_pengirim", e.target.value)} required />
                                <InputGroup label="No. Telepon Pengirim" placeholder="Input no. telp" value={form.no_telp_pengirim} onChange={(e) => update("no_telp_pengirim", e.target.value)} required />
                                <InputGroup label="Nama Penerima" placeholder="Input nama penerima" value={form.nama_penerima} onChange={(e) => update("nama_penerima", e.target.value)} required />
                                <InputGroup label="No. Telepon Penerima" placeholder="Input no. telp" value={form.no_telp_penerima} onChange={(e) => update("no_telp_penerima", e.target.value)} required />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 5. Tanggal Masuk & Keluar */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <CalendarDays size={18} /> <span>Tanggal Masuk & Keluar</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Tanggal Masuk"
                                    type="date"
                                    value={form.tgl_masuk}
                                    onChange={(e) => update("tgl_masuk", e.target.value)}
                                />
                                <InputGroup
                                    label="Estimasi Tanggal Keluar"
                                    type="date"
                                    value={form.estimasi_tgl_keluar}
                                    onChange={(e) => update("estimasi_tgl_keluar", e.target.value)}
                                    required
                                />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 6. Biaya */}
                        <section className="mb-4">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-2 uppercase tracking-wide">
                                <Wallet size={18} /> <span>Biaya</span>
                            </div>
                            <InputGroup
                                type="number"
                                min="0"
                                placeholder="Masukkan biaya"
                                value={form.biaya}
                                onChange={(e) => update("biaya", e.target.value)}
                            />
                        </section>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-50 flex justify-end gap-3 flex-none bg-white rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2 text-xs font-bold text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        BATAL
                    </button>
                    <button
                        type="submit"
                        form="form-tambah-barang"
                        disabled={isSubmitting}
                        className="px-6 py-2 text-xs font-bold text-white bg-[#1D5ABF] rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-60"
                    >
                        {isSubmitting ? "MENYIMPAN..." : "Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, ...props }) => (
    <div className="flex flex-col gap-2">
        {label && <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">{label}</label>}
        <input
            {...props}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
        />
    </div>
);
