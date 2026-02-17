import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../utils/api";
import { getUserFirstName, getUserRole } from "../../utils/auth";

export const MyPortal = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const firstName = getUserFirstName();
    const role = getUserRole();
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
            {role && <p>Your role: {role}</p>}
            {loading && <p>Loading your data...</p>}
            {error && <p>{error}</p>}
            {user && (
    <div style={{ marginTop: "1rem" }}>

        <h3>Account Information</h3>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>

        {/* <hr style={{ marginTop: "20px" }}/> */}

        <h3>Addresses</h3>
        {user.addresses && user.addresses.length === 0 && (<p>No addresses added yet.</p>)}
        {user.addresses && user.addresses.map((address, index) => (
            <div key={index}>
                <p>
                    <strong>{address.street}</strong><br />
                    {address.city}, {address.state} {address.zip}
                </p>
                <div>
                    <strong>Job History:</strong>
                    {(!address.jobHistory || address.jobHistory.length === 0) && (<p>No previous jobs.</p>)}
                    {address.jobHistory && address.jobHistory.map((job, i) => (
                        <div key={i}>
                            <div>Service: {job.serviceNameSnapshot}</div>
                            <div>Status: {job.status}</div>
                            <div>Quote: ${job.calculatedQuote}</div>
                        </div>
                    ))}
                    {/* <hr style={{ marginTop: "10px" }}/> */}
                </div>
            </div>
        ))}

    </div>
)}
        </div>
    );
};