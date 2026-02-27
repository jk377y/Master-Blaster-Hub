// Admin dashboard for database management, search, and reporting
import { useEffect, useState } from "react";
import {
    resetDatabase,
    searchCustomers,
    searchJobs,
    updateCustomer,
    updateJobStatus
} from "../../api/adminApi";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
import styles from "./Admin.module.css";

export const Admin = ({ user }) => {

    // ===== VIEW + UI STATE =====
    const [isResetting, setIsResetting] = useState(false);
    const [activeView, setActiveView] = useState(null); // null | "customers" | "search" | "reset"
    const [toastMessage, setToastMessage] = useState(null);

    // ===== CUSTOMER SEARCH STATE =====
    const [customerField, setCustomerField] = useState("all");
    const [customerValue, setCustomerValue] = useState("");
    const [customerResults, setCustomerResults] = useState([]);
    const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
    const [editingCustomerId, setEditingCustomerId] = useState(null);

    // ===== JOB SEARCH STATE =====
    const [jobResults, setJobResults] = useState([]);
    const [jobField, setJobField] = useState("all");
    const [jobValue, setJobValue] = useState("");
    const [isSearchingJobs, setIsSearchingJobs] = useState(false);

    // ===== INLINE EDIT STATE =====
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        isActive: true
    });

    // ===== DATABASE RESET =====
    const handleDatabaseReset = async () => {
        const confirmReset = window.confirm(
            "This will completely wipe and rebuild the database.\n\nAre you sure?"
        );
        if (!confirmReset) return;

        const startTime = Date.now();

        try {
            setIsResetting(true);

            const result = await resetDatabase();

            // Ensure visible feedback duration
            const elapsed = Date.now() - startTime;
            if (elapsed < 1000) {
                await new Promise(res => setTimeout(res, 1000 - elapsed));
            }

            setToastMessage(result?.message || "Database reset successfully.");
        } catch (error) {
            console.error("Reset error:", error);
            setToastMessage(error?.message || "Database reset failed.");
        } finally {
            setIsResetting(false);
        }
    };

    // ===== CUSTOMER SEARCH =====
    const handleCustomerSearch = async () => {
        try {
            setIsSearchingCustomers(true);

            const results = await searchCustomers(
                customerField === "all" ? null : customerField,
                customerValue
            );

            setCustomerResults(results || []);
        } catch (error) {
            setToastMessage(error?.message || "Customer search failed.");
        } finally {
            setIsSearchingCustomers(false);
        }
    };

    // ===== SAVE CUSTOMER EDIT =====
    const handleSaveCustomer = async (customerId) => {
        try {
            const result = await updateCustomer(customerId, editForm);
            setToastMessage(result?.message || "Customer updated successfully.");
            await handleCustomerSearch();
            setEditingCustomerId(null);
        } catch (error) {
            setToastMessage(error?.message || "Update failed.");
        }
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomerId(customer.id);
        setEditForm({
            firstName: customer.firstName,
            lastName: customer.lastName,
            isActive: customer.isActive
        });
    };

    // ===== JOB SEARCH =====
    const handleJobSearch = async () => {
        try {
            setIsSearchingJobs(true);

            const results = await searchJobs(
                jobField === "all" ? null : jobField,
                jobValue
            );

            setJobResults(results || []);
        } catch (error) {
            setToastMessage(error?.message || "Job search failed.");
        } finally {
            setIsSearchingJobs(false);
        }
    };

    // ===== JOB STATUS UPDATE =====
    const handleJobStatusUpdate = async (jobId, newStatus) => {
        try {
            const result = await updateJobStatus(jobId, newStatus);
            setToastMessage(result?.message || "Status updated.");
            await handleJobSearch();
        } catch (error) {
            setToastMessage(error?.message || "Status update failed.");
        }
    };

    const handleRefreshJobs = async () => {
        try {
            await handleJobSearch();
            setToastMessage("Status refreshed.");
        } catch (error) {
            setToastMessage(error?.message || "Refresh failed.");
        }
    };

    // ===== STATUS STYLING =====
    const getStatusClass = (status) => {
        switch (status) {
            case "REQUESTED":
            case "QUOTED":
                return styles.statusPending;
            case "APPROVED":
            case "COMPLETED":
                return styles.statusSuccess;
            case "DECLINED":
            case "CANCELLED":
                return styles.statusDanger;
            default:
                return "";
        }
    };

    // ===== CSV EXPORT (HARDENED) =====
    const handleExportCSV = () => {
        const timestamp = new Date().toLocaleString();

        let title = "";
        let columns = [];
        let rows = [];

        if (activeView === "customers" && customerResults.length > 0) {
            title = "Customer_Search_Report";
            columns = ["First Name", "Last Name", "Email", "Street", "City", "Role", "Active", "Created"];
            rows = customerResults.map(c => [
                c.firstName,
                c.lastName,
                c.email,
                c.street,
                c.city,
                c.role,
                c.isActive ? "Yes" : "No",
                new Date(c.createdAt).toLocaleString()
            ]);
        }

        if (activeView === "search" && jobResults.length > 0) {
            title = "Service_Job_Report";
            columns = ["First Name", "Last Name", "Email", "Street", "City", "Service", "Quote", "Status"];
            rows = jobResults.map(j => [
                j.firstName,
                j.lastName,
                j.userEmail,
                j.street,
                j.city,
                j.serviceName,
                j.calculatedQuote != null
                    ? `$${Number(j.calculatedQuote).toFixed(2)}`
                    : "",
                j.status
            ]);
        }

        if (rows.length === 0) return;

        const safe = (val) =>
            `"${String(val ?? "").replace(/"/g, '""')}"`;

        const csvContent = [
            "Master Blaster Hub",
            title.replace(/_/g, " "),
            `Generated: ${timestamp}`,
            "",
            columns.map(safe).join(","),
            ...rows.map(row => row.map(safe).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${title}_${Date.now()}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    };

    // ===== TOAST AUTO CLEAR =====
    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => setToastMessage(null), 2000);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    // ===== EARLY RETURN =====
    if (!user) {
        return (
            <div className={styles.adminContainer}>
                <p>Loading...</p>
            </div>
        );
    }


    return (
        <div className={styles.adminContainer}>

            {/* Logged-in user indicator */}
            <LoggedInAs user={user} />

            {/* Toast / status message */}
            {toastMessage && (
                <p className={styles.toast}>{toastMessage}</p>
            )}

            <h2>Admin Page</h2>

            {/* ===== VIEW SELECTOR BUTTONS ===== */}
            <div className={styles.actionButtonsContainer}>
                <button
                    className={`${styles.largeButton} ${activeView === "customers" ? styles.active : ""}`}
                    onClick={() => setActiveView("customers")}
                >
                    <h4>Customers</h4>
                </button>

                <button
                    className={`${styles.largeButton} ${activeView === "search" ? styles.active : ""}`}
                    onClick={() => setActiveView("search")}
                >
                    <h4>Service Jobs</h4>
                </button>

                <button
                    className={`${styles.largeButton} ${activeView === "reset" ? styles.active : ""}`}
                    onClick={() => setActiveView("reset")}
                >
                    <h4>Database Reset</h4>
                </button>
            </div>

            {/* ===== DYNAMIC CONTENT PANEL ===== */}
            <div className={styles.dynamicContentPanel}>

                {!activeView && (
                    <p>Select an action above to get started.</p>
                )}

                {/* ================= CUSTOMERS VIEW ================= */}
                {activeView === "customers" && (
                    <div>

                        {/* Export button */}
                        <button
                            onClick={handleExportCSV}
                            className={styles.reportLargeButton}
                        >
                            <h5>Export Report (CSV)</h5>
                        </button>

                        <h3>Search Customers</h3>

                        {/* Customer search controls */}
                        <div className={styles.customerSearchControls}>
                            <input
                                className={styles.customerSearchBar}
                                type="search"
                                placeholder="Search value..."
                                value={customerValue}
                                onChange={(e) => setCustomerValue(e.target.value)}
                            />

                            <select
                                className={styles.customerSearchSelect}
                                value={customerField}
                                onChange={(e) => setCustomerField(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="email">Email</option>
                                <option value="lastname">Last Name</option>
                                <option value="role">Role</option>
                            </select>

                            <button
                                className={styles.customerSearchButton}
                                onClick={handleCustomerSearch}
                                disabled={isSearchingCustomers}
                            >
                                {isSearchingCustomers ? "Searching..." : "Search"}
                            </button>
                        </div>

                        {/* Customer results table */}
                        {customerResults.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <table className={styles.resultsTable}>
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Street</th>
                                            <th>City</th>
                                            <th>Role</th>
                                            <th>Active</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerResults.map(customer => (
                                            <tr key={customer.id}>
                                                {/* Editable name fields */}
                                                <td>
                                                    {editingCustomerId === customer.id ? (
                                                        <input
                                                            value={editForm.firstName}
                                                            onChange={(e) =>
                                                                setEditForm({
                                                                    ...editForm,
                                                                    firstName: e.target.value
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        customer.firstName
                                                    )}
                                                </td>

                                                <td>
                                                    {editingCustomerId === customer.id ? (
                                                        <input
                                                            value={editForm.lastName}
                                                            onChange={(e) =>
                                                                setEditForm({
                                                                    ...editForm,
                                                                    lastName: e.target.value
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        customer.lastName
                                                    )}
                                                </td>

                                                <td>{customer.email}</td>
                                                <td>{customer.street}</td>
                                                <td>{customer.city}</td>
                                                <td>{customer.role}</td>

                                                {/* Editable active status */}
                                                <td>
                                                    {editingCustomerId === customer.id ? (
                                                        <select
                                                            value={editForm.isActive}
                                                            onChange={(e) =>
                                                                setEditForm({
                                                                    ...editForm,
                                                                    isActive: e.target.value === "true"
                                                                })
                                                            }
                                                        >
                                                            <option value="true">Yes</option>
                                                            <option value="false">No</option>
                                                        </select>
                                                    ) : (
                                                        customer.isActive ? "Yes" : "No"
                                                    )}
                                                </td>

                                                <td>
                                                    {new Date(customer.createdAt).toLocaleString()}
                                                </td>

                                                {/* Edit / Save controls */}
                                                <td>
                                                    {editingCustomerId === customer.id ? (
                                                        <>
                                                            <button
                                                                className={styles.customerEditSaveButton}
                                                                onClick={() => handleSaveCustomer(customer.id)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className={styles.customerEditCancelButton}
                                                                onClick={() => setEditingCustomerId(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className={styles.customerEditButton}
                                                            onClick={() => handleEditCustomer(customer)}
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ================= JOB SEARCH VIEW ================= */}
                {activeView === "search" && (
                    <div>

                        {/* Export button */}
                        <button
                            onClick={handleExportCSV}
                            className={styles.reportLargeButton}
                        >
                            <h5>Export Report (CSV)</h5>
                        </button>

                        <h3>Search Jobs</h3>

                        {/* Job search controls */}
                        <div className={styles.customerSearchControls}>
                            <input
                                className={styles.customerSearchBar}
                                type="search"
                                placeholder="Search value..."
                                value={jobValue}
                                onChange={(e) => setJobValue(e.target.value)}
                            />

                            <select
                                className={styles.customerSearchSelect}
                                value={jobField}
                                onChange={(e) => setJobField(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="email">Email</option>
                                <option value="city">City</option>
                                <option value="servicename">Service</option>
                                <option value="status">Status</option>
                            </select>

                            <button
                                className={styles.customerSearchButton}
                                onClick={handleJobSearch}
                                disabled={isSearchingJobs}
                            >
                                {isSearchingJobs ? "Searching..." : "Search"}
                            </button>

                            {/* Refresh button */}
                            <div className={styles.refreshButtonContainer}>
                                <button
                                    className={styles.refreshButton}
                                    onClick={handleRefreshJobs}
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Job results table */}
                        {jobResults.length > 0 && (
                            <table className={styles.resultsTable}>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Street</th>
                                        <th>City</th>
                                        <th>Service</th>
                                        <th>Quote</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobResults.map((job, index) => (
                                        <tr key={index}>
                                            <td>{job.firstName}</td>
                                            <td>{job.lastName}</td>
                                            <td>{job.userEmail}</td>
                                            <td>{job.street}</td>
                                            <td>{job.city}</td>
                                            <td>{job.serviceName}</td>

                                            <td>
                                                {job.calculatedQuote != null
                                                    ? `$${Number(job.calculatedQuote).toFixed(2)}`
                                                    : "-"}
                                            </td>

                                            <td className={getStatusClass(job.status)}>
                                                {job.status}
                                            </td>

                                            {/* Status transition buttons */}
                                            <td>
                                                <div className={styles.smallButtonContainer}>
                                                    {job.status === "REQUESTED" && (
                                                        <button
                                                            className={styles.smallButton}
                                                            onClick={() =>
                                                                handleJobStatusUpdate(job.id, "QUOTED")
                                                            }
                                                        >
                                                            Quote
                                                        </button>
                                                    )}

                                                    {job.status === "APPROVED" && (
                                                        <button
                                                            className={styles.smallButton}
                                                            onClick={() =>
                                                                handleJobStatusUpdate(job.id, "COMPLETED")
                                                            }
                                                        >
                                                            Complete
                                                        </button>
                                                    )}

                                                    {job.status === "DECLINED" && (
                                                        <button
                                                            className={styles.smallButton}
                                                            onClick={() =>
                                                                handleJobStatusUpdate(job.id, "CANCELLED")
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ================= DATABASE RESET VIEW ================= */}
                {activeView === "reset" && (
                    <div>
                        <button
                            onClick={handleDatabaseReset}
                            disabled={isResetting}
                            className={styles.largeButtonDbReset}
                        >
                            {isResetting ? "Resetting..." : "CONFIRM RESET"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};