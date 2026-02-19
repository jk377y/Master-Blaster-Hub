import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
            ...options.headers
        },
        ...options
    });
    if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(errorText || "API Error");
        error.status = response.status;
        throw error;
    }
    return response;
}
