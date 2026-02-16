import { useState } from "react";

export const Admin = () => {
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
            //! production endpoint
            // const response = await fetch("https://api.masterblasterhub.com/api/admin/reset", {
            //     method: "POST"
            // });
            //! local testing
            const response = await fetch("http://localhost:8080/api/admin/reset", {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Reset failed");
            }

            const message = await response.text();
            const elapsed = Date.now() - startTime;
            const remaining = 1000 - elapsed;
            if (remaining > 0) {
                await new Promise(resolve => setTimeout(resolve, remaining));
            }
            setResetMessage(message);

        } catch (error) {
            console.error("Error resetting database:", error);
            setResetMessage("Database reset failed.");
        } finally {
            setIsResetting(false);
        }
    };
    return (
        <>
            <div>Admin</div>
            <button onClick={handleDatabaseReset} disabled={isResetting}>
                {isResetting ? "Resetting..." : "BIG RED BUTTON"}
            </button>
            {resetMessage && <div>{resetMessage}</div>}

        </>
    )
}
