import { LuWarehouse } from "react-icons/lu";


const LoginCard = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
            {/* Card kamu di sini */}
            <div className="w-96 p-8 bg-white rounded-2xl shadow-xl border border-slate-200">

            </div>
        </div>
    )
}

const LoginForm = () => {
    return (
        <div className="bg-[#F8FAFC] h-screen w-1/2">
            <LoginCard />
        </div>
    )
}

const LoginHeroLogo = () => {
    return (
        <div className="flex flew-row text-white gap-3 items-center">
            <div className="rounded-xl bg-[#334155] flex items-center justify-center w-10 h-10 shadow-lg">
                <LuWarehouse className="text-white text-xl" />
            </div>

            <div className="text-md font-semibold tracking-tight">
                LogiZone WMS
            </div>
        </div>
    )
}

const LoginHeroText = () => {
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-white font-bold text-[40px]">Sistem Manajemen Gudang Terpadu</h1>
            <h3 className="text-slate-300 pr-45">Kendalikan inbound, lokasi penyimpanan, monitoring stok, dan outbound dalam satu dashboard.</h3>
        </div>
    )
}

const LoginHeroWatermark = () => {
    return (
        <div>
            <h3 className="text-slate-400 text-sm font-normal">&copy; LogiZone Enterprise WMS</h3>
        </div>
    )
}

const LoginHero = () => {
    return (
        <div className="flex flex-col gap-45 bg-gradient-to-br from-[#0B1F33] via-[#082B54] to-[#1DA1F2] h-screen w-1/2 p-10 ">
            <LoginHeroLogo />
            <LoginHeroText />
            <LoginHeroWatermark />
        </div>
    )
}

export const Login = () => {
    return (
        <div className="flex flex-row">
            <LoginHero />
            <LoginForm />
        </div>
    )
}