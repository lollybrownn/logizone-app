// src/context/AppProviders.jsx
// Composes every context provider in the correct nesting order so
// main.jsx only needs to import one thing.
//
// Order matters: ZoneProvider reads `isAuthenticated` from AuthContext,
// so AuthProvider must wrap it. ToastProvider has no dependencies and
// can wrap everything.
import { AuthProvider } from "./AuthContext";
import { ZoneProvider } from "./ZoneContext";
import { ToastProvider } from "./ToastContext";
import ToastContainer from "../components/common/ToastContainer";

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ZoneProvider>
          {children}
          <ToastContainer />
        </ZoneProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
