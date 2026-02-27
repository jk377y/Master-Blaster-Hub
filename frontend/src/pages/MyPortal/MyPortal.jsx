// Customer portal for managing addresses, service requests, and job status
import { useEffect, useState } from "react";
import {
    addAddress,
    deactivateAddress,
    fetchCurrentUser,
    fetchServices,
    requestJob,
    updateJobStatus
} from "../../api/userApi";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
import styles from "./MyPortal.module.css";

export const MyPortal = ({ user }) => {

    // ===== VIEW STATE =====
    const [activeView, setActiveView] = useState(null);
    // null | "addAddress" | "deleteAddress" | "requestService" | "status"

    // ===== USER DATA =====
    const [dbUser, setDbUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    const addresses = Array.isArray(dbUser?.addresses)
        ? dbUser.addresses
        : [];

    // Treat missing isActive as active (legacy safety)
    const activeAddresses = addresses.filter(
        (addr) => addr.isActive !== false
    );

    // ===== ADDRESS STATE =====
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [deleteAddressId, setDeleteAddressId] = useState("");

    const [newAddress, setNewAddress] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        isBillingSameAsService: false
    });

    // Flatten job history across active addresses
    const allJobs = activeAddresses.flatMap(addr =>
        (addr.jobHistory || []).map(job => ({
            ...job,
            addressLabel: `${addr.street}, ${addr.city}`
        }))
    );

    // ===== SERVICE STATE =====
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [squareFootage, setSquareFootage] = useState("");

    const selectedService = services.find(
        s => s.id === selectedServiceId
    );

    // ===== UI FEEDBACK =====
    const [toastMessage, setToastMessage] = useState(null);

    // Update job status (approve / decline)
    const handleJobStatusUpdate = async (jobId, newStatus) => {
        try {
            const result = await updateJobStatus(jobId, newStatus);
            setToastMessage(result?.message || "Status updated.");

            const refreshed = await fetchCurrentUser();
            setDbUser(refreshed);
        } catch (err) {
            setToastMessage(err?.message || "Status update failed.");
        }
    };

    // Refresh jobs from backend
    const handleRefreshJobs = async () => {
        try {
            const refreshed = await fetchCurrentUser();
            setDbUser(refreshed);
            setToastMessage("Status refreshed.");
        } catch (err) {
            setToastMessage(err?.message || "Refresh failed.");
        }
    };

    // Map job status to CSS class
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

    // Load user data on mount
    useEffect(() => {
        if (!user) return;

        async function loadUser() {
            try {
                const data = await fetchCurrentUser();
                setDbUser(data);
            } catch (err) {
                setError(err?.message || "Failed to load user data.");
            } finally {
                setLoadingUser(false);
            }
        }

        loadUser();
    }, [user]);

    // Auto-clear toast
    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [toastMessage]);

    // Load services when entering request view
    useEffect(() => {
        if (activeView !== "requestService") return;

        async function loadServices() {
            try {
                const data = await fetchServices();
                setServices(data);
            } catch (err) {
                setToastMessage(err?.message || "Failed to load services.");
            }
        }

        loadServices();
    }, [activeView]);

    // ===== EARLY RETURNS =====
    if (loadingUser) {
        return (
            <div className={styles.myPortalContainer}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!dbUser) {
        return (
            <div className={styles.myPortalContainer}>
                <p>No user data found.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.myPortalContainer}>
                <p>{error}</p>
            </div>
        );
    }

    // ===== MAIN RENDER =====
    return (
        <div className={styles.myPortalContainer}>

            <LoggedInAs user={user} />

            {toastMessage && (
                <p className={styles.toast}>{toastMessage}</p>
            )}

            <div className={styles.myPortalGreeting}>
                <h2>My Portal</h2>
                <p>Welcome back, {dbUser.firstName}.</p>
            </div>

            {/* USER INFO CARD */}
            <div className={styles.userInfoCard}>
                <p>Name</p>
                <h3>{dbUser.firstName} {dbUser.lastName}</h3>

                <p>Role</p>
                <h3>{dbUser.role}</h3>

                <p>Account ID</p>
                <h3>{dbUser.id}</h3>

                <p>Email</p>
                <h3>{dbUser.email}</h3>
            </div>

            {/* ACTION BUTTONS */}
            <div className={styles.actionButtonsContainer}>
                <button
                    className={`${styles.largeButton} ${activeView === "addAddress" ? styles.active : ""}`}
                    onClick={() => setActiveView("addAddress")}
                >
                    <h4>Add New Address</h4>
                </button>

                <button
                    className={`${styles.largeButton} ${activeView === "deleteAddress" ? styles.active : ""}`}
                    onClick={() => setActiveView("deleteAddress")}
                >
                    <h4>Delete Address</h4>
                </button>

                <button
                    className={`${styles.largeButton} ${activeView === "requestService" ? styles.active : ""}`}
                    onClick={() => setActiveView("requestService")}
                >
                    <h4>Request Service</h4>
                </button>

                <button
                    className={`${styles.largeButton} ${activeView === "status" ? styles.active : ""}`}
                    onClick={() => setActiveView("status")}
                >
                    <h4>Check Request Status</h4>
                </button>
            </div>

            {/* DYNAMIC CONTENT PANEL */}
            <div className={styles.dynamicContentPanel}>
                {!activeView && (
                    <p>Select an action above to get started.</p>
                )}
                
                {/* ADD ADDRESS VIEW */}
                {activeView === "addAddress" && (
                    <div className={styles.addAddressContainer}>
                        <h3>Add New Address</h3>

                        <div>
                            <label>Street</label>
                            <input
                                type="text"
                                value={newAddress.street}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, street: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label>City</label>
                            <input
                                type="text"
                                value={newAddress.city}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, city: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label>State</label>
                            <input
                                type="text"
                                value={newAddress.state}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, state: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label>Zip</label>
                            <input
                                type="text"
                                value={newAddress.zip}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, zip: e.target.value })
                                }
                            />
                        </div>

                        <div className={styles.checkboxContainer}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={newAddress.isBillingSameAsService}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            isBillingSameAsService: e.target.checked
                                        })
                                    }
                                />
                                <span>Billing same as service address</span>
                            </label>
                        </div>

                        <button
                            className={styles.largeButton}
                            disabled={
                                !newAddress.street ||
                                !newAddress.city ||
                                !newAddress.state ||
                                !newAddress.zip
                            }
                            onClick={async () => {
                                try {
                                    await addAddress(newAddress);
                                    const refreshed = await fetchCurrentUser();
                                    setDbUser(refreshed);
                                    setNewAddress({
                                        street: "",
                                        city: "",
                                        state: "",
                                        zip: "",
                                        isBillingSameAsService: false
                                    });
                                    setActiveView(null);
                                    setToastMessage("Address added successfully.");
                                } catch (err) {
                                    console.error("Failed to add address:", err);
                                }
                            }}
                        >
                            Submit Address
                        </button>
                    </div>
                )}

                {/* DELETE ADDRESS VIEW */}
                {activeView === "deleteAddress" && (
                    <div className={styles.deleteAddressContainer}>
                        <h3>Select Address to Delete</h3>

                        <select
                            value={deleteAddressId}
                            onChange={(e) => setDeleteAddressId(e.target.value)}
                            disabled={activeAddresses.length === 0}
                        >
                            {activeAddresses.length === 0 ? (
                                <option value="">
                                    No addresses available.
                                </option>
                            ) : (
                                <>
                                    <option value="">-- Select an Address --</option>
                                    {activeAddresses.map((address) => (
                                        <option key={address.id} value={address.id}>
                                            {address.street}, {address.city}, {address.state} {address.zip}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>

                        {deleteAddressId && (
                            <div>
                                <button
                                    className={`${styles.largeButton} ${styles.largeButtonDelete}`}
                                    onClick={async () => {
                                        try {
                                            await deactivateAddress(deleteAddressId);
                                            const refreshed = await fetchCurrentUser();
                                            setDbUser(refreshed);
                                            setDeleteAddressId("");
                                            setToastMessage("Address deleted successfully.");
                                        } catch (err) {
                                            console.error("Failed to deactivate address:", err);
                                        }
                                    }}
                                >
                                    Confirm Deletion
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* REQUEST SERVICE VIEW */}
                {activeView === "requestService" && (
                    <div className={styles.requestServiceContainer}>
                        <h3>Select Address to Request Service</h3>

                        <select
                            value={selectedAddressId}
                            onChange={(e) => setSelectedAddressId(e.target.value)}
                            disabled={activeAddresses.length === 0}
                        >
                            {activeAddresses.length === 0 ? (
                                <option value="">
                                    No active addresses available. Please add an address first.
                                </option>
                            ) : (
                                <>
                                    <option value="">-- Select an Address --</option>
                                    {activeAddresses.map((address) => (
                                        <option key={address.id} value={address.id}>
                                            {address.street}, {address.city}, {address.state} {address.zip}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        {selectedAddressId && (
                            <>
                                <h4>Select Service</h4>

                                <select
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                >
                                    <option value="">-- Select Service --</option>
                                    {services.map(service => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        {selectedService && (
                            <div style={{ marginTop: "15px" }}>
                                {selectedService.pricingType === "PER_SQFT" && (
                                    <div className={styles.sqftInputContainer}>
                                        <label>Square Footage:</label>
                                        <input
                                            type="number"
                                            value={squareFootage}
                                            onChange={(e) => setSquareFootage(e.target.value)}
                                        />
                                    </div>
                                )}

                                <button
                                    className={styles.largeButton}
                                    disabled={
                                        !selectedServiceId ||
                                        (selectedService.pricingType === "PER_SQFT" && !squareFootage)
                                    }
                                    onClick={async () => {
                                        try {
                                            await requestJob(
                                                selectedAddressId,
                                                selectedServiceId,
                                                squareFootage || null
                                            );

                                            const refreshed = await fetchCurrentUser();
                                            setDbUser(refreshed);

                                            setSelectedServiceId("");
                                            setSquareFootage("");
                                            setToastMessage("Service request submitted.");
                                        } catch {
                                            setToastMessage("Failed to submit request.");
                                        }
                                    }}
                                >
                                    Submit Request
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* JOB STATUS VIEW */}
                {activeView === "status" && (
                    <div>
                        <h3>My Service Requests</h3>
                        <div className={styles.refreshButtonContainer}>
                            <div>
                                <button
                                    className={styles.refreshButton}
                                    onClick={handleRefreshJobs}
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                        {allJobs.length === 0 ? (
                            <p>No service requests found.</p>
                        ) : (
                            <table className={styles.resultsTable}>
                                <thead>
                                    <tr>
                                        <th>Address</th>
                                        <th>Service</th>
                                        <th>Quote</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allJobs.map(job => (
                                        <tr key={job.id}>
                                            <td>{job.addressLabel}</td>
                                            <td>{job.serviceNameSnapshot}</td>
                                            <td>
                                                ${Number(job.calculatedQuote).toFixed(2)}
                                            </td>
                                            <td className={getStatusClass(job.status)}>
                                                {job.status}
                                            </td>
                                            <td>
                                                {job.status === "QUOTED" && (
                                                    <div className={styles.smallButtonContainer}>
                                                        <button
                                                            className={styles.smallButton}
                                                            onClick={() =>
                                                                handleJobStatusUpdate(job.id, "APPROVED")
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className={styles.smallButton}
                                                            onClick={() =>
                                                                handleJobStatusUpdate(job.id, "DECLINED")
                                                            }
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};