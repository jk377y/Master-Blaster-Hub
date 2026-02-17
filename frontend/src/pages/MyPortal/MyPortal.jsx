import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../utils/api";
import { getUserFirstName } from "../../utils/auth";

export const MyPortal = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const firstName = getUserFirstName();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await fetchCurrentUser();
                setUser(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    return (
        <div>
            <h2>My Portal</h2>
            {firstName && <p>Welcome back, {firstName}.</p>}
            {loading && <p>Loading your data...</p>}
            {error && <p>{error}</p>}
            {user && (
                <div>
                    <h3>Account Information</h3>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            )}
        </div>
    );
};