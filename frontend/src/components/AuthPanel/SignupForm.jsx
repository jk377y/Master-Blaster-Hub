import styles from "./AuthPanel.module.css";

export const SignupForm = ({ onSwitch }) => {
    return (
        <form>
            <h2 className={styles.title}>Sign Up</h2>

            <div className={styles.field}>
                <input
                    type="text"
                    placeholder="First Name"
                    aria-label="First Name"
                    required
                />
            </div>

            <div className={styles.field}>
                <input
                    type="text"
                    placeholder="Last Name"
                    aria-label="Last Name"
                    required
                />
            </div>

            <div className={styles.field}>
                <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    required
                />
            </div>

            <div className={styles.field}>
                <input
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    required
                />
            </div>

            <div className={styles.field}>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    aria-label="Confirm Password"
                    required
                />
            </div>

            <button type="submit" className={styles.button}>
                Create Account
            </button>

            <p className={styles.switchText}>
                <span onClick={onSwitch} className={styles.link}>
                    Login Instead
                </span>
            </p>
        </form>
    );
};
