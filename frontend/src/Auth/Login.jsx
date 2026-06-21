// src/pages/Auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Warehouse, Loader2 } from "lucide-react";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.login(username, password);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Username atau password salah");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="login-brand-icon">
            <Warehouse size={20} strokeWidth={2} />
          </span>
          <span className="login-brand-name">LogiZone WMS</span>
        </div>

        <div className="login-hero">
          <h1>
            Sistem Manajemen
            <br />
            Gudang Terpadu
          </h1>
          <p>
            Kendalikan Inbound, lokasi penyimpanan, monitoring stok, dan
            outbound dalam satu dashboard.
          </p>
        </div>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>Selamat Datang</h2>
          <p className="login-subtitle">Masuk untuk mengakses dashboard gudang.</p>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <label className="login-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={isSubmitting}
          />

          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isSubmitting}
          />

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="login-spinner" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
