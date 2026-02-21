import homepageImage from "../../assets/images/pressure-wash-unsplash.webp";
import { AuthPanel } from "../../components/AuthPanel/AuthPanel";
import { LoggedInAs } from "../../components/LoggedInAs/LoggedInAs";
import styles from "./Homepage.module.css";

export const Homepage = ({ user, setUser, sessionExpired, clearSessionExpired }) => {
    return (
        <div className={styles.homepageContainer}>
            {sessionExpired && (
                <div className={styles.sessionBanner}>
                    <span>Your session has expired. Please log in again.</span>
                    <button className={styles.closeButton} onClick={clearSessionExpired}>✕</button>
                </div>
            )}
            <div className={styles.topSection}>
                <img className={styles.homepageImage} src={homepageImage} alt="man using surface cleaning equipment" />
                {!user ? (<AuthPanel onLogin={setUser} />) : (<LoggedInAs user={user} />)}
            </div>
            <div className={styles.heroSection}>
                <h2>Master Blaster Hub</h2>
                <p>
                    A streamlined portal for managing marine operations,
                    service records, and customer accounts.
                    Built for clarity, speed, and reliability.
                </p>
            </div>
        </div>
    );
};