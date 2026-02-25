// Admin-related API functions wrapped with apiFetch so components don't need to know endpoint details
import { apiFetch } from "./apiClient";


// Resets the entire database (admin only).
export async function resetDatabase() {
    const response = await apiFetch("/admin/reset", {
        method: "POST"
    });
    return response.text(); // backend returns a simple status message
}


// Searches customers by a specific field/value pair.
export const searchCustomers = async (field, value) => {
    const params = new URLSearchParams();

    if (field) params.append("field", field);
    if (value) params.append("value", value);

    const response = await apiFetch(
        `/admin/customers/search?${params.toString()}`
    );

    return response.json(); // returns array of matching customers
};


// Updates a specific customer record
export async function updateCustomer(id, data) {
    const response = await apiFetch(`/admin/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });

    return response.text(); // backend returns confirmation message
}


// Searches jobs by field/value pair (admin use).
export const searchJobs = async (field, value) => {
    const params = new URLSearchParams();

    if (field) params.append("field", field);
    if (value) params.append("value", value);

    const response = await apiFetch(
        `/admin/jobs/search?${params.toString()}`
    );

    return response.json();
};


// Updates the status of a specific job.
export const updateJobStatus = async (jobId, newStatus) => {
    const response = await apiFetch(
        `/jobs/${jobId}/status?newStatus=${newStatus}`,
        { method: "PATCH" }
    );

    return response.text(); // confirmation message
};