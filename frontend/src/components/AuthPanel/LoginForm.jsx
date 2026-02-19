import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { getDecodedToken, saveAuth } from "../../utils/auth";
import styles from "./AuthPanel.module.css";

export const LoginForm = ({ onSwitch, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await login(email, password);
            saveAuth(data.token);
            const decodedUser = getDecodedToken();
            if (!decodedUser) {
                throw new Error("Authentication failed.");
            }
            const userData = {
                firstName: decodedUser.firstName,
                role: decodedUser.role,
                email: decodedUser.sub
            };
            localStorage.setItem("authUser", JSON.stringify(userData));
            onLogin(userData);
            navigate(userData.role === "ADMIN" ? "/admin" : "/myportal");
        } catch (err) {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2 className={styles.title}>Login</h2>
            <div className={styles.field}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    aria-label="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
            </div>
            <div className={styles.field}>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    aria-label="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.button} disabled={loading} >
                {loading ? "Logging in..." : "Login"}
            </button>
            <p className={styles.switchText}>
                <span onClick={onSwitch} className={styles.link}> Sign Up Instead </span>
            </p>
        </form>
    );
};