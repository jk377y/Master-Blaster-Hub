import homepageImage from "../../assets/images/pressure-wash-unsplash.webp";
import { AuthPanel } from '../../components/AuthPanel/AuthPanel';
import { LoggedInAs } from '../../components/LoggedInAs/LoggedInAs';
import styles from './Homepage.module.css';

export const Homepage = ({ user, setUser }) => {
    return (
        <div className={styles.homepageContainer}>

            <div className={styles.topSection}>
                <img
                    className={styles.homepageImage}
                    src={homepageImage}
                    alt="man using surface cleaning equipment"
                    loading="eager"
                    decoding="async" 
                    />
                {!user ? (<AuthPanel onLogin={setUser} />) : (<LoggedInAs user={user} />)}
            </div>

            <div className={styles.heroSection}>
                <h2>Master Blaster Hub</h2>
                <p>
                    A streamlined portal for managing marine operations, service
                    records, and customer accounts. Built for clarity, speed, and
                    reliability.
                </p>
            </div>
        </div>
    )
}

