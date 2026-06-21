import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { dashboardApi } from "../api/dashboardApi";
import { reportApi } from "../api/reportApi";
import { FileText, Box, MapPin, Truck, AlertTriangle, Activity } from "lucide-react";

const DashboardCard = ({ title, value, subtitle, icon, iconBgColor }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-md">
            <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {title}
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {value}
                </h3>
                <p className="text-gray-400 text-sm">
                    {subtitle}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${iconBgColor}`}>
                {icon}
            </div>
        </div>
    );
};

const DashboardContent = ({ children }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-3 px-4">
            {children}
        </div>
    );
};

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatDateTime = (value) =>
    new Date(value).toLocaleString("id-ID", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const Dashboard = () => {
    const { user, role } = useAuth();
    const toast = useToast();

    const [summary, setSummary] = useState(null);
    const [activityLog, setActivityLog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            setIsLoading(true);
            try {
                const requests = [dashboardApi.summary()];
                // /reports/logistic is Owner-only on the backend; skip it for other roles
                if (role === "Owner") {
                    requests.push(reportApi.logistic());
                }

                const [summaryRes, logisticRes] = await Promise.all(requests);
                if (cancelled) return;

                setSummary(summaryRes.data);
                if (logisticRes) {
                    setActivityLog(logisticRes.data.activityLog || []);
                }
            } catch (err) {
                if (!cancelled) toast.error(err.message || "Gagal memuat data dashboard");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadDashboard();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    const stats = summary
        ? [
            { title: "Total Barang", value: summary.totalItems, subtitle: `${summary.totalStoredItems} tersimpan di zona`, icon: <Box size={20} className="text-cyan-500" />, iconBgColor: "bg-cyan-50" },
            { title: "Pending", value: summary.totalPendingItems, subtitle: "Menunggu pendataan lokasi", icon: <FileText size={20} className="text-blue-600" />, iconBgColor: "bg-blue-50" },
            { title: "Utilisasi Zona", value: `${summary.zoneUtilization.percentage}%`, subtitle: `${summary.zoneUtilization.totalFilled}/${summary.zoneUtilization.totalCapacity} koli terisi`, icon: <MapPin size={20} className="text-orange-400" />, iconBgColor: "bg-orange-50" },
            // Revenue is Owner-only financial data; hidden for Ops/Gudang roles
            ...(role === "Owner"
                ? [{ title: "Pendapatan 30 Hari", value: formatRupiah(summary.totalIncomeLast30Days), subtitle: "Dari transaksi outbound", icon: <Truck size={20} className="text-green-500" />, iconBgColor: "bg-green-50" }]
                : []),
            { title: "Aging / Overdue", value: summary.totalAging + summary.totalOverdue, subtitle: `${summary.totalAging} aging, ${summary.totalOverdue} overdue`, icon: <AlertTriangle size={20} className="text-orange-500" />, iconBgColor: "bg-orange-100/50" },
            { title: "Aktivitas", value: activityLog.length, subtitle: "Log terbaru", icon: <Activity size={20} className="text-indigo-500" />, iconBgColor: "bg-indigo-50" },
        ]
        : [];

    return (
        <div className="flex flex-row min-h-screen bg-[#F8F9FA]">
            <Sidebar className="flex-none" />

            <div className="flex-1 p-6">
                <div className="p-4 mb-2">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Halo, {user?.username || "User"} 👋
                    </h1>
                    <p className="text-sm text-slate-500">
                        Anda login sebagai {role}. Berikut ringkasan operasi gudang hari ini.
                    </p>
                </div>

                {isLoading ? (
                    <p className="px-4 text-sm text-slate-400">Memuat data dashboard...</p>
                ) : (
                    <DashboardContent>
                        {stats.map((item, index) => (
                            <DashboardCard
                                key={index}
                                title={item.title}
                                value={item.value}
                                subtitle={item.subtitle}
                                icon={item.icon}
                                iconBgColor={item.iconBgColor}
                            />
                        ))}
                    </DashboardContent>
                )}

                {role === "Owner" && (
                    <div className="mt-8 px-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-bold text-gray-800 text-lg">Aktivitas Terbaru</h2>
                            </div>

                            {activityLog.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">Belum ada aktivitas tercatat.</p>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {activityLog.slice(0, 8).map((log, idx) => (
                                        <div key={idx} className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{log.aksi}</p>
                                                    <p className="text-xs text-gray-400">{log.keterangan} ({log.no_resi})</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400">{formatDateTime(log.tanggal)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
