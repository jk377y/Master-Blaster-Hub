import { useEffect, useState } from "react";
import { resetDatabase, searchCustomers, updateCustomer } from "../../api/adminApi";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
import styles from "./Admin.module.css";

export const Admin = ({ user }) => {
    const [isResetting, setIsResetting] = useState(false);
    const [activeView, setActiveView] = useState(null); // null | "search" | "reset"
    const [toastMessage, setToastMessage] = useState(null);
    const [customerField, setCustomerField] = useState("all");
    const [customerValue, setCustomerValue] = useState("");
    const [customerResults, setCustomerResults] = useState([]);
    const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
    const [editingCustomerId, setEditingCustomerId] = useState(null);
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        isActive: true
    });
    const handleDatabaseReset = async () => {
        const confirmReset = window.confirm(
            "This will completely wipe and rebuild the database.\n\nAre you sure?"
        );
        if (!confirmReset) return;
        const startTime = Date.now();
        try {
            setIsResetting(true);
            const message = await resetDatabase();
            const elapsed = Date.now() - startTime;
            const remaining = 1000 - elapsed;
            if (remaining > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, remaining)
                );
            }
            setToastMessage(message);
        } catch (error) {
            console.error("Error resetting database:", error);
            setToastMessage("Database reset failed.");
        } finally {
            setIsResetting(false);
        }
    };
    const handleCustomerSearch = async () => {
        try {
            setIsSearchingCustomers(true);
            const results = await searchCustomers(
                customerField === "all" ? null : customerField,
                customerValue
            );
            // console.log("Customer search results:", results);
            setCustomerResults(results);
        } catch (err) {
            console.error("Customer search failed:", err);
            setToastMessage("Customer search failed.");
        } finally {
            setIsSearchingCustomers(false);
        }
    };
    const handleSaveCustomer = async (customerId) => {
        try {
            const message = await updateCustomer(customerId, editForm);
            setToastMessage(message);
            await handleCustomerSearch();
            setEditingCustomerId(null);
        } catch (err) {
            setToastMessage("Update failed.");
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
    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [toastMessage]);
    if (!user) {
        return (
            <div className={styles.adminContainer}>
                <p>Loading...</p>
            </div>
        );
    }


    return (
        <div className={styles.adminContainer}>
            <LoggedInAs user={user} />
            {toastMessage && <p className={styles.toast}>{toastMessage}</p>}
            <h2>Admin Page</h2>
            {/* ACTION BUTTONS */}
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
            {/* DYNAMIC CONTENT PANEL */}
            <div className={styles.dynamicContentPanel}>
                {!activeView && (
                    <p>Select an action above to get started.</p>
                )}
                {activeView === "customers" && (
                    <div>
                        <button className={styles.reportLargeButton}>
                            <h5>Generate Report From This Data</h5>
                        </button>
                        <h3>Search Customers</h3>
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
                        {customerResults.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <table className={styles.resultsTable}>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Role</th>
                                            <th>Active</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerResults.map(customer => (
                                            <tr key={customer.id}>
                                                <td>{customer.email}</td>
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
                                                <td>{customer.role}</td>
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
                                                <td>
                                                    {editingCustomerId === customer.id ? (
                                                        <>
                                                            <button 
                                                                className={styles.customerEditSaveButton}
                                                                onClick={() => handleSaveCustomer(customer.id)}>
                                                                Save
                                                            </button>
                                                            <button className={styles.customerEditCancelButton} onClick={() => setEditingCustomerId(null)}>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className={styles.customerEditButton}
                                                            onClick={() => handleEditCustomer(customer)}>
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
                {activeView === "search" && (
                    <div>
                        <button
                            className={styles.largeButton}
                        // onClick={generateCustomerReport}
                        ><h4>Generate Jobs Report</h4></button>
                        <h3>Search Jobs (UI Placeholder)</h3>
                        <input type="search" placeholder="Search jobs..." />
                    </div>
                )}
                {activeView === "reset" && (
                    <div>
                        <button
                            onClick={handleDatabaseReset}
                            disabled={isResetting}
                            className={`${styles.largeButton} ${styles.largeButtonDbReset}`}
                        >
                            {isResetting ? "Resetting..." : "CONFIRM RESET"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};