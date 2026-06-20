import { X, Package, Truck, MapPin, Users, CalendarDays, Wallet } from "lucide-react";

export const ModalDetailBarang = ({ isOpen, onClose, item }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-8 pb-4 relative flex-none">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">Detail Barang</h2>
                    <p className="text-sm text-gray-400">Lihat dan edit informasi pengiriman</p>
                </div>

                {/* Body */}
                <div className="p-8 pt-0 overflow-y-auto flex-1 custom-scrollbar">
                    <form className="flex flex-col gap-8">
                        
                        {/* 1. Identitas Barang (Readonly) */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Package size={18} /> <span>Identitas Barang</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Label Barang" defaultValue="Electronic" disabled />
                                <InputGroup label="Jumlah Koli" type="number" defaultValue="1" disabled />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 2. Resi & Gudang (Readonly) */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Truck size={18} /> <span>Resi & Gudang Induk</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Nomor Resi" defaultValue="RSI-119" disabled />
                                <InputGroup label="Gudang Induk" defaultValue="Gudang Pusat" disabled />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 3. Rute (Tujuan Bisa Diubah) */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <MapPin size={18} /> <span>Rute Pengiriman</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Kota Asal" defaultValue="Jakarta" disabled />
                                <InputGroup label="Kota Tujuan" defaultValue={item?.tujuan || "Surabaya"} />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 4. Pengirim & Penerima (Readonly) */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <Users size={18} /> <span>Pengirim & Penerima</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Nama Pengirim" defaultValue="Budi" disabled />
                                <InputGroup label="No. Telepon Pengirim" defaultValue="0812xxxx" disabled />
                                <InputGroup label="Nama Penerima" defaultValue="Andi" disabled />
                                <InputGroup label="No. Telepon Penerima" defaultValue="0813xxxx" disabled />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 5. Tanggal (Readonly) */}
                        <section>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-4 uppercase tracking-wide">
                                <CalendarDays size={18} /> <span>Tanggal Masuk & Keluar</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Tanggal Masuk" defaultValue="2026-04-24" disabled />
                                <InputGroup label="Tanggal Keluar" defaultValue="2026-04-26" disabled />
                            </div>
                        </section>

                        <hr className="border-gray-50" />

                        {/* 6. Biaya (Bisa Diubah) */}
                        <section className="mb-4">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[13px] mb-2 uppercase tracking-wide">
                                <Wallet size={18} /> <span>Biaya Total (Rp)</span>
                            </div>
                            <InputGroup label="" type="number" defaultValue="50000" />
                        </section>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-50 flex justify-end gap-3 flex-none bg-white rounded-b-2xl">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-xs font-bold text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50">BATAL</button>
                    <button type="submit" className="px-6 py-2 text-xs font-bold text-white bg-[#1D5ABF] rounded-lg hover:bg-blue-700 shadow-md">UPDATE</button>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, disabled, ...props }) => (
    <div className="flex flex-col gap-2">
        {label && <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">{label}</label>}
        <input 
            {...props} 
            disabled={disabled}
            className={`w-full h-10 px-4 text-sm rounded-lg border outline-none transition-all ${disabled ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-white border-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} 
        />
    </div>
);