// Displays the currently authenticated user
import styles from "./LoggedInAs.module.css";

export const LoggedInAs = ({ user }) => {
    return (
        <div className={styles.loggedInAsContainer}>
            <div>
                <span>Logged in as: </span>
                <span className={styles.userName}>
                    {user.firstName} ({user.role})
                </span>
            </div>
        </div>
    );
};