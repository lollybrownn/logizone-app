import { LuWarehouse, LuLayoutDashboard } from "react-icons/lu";
import { BsBox } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { LiaSearchSolid } from "react-icons/lia";
import { GoPulse, GoStack, GoPeople } from "react-icons/go";
import { CiDeliveryTruck } from "react-icons/ci";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";
import { useLocation, Link } from "react-router-dom";

// --- Komponen Pendukung ---

const SidebarHeader = () => (
  <div className="flex flex-row pt-5 pl-5 gap-3">
    <div className="rounded-xl bg-[#0B1F33] flex items-center justify-center w-10 h-10">
      <LuWarehouse className="text-[#00B7FF] text-lg" />
    </div>
    <div>
      <h3 className="text-sm font-semibold">LogiZone</h3>
      <h3 className="text-xs font-normal">WMS SUITE</h3>
    </div>
  </div>
);

const FooterLogOut = ({ icon: Icon }) => (
  <div className="ms-auto flex items-center cursor-pointer hover:opacity-80">
    <Icon className="text-white text-xl" />
  </div>
);

const ProfileName = ({ email, role }) => (
  <div className="flex flex-col">
    <span className="text-white text-sm font-semibold leading-tight">{email}</span>
    <span className="text-gray-400 text-xs">{role}</span>
  </div>
);

const FooterProfile = ({ label }) => (
  <div className="flex-none w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0081FA] to-[#0047AB] shadow-[0_0_15px_rgba(0,129,250,0.6)] text-white text-xs font-bold">
    {label}
  </div>
);

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div
    className={`flex flex-row items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 
    text-[#C4C4C4] mx-3 ${active ? 'bg-[#1DA1F2] text-white' : 'hover:bg-[#1B263B]'}`}
  >
    <div className="flex items-center justify-center w-5">
      <Icon className="text-lg" />
    </div>
    <h3 className="text-sm tracking-wide">{label}</h3>
  </div>
);

const SidebarSection = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-[10px] text-[#B1ACAC] font-medium tracking-widest pl-2 uppercase">{title}</h3>
    <div className="flex flex-col gap-0.5">{children}</div>
  </div>
);

// --- Komponen Utama Sidebar ---

export const Sidebar = () => {
  const location = useLocation();

  return (
    // Menggunakan h-screen dan flex-col agar sidebar mengisi tinggi layar
    <div className="w-64 h-screen bg-[#0F172A] text-white flex flex-col flex-none border-r border-white/5">
      
      {/* Header - Tetap di atas */}
      <div className="flex-none">
        <SidebarHeader />
        <hr className="border-[#2A345B] mx-4 my-4" />
      </div>

      {/* Menu Tengah - Flex-1 membuat area ini fleksibel dan overflow-y-auto membuatnya scrollable */}
      <div className="flex-1 overflow-y-auto py-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
        <SidebarSection title="UMUM">
          <Link to="/dashboard">
            <SidebarItem icon={LuLayoutDashboard} label="Dashboard" active={location.pathname === "/dashboard"} />
          </Link>
        </SidebarSection>

        <SidebarSection title="INBOUND">
          <Link to="/pendataan">
            <SidebarItem icon={BsBox} label="Pendataan Barang" active={location.pathname === "/pendataan"} />
          </Link>
          <Link to="/lokasi">
            <SidebarItem icon={SlLocationPin} label="Penentuan Lokasi" active={location.pathname === "/lokasi"} />
          </Link>
        </SidebarSection>

        <SidebarSection title="OPERASIONAL">
          <Link to="/pencarian">
            <SidebarItem icon={LiaSearchSolid} label="Pencarian Barang" active={location.pathname === "/pencarian"} />
          </Link>
          <Link to="/monitoring">
            <SidebarItem icon={GoPulse} label="Monitoring Aging" active={location.pathname === "/monitoring"} />
          </Link>
        </SidebarSection>

        <SidebarSection title="OUTBOUND">
          <Link to="/validation">
            <SidebarItem icon={CiDeliveryTruck} label="Validasi Outbound" active={location.pathname === "/validation"} />
          </Link>
        </SidebarSection>

        <SidebarSection title="OWNER">
          <Link to="/reports">
            <SidebarItem icon={HiOutlineDocumentReport} label="Laporan" active={location.pathname === "/reports"} />
          </Link>
          <Link to="/zones">
            <SidebarItem icon={GoStack} label="Manajemen Zona" active={location.pathname === "/zones"} />
          </Link>
          <Link to="/warehouse">
            <SidebarItem icon={LuWarehouse} label="Gudang Induk" active={location.pathname === "/warehouse"} />
          </Link>
          <Link to="/users">
            <SidebarItem icon={GoPeople} label="Manajemen Akun" active={location.pathname === "/users"} />
          </Link>
        </SidebarSection>
      </div>

      {/* Footer - Tetap di bawah */}
      <div className="flex-none border-t border-[#2A345B]">
        <div className="flex flex-row p-4 gap-4 items-center">
          <FooterProfile label="O" />
          <ProfileName email="halo" role="Owner" />
          <FooterLogOut icon={IoLogOutOutline} />
        </div>
      </div>
    </div>
  );
};