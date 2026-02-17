import { useState } from "react";
import { saveAuth } from "../../utils/auth";
import styles from "./AuthPage.module.css";

export const LoginForm = ({ onSwitch }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email); // for testing purposes
        console.log("Password:", password); // for testing purposes
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2 className={styles.title}>Login</h2>

            <div className={styles.field}>
                <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className={styles.field}>
                <input
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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