// Admin-related API functions wrapped with apiFetch so components don't need to know endpoint details
import { apiFetch } from "./apiClient";


// Resets the entire database (admin only).
export async function resetDatabase() {
    return await apiFetch("/admin/reset", {
        method: "POST"
    });
}


// Searches customers by a specific field/value pair.
export const searchCustomers = async (field, value) => {
    const params = new URLSearchParams();

    if (field) params.append("field", field);
    if (value) params.append("value", value);

    return await apiFetch(
        `/admin/customers/search?${params.toString()}`
    );
};


// Updates a specific customer record
export async function updateCustomer(id, data) {
    return await apiFetch(`/admin/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}


// Searches jobs by field/value pair (admin use).
export const searchJobs = async (field, value) => {
    const params = new URLSearchParams();

    if (field) params.append("field", field);
    if (value) params.append("value", value);

    return await apiFetch(
        `/admin/jobs/search?${params.toString()}`
    );
};


// Updates the status of a specific job.
export const updateJobStatus = async (jobId, newStatus) => {
    return await apiFetch(
        `/jobs/${jobId}/status?newStatus=${newStatus}`,
        { method: "PATCH" }
    );
};