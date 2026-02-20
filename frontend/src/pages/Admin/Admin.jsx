import { useState } from "react";
import { resetDatabase } from "../../api/adminApi";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
import styles from "./Admin.module.css";

export const Admin = ({ user }) => {
    const [isResetting, setIsResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState("");

    const handleDatabaseReset = async () => {
        const confirmReset = window.confirm(
            "This will completely wipe and rebuild the database.\n\nAre you sure?"
        );

        if (!confirmReset) return;

        const startTime = Date.now();

        try {
            setIsResetting(true);
            setResetMessage("");

            const message = await resetDatabase();

            const elapsed = Date.now() - startTime;
            const remaining = 1000 - elapsed;

            if (remaining > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, remaining)
                );
            }

            setResetMessage(message);
        } catch (error) {
            console.error("Error resetting database:", error);
            setResetMessage("Database reset failed.");
        } finally {
            setIsResetting(false);
        }
    };

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

            <h2>Admin Page</h2>

            <button
                onClick={handleDatabaseReset}
                disabled={isResetting}
            >
                {isResetting ? "Resetting..." : "DATABASE RESET"}
            </button>

            {resetMessage && <div>{resetMessage}</div>}
        </div>
    );
};