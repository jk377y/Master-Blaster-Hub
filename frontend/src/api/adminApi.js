import { apiFetch } from "./apiClient";

export async function resetDatabase() {
    const response = await apiFetch("/admin/reset", {
        method: "POST"
    });
    return response.text();
}

export const searchCustomers = async (field, value) => {
    const params = new URLSearchParams();
    if (field) params.append("field", field);
    if (value) params.append("value", value);
    const response = await apiFetch(`/admin/customers/search?${params.toString()}`);
    return await response.json();
};

export async function updateCustomer(id, data) {
    const response = await apiFetch(`/admin/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
    return await response.text();
}

export const searchJobs = async (field, value) => {
    const params = new URLSearchParams();
    if (field) params.append("field", field);
    if (value) params.append("value", value);
    const response = await apiFetch(`/admin/jobs/search?${params.toString()}`);
    return response.json();
};

export const updateJobStatus = async (jobId, newStatus) => {
    const response = await apiFetch(`/jobs/${jobId}/status?newStatus=${newStatus}`,
        { method: "PATCH" }
    );
    return response.text();
};