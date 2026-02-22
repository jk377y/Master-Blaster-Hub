import { useEffect, useState } from "react";
import { addAddress, deactivateAddress, fetchCurrentUser } from "../../api/userApi";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
import styles from "./MyPortal.module.css";

export const MyPortal = ({ user }) => {
    const [activeView, setActiveView] = useState(null); // null | "addAddress" | "deleteAddress" | "requestService" | "status"
    const [dbUser, setDbUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);
    const addresses = Array.isArray(dbUser?.addresses)
        ? dbUser.addresses
        : [];
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [deleteAddressId, setDeleteAddressId] = useState("");
    // need to add isActive to address field in the database for this to work properly, but for now we will treat any address without isActive as active (to avoid breaking existing data)
    const activeAddresses = addresses.filter(
        (addr) => addr.isActive !== false
    );
    const [newAddress, setNewAddress] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        isBillingSameAsService: false
    });
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function loadUser() {
            try {
                const data = await fetchCurrentUser();
                console.log("Fetched user from DB:", data);
                setDbUser(data);
            } catch (err) {
                console.error("Failed to fetch current user:", err);
                setError("Failed to load user data.");
            } finally {
                setLoadingUser(false);
            }
        }

        loadUser();
    }, [user]);
    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 2000);
        return () => clearTimeout(timer);
    }, [toastMessage]);
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

    return (
        <div className={styles.myPortalContainer}>
            <LoggedInAs user={user} />

            {toastMessage && <p className={styles.toast}>{toastMessage}</p>}

            <div className={styles.myPortalGreeting}>
                <h2>My Portal</h2>
                <p>Welcome back, {dbUser.firstName}.</p>
            </div>
            {/* USER INFO CARD */}
            <div className={styles.userInfoCard}>
                <p>Name</p>
                <h3>{dbUser.firstName} {dbUser.lastName}</h3> {/*currently from the JWT, needs to come from the database*/}
                <p>Role</p>
                <h3>{dbUser.role}</h3> {/*needs to come from the database*/}
                <p>Account ID</p>
                <h3>{dbUser.id}</h3> {/*needs to come from the database, this will just be displayed as a visual idea... not using this for any functional reason*/}
                <p>Email</p>
                <h3>{dbUser.email}</h3> {/*currently from the JWT, needs to come from the database*/}
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
                    </div>
                )}

                {activeView === "status" && (
                    <div>
                        <h3>Request Status (UI Placeholder)</h3>
                    </div>
                )}
            </div>
        </div>
    );
};