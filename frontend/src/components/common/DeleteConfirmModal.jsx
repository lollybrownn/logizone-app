import { AlertTriangle, X } from "lucide-react";

// Generic confirm-before-delete modal. Shows a warning icon, a customizable
// message, and Cancel/Delete buttons. The actual delete API call and error
// handling stays in the page that uses this — this component is purely UI.
//
// Usage:
//   const [target, setTarget] = useState(null); // the item pending deletion, or null
//   <DeleteConfirmModal
//     isOpen={Boolean(target)}
//     title="Hapus Zona?"
//     description={`Zona "${target?.nama_zona}" akan dihapus permanen.`}
//     isDeleting={isDeleting}
//     onCancel={() => setTarget(null)}
//     onConfirm={handleDelete}
//   />
export default function DeleteConfirmModal({
    isOpen,
    title = "Hapus data ini?",
    description = "Tindakan ini tidak dapat dibatalkan.",
    isDeleting = false,
    onCancel,
    onConfirm,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-7">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 p-3 rounded-full">
                        <AlertTriangle size={22} className="text-red-500" />
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <h2 className="text-base font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-sm text-gray-500 mb-6">{description}</p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-5 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-5 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md disabled:opacity-60"
                    >
                        {isDeleting ? "Menghapus..." : "Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}
