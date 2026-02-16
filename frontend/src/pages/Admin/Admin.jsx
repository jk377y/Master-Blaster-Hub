import React from 'react';

export const Admin = () => {
    const handleDatabaseReset = async () => {
        try {
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
            alert(message);

        } catch (error) {
            console.error("Error resetting database:", error);
            alert("Database reset failed.");
        }
    };
    return (
        <>
            <div>Admin</div>
            <button onClick={handleDatabaseReset}>BIG RED BUTTON</button>
        </>
    )
}
