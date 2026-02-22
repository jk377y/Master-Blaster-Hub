import { apiFetch } from "./apiClient";

// User-related API calls from the MyPortal page

export async function fetchCurrentUser() {
    const response = await apiFetch("/users/me");
    return response.json();
}

export async function deactivateAddress(addressId) {
    const response = await apiFetch(`/users/address/${addressId}/deactivate`, {
        method: "PATCH"
    });
    return response.json();
}

export async function addAddress(address) {
    const response = await apiFetch("/users/address", {
        method: "POST",
        body: JSON.stringify(address)
    });
    return response.json();
}