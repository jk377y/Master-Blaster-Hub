// import { useEffect, useState } from "react";
// import { fetchCurrentUser } from "../../api/userApi";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
// import { getUserFirstName, getUserRole } from "../../utils/auth";
import styles from "./MyPortal.module.css";

export const MyPortal = ({ user }) => {
    if (!user) {
        return (
            <div className={styles.myPortalContainer}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.myPortalContainer}>
            <LoggedInAs user={user} />

            <h2>My Portal</h2>
            <p>Welcome back, {user.firstName}.</p>
            <p>Your role: {user.role}</p>

            <div style={{ marginTop: "1rem" }}>
                <h3>Account Information</h3>
                <p>
                    <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>

                <h3>Addresses</h3>

                {(!user.addresses || user.addresses.length === 0) && (
                    <p>No addresses added yet.</p>
                )}

                {user.addresses?.map((address, index) => (
                    <div key={index}>
                        <p>
                            <strong>{address.street}</strong>
                            <br />
                            {address.city}, {address.state} {address.zip}
                        </p>

                        <strong>Job History:</strong>

                        {(!address.jobHistory ||
                            address.jobHistory.length === 0) && (
                                <p>No previous jobs.</p>
                            )}

                        {address.jobHistory?.map((job, i) => (
                            <div key={i}>
                                <div>Service: {job.serviceNameSnapshot}</div>
                                <div>Status: {job.status}</div>
                                <div>Quote: ${job.calculatedQuote}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};