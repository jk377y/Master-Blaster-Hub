// Auth-related API calls (login + signup).
import { apiFetch } from "./apiClient";


// Sends login credentials and returns JWT + user data.
export async function login(email, password) {
    const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    return response.json();
}


// Creates a new user account.
export async function signup(userData) {
    const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData)
    });

    return response.json();
}