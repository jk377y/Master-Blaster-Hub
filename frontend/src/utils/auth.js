import { jwtDecode } from "jwt-decode";

export function saveAuth(token) {
    localStorage.setItem("token", token);
}

export function clearAuth() {
    localStorage.removeItem("token");
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getDecodedToken() {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (err) {
        return null;
    }
}

export function isAuthenticated() {
    return !!getToken();
}

export function getUserRole() {
    const decoded = getDecodedToken();
    return decoded?.role || null;
}

export function getUserFirstName() {
    const decoded = getDecodedToken();
    return decoded?.firstName || null;
}
