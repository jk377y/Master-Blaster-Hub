// User-related API functions for MyPortal features
import { apiFetch } from "./apiClient";


// Fetches the currently authenticated user
export async function fetchCurrentUser() {
    return await apiFetch("/users/me");
}


// Deactivates a specific address
export async function deactivateAddress(addressId) {
    return await apiFetch(
        `/users/address/${addressId}/deactivate`,
        { method: "PATCH" }
    );
}


// Adds a new address to the user account
export async function addAddress(address) {
    return await apiFetch("/users/address", {
        method: "POST",
        body: JSON.stringify(address)
    });
}


// Updates the status of a job
export const updateJobStatus = async (jobId, newStatus) => {
    return await apiFetch(
        `/jobs/${jobId}/status?newStatus=${newStatus}`,
        { method: "PATCH" }
    );
};


// Retrieves available services
export const fetchServices = async () => {
    return await apiFetch("/users/services");
};


// Submits a new job request
export const requestJob = async (addressId, serviceId, squareFootage) => {
    return await apiFetch(
        `/users/${addressId}/jobs`,
        {
            method: "POST",
            body: JSON.stringify({
                serviceId,
                squareFootage
            })
        }
    );
};