// src/context/ZoneContext.jsx
// FR-07: Konfigurasi Zona — cached globally because zones are referenced
// from several unrelated pages (Placement dropdowns, Outbound origin display,
// Zone management itself). Centralizing the fetch means a capacity update
// from one page (e.g. after FR-03 placement) can be reflected everywhere
// else just by calling refresh().
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { zoneApi } from "../api/zoneApi";
import { useAuth } from "./AuthContext";

const ZoneContext = createContext(null);

export function ZoneProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await zoneApi.list();
      setZones(res.data.zones);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-load zones once the user is authenticated; clear them on logout
  // so a stale list never leaks across two different logged-in sessions.
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setZones([]);
    }
  }, [isAuthenticated, refresh]);

  const getZoneById = useCallback(
    (id) => zones.find((z) => z.id === Number(id)) || null,
    [zones],
  );

  const value = { zones, isLoading, error, refresh, getZoneById };

  return <ZoneContext.Provider value={value}>{children}</ZoneContext.Provider>;
}

export function useZones() {
  const ctx = useContext(ZoneContext);
  if (!ctx) {
    throw new Error("useZones must be used within a ZoneProvider");
  }
  return ctx;
}
