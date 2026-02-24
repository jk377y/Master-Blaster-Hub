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

export const updateJobStatus = async (jobId, newStatus) => {
    const response = await apiFetch(`/jobs/${jobId}/status?newStatus=${newStatus}`,{ 
        method: "PATCH" }
    );
    return response.text();
};

export const fetchServices = async () => {
    const response = await apiFetch("/users/services");
    return response.json();
};

export const requestJob = async (addressId, serviceId, squareFootage) => {
    const response = await apiFetch(
        `/users/${addressId}/jobs`,
        {
            method: "POST",
            body: JSON.stringify({
                serviceId,
                squareFootage
            })
        }
    );
    return response.text();
};