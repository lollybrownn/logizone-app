import { LuWarehouse } from "react-icons/lu";

const InputGroup = ({ label, type, id, placeholder }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-semibold text-sm text-slate-700">
                {label}
            </label>
            <input 
                type={type} 
                id={id} 
                placeholder={placeholder}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg h-10 px-4 
                           focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent 
                           transition-all placeholder:text-slate-400 text-slate-900"
            />
        </div>
    );
};

const LoginFormInput = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-sm">
            {/* Header */}
            <div>
                <h1 className="font-bold text-2xl text-slate-800">Selamat datang</h1>
                <h3 className="text-[#64748B] text-sm">Masuk untuk mengakses dashboard gudang.</h3>
            </div>

            {/* Form Area */}
            <form className="flex flex-col gap-4">
                {/* Tinggal panggil di sini, Coy! */}
                <InputGroup 
                    label="Email" 
                    type="email" 
                    id="email" 
                    placeholder="nama@perusahaan.com" 
                />
                
                <InputGroup 
                    label="Password" 
                    type="password" 
                    id="password" 
                    placeholder="••••••••" 
                />

                <button className="w-full py-3 mt-2 bg-[#1D5ABF] text-white font-bold rounded-xl hover:bg-[#1a91da] transition-all shadow-lg shadow-blue-100">
                    Masuk
                </button>
            </form>
        </div>
    );
};

const LoginCard = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
            {/* Card kamu di sini */}
            <div className="w-96 p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
                <LoginFormInput />
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