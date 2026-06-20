// src/api/client.js
// Thin fetch wrapper: attaches the JWT (if present), parses JSON,
// and normalizes errors so every page can just `await` and catch.
//
// On a 401 (expired/invalid token), it clears the stored session and
// dispatches a "logizone:unauthorized" window event. AuthContext listens
// for this event and redirects to /login — so any page, anywhere, gets
// kicked out gracefully the moment its token stops working.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

async function request(path, { method = "GET", body, token, signal } = {}) {
  const headers = { "Content-Type": "application/json" };

  const authToken = token || localStorage.getItem("logizone_token");
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Some error responses (e.g. network-level) may not have a JSON body
  }

  if (res.status === 401) {
    localStorage.removeItem("logizone_token");
    localStorage.removeItem("logizone_user");
    window.dispatchEvent(new CustomEvent("logizone:unauthorized"));
  }

  if (!res.ok || (data && data.success === false)) {
    const message = data?.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
