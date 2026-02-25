// User-related API functions for MyPortal features
import { apiFetch } from "./apiClient";


// Fetches the currently authenticated user
export async function fetchCurrentUser() {
    const response = await apiFetch("/users/me");
    return response.json();
}


// Deactivates a specific address
export async function deactivateAddress(addressId) {
    const response = await apiFetch(
        `/users/address/${addressId}/deactivate`,
        { method: "PATCH" }
    );
    return response.json();
}


// Adds a new address to the user account
export async function addAddress(address) {
    const response = await apiFetch("/users/address", {
        method: "POST",
        body: JSON.stringify(address)
    });
    return response.json();
}


// Updates the status of a job
export const updateJobStatus = async (jobId, newStatus) => {
    const response = await apiFetch(
        `/jobs/${jobId}/status?newStatus=${newStatus}`,
        { method: "PATCH" }
    );
    return response.text();
};


// Retrieves available services
export const fetchServices = async () => {
    const response = await apiFetch("/users/services");
    return response.json();
};


// Submits a new job request
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