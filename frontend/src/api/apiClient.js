// Centralized API wrapper for all backend requests.
// Automatically attaches base URL and auth token.
import { getToken } from '../utils/auth';

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

    const contentType = response.headers.get("content-type");

    let data = null;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const error = new Error(
            typeof data === "string" ? data : data?.message || "API Error"
        );
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}