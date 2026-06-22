import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Plus, X, Trash2 } from "lucide-react";
import { userApi } from "../../api/userApi";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import Pagination, { paginate } from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

const PER_PAGE = 10;

const ROLES = ["Owner", "Staff Operasional", "Staff Gudang"];

const roleBadgeStyle = (role) => {
    switch (role) {
        case "Owner": return "bg-purple-50 text-purple-600 border-purple-100";
        case "Staff Operasional": return "bg-pink-50 text-pink-600 border-pink-100";
        case "Staff Gudang": return "bg-violet-50 text-violet-600 border-violet-100";
        default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
};

function AccountModal({ account, onClose, onSaved }) {
    const toast = useToast();
    const isEdit = Boolean(account);
    const [username, setUsername] = useState(account?.username || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(account?.role || ROLES[0]);
    const [status, setStatus] = useState(account?.status || "Active");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!username) {
            setError("Username wajib diisi");
            return;
        }
        if (!isEdit && !password) {
            setError("Password wajib diisi");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await userApi.update(account.id, { username, role, status });
                toast.success("Akun berhasil diperbarui");
            } else {
                await userApi.create({ username, password, role });
                toast.success("Akun berhasil dibuat");
            }
            onSaved();
        } catch (err) {
            setError(err.message || "Gagal menyimpan akun");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-lg font-bold text-gray-800">{isEdit ? "Edit Akun" : "Buat Akun Baru"}</h2>
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
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    {!isEdit && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    )}

                    {isEdit && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg h-10 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    )}

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

export const ManajemenAkun = () => {
    const toast = useToast();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(users.length / PER_PAGE));
    const pageItems = useMemo(() => paginate(users, page, PER_PAGE), [users, page]);
    const ownerCount = useMemo(() => users.filter((u) => u.role === "Owner").length, [users]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await userApi.list();
            setUsers(res.data.users || []);
        } catch (err) {
            toast.error(err.message || "Gagal memuat data akun pengguna");
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleDelete() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await userApi.remove(deleteTarget.id);
            toast.success("Akun berhasil dihapus");
            setDeleteTarget(null);
            if (pageItems.length === 1 && page > 1) {
                setPage(page - 1);
            }
            loadData();
        } catch (err) {
            // Backend blocks self-delete and deleting the last remaining Owner with a clear message
            toast.error(err.message || "Gagal menghapus akun");
            setDeleteTarget(null);
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-10 bg-white">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Manajemen Akun Pengguna</h1>
                        <p className="text-sm text-blue-400">Atur role setiap pengguna sistem</p>
                    </div>
                    <button
                        onClick={() => setModalState("new")}
                        className="bg-[#1D5ABF] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Plus size={16} /> Akun Baru
                    </button>
                </header>

                <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[13px] text-gray-500 border-b border-gray-50">
                                <th className="px-8 py-5 font-medium">Username</th>
                                <th className="px-6 py-5 font-medium">Role</th>
                                <th className="px-6 py-5 font-medium">Status</th>
                                <th className="px-6 py-5 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {isLoading ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400">Memuat data...</td></tr>
                            ) : pageItems.length > 0 ? (
                                pageItems.map((u) => (
                                    <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-8 py-5 font-bold text-gray-800">{u.username}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded text-[12px] font-medium border ${roleBadgeStyle(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded text-[12px] font-medium border ${u.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => setModalState(u)} className="text-blue-600 font-semibold hover:underline">
                                                    Edit
                                                </button>
                                                {(() => {
                                                    const isSelf = currentUser && currentUser.id === u.id;
                                                    const isLastOwner = u.role === "Owner" && ownerCount <= 1;
                                                    const disabled = isSelf || isLastOwner;
                                                    const title = isSelf
                                                        ? "Tidak dapat menghapus akun Anda sendiri"
                                                        : isLastOwner
                                                            ? "Tidak dapat menghapus Owner terakhir"
                                                            : "Hapus akun";
                                                    return (
                                                        <button
                                                            onClick={() => !disabled && setDeleteTarget(u)}
                                                            disabled={disabled}
                                                            title={title}
                                                            className={disabled ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-700"}
                                                            aria-label={`Hapus akun ${u.username}`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">Belum ada akun pengguna.</td></tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={users.length}
                        perPage={PER_PAGE}
                        onPageChange={setPage}
                    />
                </div>

                {modalState && (
                    <AccountModal
                        account={modalState === "new" ? null : modalState}
                        onClose={() => setModalState(null)}
                        onSaved={() => {
                            setModalState(null);
                            loadData();
                        }}
                    />
                )}

                <DeleteConfirmModal
                    isOpen={Boolean(deleteTarget)}
                    title="Hapus Akun?"
                    description={
                        deleteTarget
                            ? `Akun "${deleteTarget.username}" (${deleteTarget.role}) akan dihapus permanen.`
                            : ""
                    }
                    isDeleting={isDeleting}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            </div>
        </div>
    );
};
