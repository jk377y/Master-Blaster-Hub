import { apiFetch } from "./apiClient";

export async function login(email, password) {
    const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    return response.json();
}

export async function signup(userData) {
    const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData)
    });

    return response.json();
}
