import { X, Package, Truck, MapPin, Users, CalendarDays, Wallet } from "lucide-react";

export const ModalTambahBarang = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            {/* Kontainer Modal dengan ukuran tetap dan scroll internal */}
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header (Sticky agar tetap terlihat saat scroll) */}
                <div className="p-8 pb-4 relative flex-none">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">Data Barang Baru</h2>
                    <p className="text-sm text-gray-400">Isi detail barang</p>
                </div>

                {/* Body (Bagian yang bisa di-scroll) */}
                <div className="p-8 pt-0 overflow-y-auto flex-1 custom-scrollbar">
                    <form className="flex flex-col gap-8">
                        
                        {/* 1. Identitas Barang */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Package size={18} /> <span>Identitas Barang</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Label Barang" placeholder="Input label" />
                                <InputGroup label="Jumlah Koli" type="number" defaultValue="1" />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 2. Resi & Gudang Induk */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Truck size={18} /> <span>Resi & Gudang Induk</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Nomor Resi" placeholder="Input resi" />
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase">Gudang Induk</label>
                                    <select className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                        <option>Pilih Gudang induk</option>
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
                                <InputGroup label="Kota Asal Barang Datang" placeholder="Input kota asal" />
                                <InputGroup label="Kota Tujuan Barang Keluar" placeholder="Input kota tujuan" />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 4. Pengirim & Penerima */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Users size={18} /> <span>Pengirim & Penerima</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                <InputGroup label="Nama Pengirim" placeholder="Input nama pengirim" />
                                <InputGroup label="No. Telepon Pengirim" placeholder="Input no. telp" />
                                <InputGroup label="Nama Penerima" placeholder="Input nama penerima" />
                                <InputGroup label="No. Telepon Penerima" placeholder="Input no. telp" />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 5. Tanggal Masuk & Keluar */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <CalendarDays size={18} /> <span>Tanggal Masuk & Keluar</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Tanggal Masuk" type="date" defaultValue="2026-04-24" />
                                <InputGroup label="Tanggal Keluar" type="date" />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 6. Biaya */}
                        <section className="mb-4">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-2 uppercase tracking-wide">
                                <span>Biaya</span>
                            </div>
                            <InputGroup label="" placeholder="Masukkan biaya" />
                        </section>
                    </form>
                </div>

                {/* Footer (Sticky di bawah) */}
                <div className="p-6 border-t border-gray-50 flex justify-end gap-3 flex-none bg-white rounded-b-2xl">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-6 py-2 text-xs font-bold text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        BATAL
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-2 text-xs font-bold text-white bg-[#1D5ABF] rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
                    >
                        Simpan
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