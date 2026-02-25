// Centralized API wrapper for all backend requests.
// Automatically attaches base URL and auth token.
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Wrapper around fetch with default headers + error handling.
export async function apiFetch(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
            ...options.headers
        },
        ...options
    });

    // Normalize non-2xx responses into thrown errors
    if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(errorText || "API Error");
        error.status = response.status;
        throw error;
    }

    return response;
}