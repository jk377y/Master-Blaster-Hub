import { apiFetch } from "./apiClient";

export async function fetchCurrentUser() {
    const response = await apiFetch("/users/me");
    return response.json();
}
