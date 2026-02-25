// Authentication utility helpers (JWT + localStorage)
import { jwtDecode } from "jwt-decode";


// Stores JWT in localStorage
export function saveAuth(token) {
    localStorage.setItem("token", token);
}


// Clears stored auth data
export function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
}


// Returns stored JWT
export function getToken() {
    return localStorage.getItem("token");
}


// Safely decodes JWT payload
export function getDecodedToken() {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}


// Basic auth check
export function isAuthenticated() {
    return !!getToken();
}


// Extracts role from token
export function getUserRole() {
    const decoded = getDecodedToken();
    return decoded?.role || null;
}


// Extracts first name from token
export function getUserFirstName() {
    const decoded = getDecodedToken();
    return decoded?.firstName || null;
}