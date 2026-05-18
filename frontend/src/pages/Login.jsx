import { LuWarehouse } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputGroup = ({ label, type, id, placeholder, value, onChange }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-semibold text-sm text-slate-700">
                {label}
            </label>
            <input 
                type={type} 
                id={id} 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg h-10 px-4 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent transition-all placeholder:text-slate-400 text-slate-900"
            />
        </div>
    );
};

const LoginFormInput = () => {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [error, setError] = useState("");
    // const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError("");

    //     try {
    //         const response = await fetch("http://localhost:5000/api/login", { // Sesuaikan URL API-mu
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ username, password }),
    //         });

    //         const result = await response.json();

    //         if (result.sucess) { // Sesuai typo "sucess" di AuthController-mu
    //             // 1. Simpan data ke localStorage
    //             localStorage.setItem("user", JSON.stringify(result.data.user));
    //             localStorage.setItem("token", result.data.token);
                
    //             // 2. Arahkan ke dashboard
    //             navigate("/dashboard");
    //         } else {
    //             setError(result.message || "Login gagal");
    //         }
    //     } catch (err) {
    //         setError("Gagal terhubung ke server");
    //     }
    // };

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm">
            <div>
                <h1 className="font-bold text-2xl text-slate-800">Selamat datang</h1>
                <h3 className="text-[#64748B] text-sm">Masuk untuk mengakses dashboard gudang.</h3>
            </div>

            {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <InputGroup 
                    label="Username" // Sesuaikan dengan UserModel yang pakai 'username'
                    type="text" 
                    id="username" 
                    placeholder="Masukkan username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                
                <InputGroup 
                    label="Password" 
                    type="password" 
                    id="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="w-full py-3 mt-2 bg-[#1D5ABF] text-white font-bold rounded-xl hover:bg-[#1a91da] transition-all shadow-lg shadow-blue-100">
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
        <div className="flex flex-row text-white gap-3 items-center"> {/* Perbaikan flew -> flex */}
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
        <div className="relative flex flex-col justify-center bg-gradient-to-br from-[#0B1F33] via-[#082B54] to-[#1DA1F2] h-screen w-1/2 p-16">
        
            <div className="absolute top-10 left-16">
                <LoginHeroLogo />
            </div>

            <div className="max-w-xl">
                <LoginHeroText />
            </div>

            <div className="absolute bottom-10 left-16">
                <LoginHeroWatermark />
            </div>
            
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