import { apiFetch } from "./apiClient";

export async function resetDatabase() {
    const response = await apiFetch("/admin/reset", {
        method: "POST"
    });

    return response.text();
}
