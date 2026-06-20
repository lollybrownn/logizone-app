// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "logizone_token";
const USER_KEY = "logizone_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // True while we're verifying an existing token on first load, so route
  // guards can show a loading state instead of bouncing to /login too early.
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const login = useCallback((userData, authToken) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }, []);

  // On mount, if a token exists, confirm it's still valid and refresh the
  // user object. This also covers the case where localStorage has a token
  // but no matching user (e.g. corrupted storage).
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    authApi
      .me({ signal: controller.signal })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      })
      .catch((err) => {
        // AbortError fires when this effect's cleanup runs before the
        // request finished (e.g. component unmounted) - not a real
        // auth failure, so it should never trigger a logout.
        if (err.name === "AbortError") return;
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
    // Intentionally only re-runs when the token itself changes (login/logout),
    // not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Listen for the global "unauthorized" event dispatched by api/client.js
  // whenever any request comes back 401 (expired/invalid token).
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setToken(null);
    }
    window.addEventListener("logizone:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("logizone:unauthorized", handleUnauthorized);
  }, []);

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
