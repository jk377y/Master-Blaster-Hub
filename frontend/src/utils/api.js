import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiFetch(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
            ...options.headers
        },
        ...options
    });
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    return response;
}

/* ---------- AUTH ---------- */

export async function login(email, password) {
    const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    return response.json();
}

/* ---------- USER ---------- */

export async function fetchCurrentUser() {
    const response = await apiFetch("/users/me");
    return response.json();
}

/* ---------- ADMIN ---------- */

export async function resetDatabase() {
    const response = await apiFetch("/admin/reset", {
        method: "POST"
    });

    return response.text();
}
