import styles from "./AuthPage.module.css";

export const LoginForm = ({ onSwitch }) => {
    return (
        <form>
            <h2 className={styles.title}>Login</h2>

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
                />
            </div>

            <button type="submit" className={styles.button}>
                Login
            </button>

            <p className={styles.switchText}>
                <span onClick={onSwitch} className={styles.link}>
                    Sign Up Instead
                </span>
            </p>
        </form>
    );
}