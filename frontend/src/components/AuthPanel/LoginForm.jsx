import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/api";
import { getDecodedToken, saveAuth } from "../../utils/auth";
import styles from "./AuthPanel.module.css";

export const LoginForm = ({ onSwitch, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            saveAuth(data.token);
            const decodedUser = getDecodedToken();
            console.log(decodedUser);
            if (!decodedUser) {
                throw new Error("Token decoding failed");
            }
            const userData = {
                firstName: decodedUser.firstName,
                role: decodedUser.role,
                email: decodedUser.sub // email is JWT subject claim
            };
            localStorage.setItem("authUser", JSON.stringify(userData));
            onLogin(userData);
            if (userData.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/myportal");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
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
};
