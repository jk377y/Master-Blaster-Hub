import { useEffect, useState } from "react";
import { resetDatabase } from "../../api/adminApi";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
import styles from "./Admin.module.css";

export const Admin = ({ user }) => {
    const [isResetting, setIsResetting] = useState(false);
    const [activeView, setActiveView] = useState(null); // null | "search" | "reset"
    const [toastMessage, setToastMessage] = useState(null);
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
                        <button 
                            className={styles.largeButton} 
                            // onClick={generateCustomerReport}
                        ><h4>Generate Customers Report</h4></button>
                        <h3>Search Customers (UI Placeholder)</h3>
                        <input type="search" placeholder="Search customers..." />
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