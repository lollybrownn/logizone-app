import { LuWarehouse } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu"
import { BsBox } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { LiaSearchSolid } from "react-icons/lia";
import { GoPulse } from "react-icons/go";
import { CiDeliveryTruck } from "react-icons/ci";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GoStack } from "react-icons/go";
import { GoPeople } from "react-icons/go";

const SidebarHeader = () => {
  return (
    <div className="flex flex-row pt-5 pl-5 gap-3">
      <div className="rounded-xl bg-[#0B1F33] flex items-center justify-center w-10 h-10">
        <LuWarehouse className="text-[#00B7FF] text-lg" />
      </div>
      <div>
        <h3 className="text-sm font-semibold">LogiZone</h3>
        <h3 className="text-xs font-normal">WMS SUITE</h3>
      </div>
    </div>
  )
}

const SidebarItem = ({ icon: Icon, label, active = false }) => {
  return (
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
};

const SidebarSection = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-[10px] text-[#B1ACAC] font-medium tracking-widest pl-2 uppercase">
      {title}
    </h3>
    <div className="flex flex-col gap-0.5">
      {children}
    </div>
  </div>
);

export const Sidebar = () => {
  return (
    <div className="w-64 flex flex-col bg-[#0F172A] text-white h-screen gap-4 overflow-y-auto">
      <SidebarHeader />
      <hr className="text-[#2A345B]" />
      <SidebarSection title="UMUM">
        <SidebarItem
          icon={LuLayoutDashboard}
          label="Dashboard"
          active={true}
        />
      </SidebarSection>
      <SidebarSection title="INBOUND">
        <SidebarItem icon={BsBox} label="Pendataan Barang" />
        <SidebarItem icon={SlLocationPin} label="Penentuan Lokasi" />
      </SidebarSection>
      <SidebarSection title="OPERASIONAL">
        <SidebarItem icon={LiaSearchSolid} label="Pencarian Barang" />
        <SidebarItem icon={GoPulse} label="Monitoring Aging" />
      </SidebarSection>
      <SidebarSection title="OUTBOUND">
        <SidebarItem icon={CiDeliveryTruck} label="Validasi Outbound" />
      </SidebarSection>
      <SidebarSection title="OWNER">
        <SidebarItem icon={HiOutlineDocumentReport} label="Laporan" />
        <SidebarItem icon={GoStack} label="Manajemen Zona" />
        <SidebarItem icon={LuWarehouse} label="Gudang Induk" />
        <SidebarItem icon={GoPeople} label="Manajemen Akun" />
      </SidebarSection>
    </div>
  )
}