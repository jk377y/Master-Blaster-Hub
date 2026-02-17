import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole, saveAuth } from "../../utils/auth";
import styles from "./AuthPage.module.css";

export const LoginForm = ({ onSwitch }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // might move this API call to a separate auth service file later, but for now it's here
            const response = await fetch("http://localhost:8080/api/auth/login", {
            // const response = await fetch("https://api.masterblasterhub.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            if (!response.ok) {
                throw new Error("Login failed");
            }
            const data = await response.json();
            console.log("Login response:", data);
            saveAuth(data.token);
            //! remove later, just for testing; using JWT decoding to get role and first name instead of storing separately in localStorage
            localStorage.setItem("authUser", JSON.stringify({
                email: data.email,
                role: data.role,
                userFirstName: data.userFirstName
            }));
            console.log("Decoded role:", getUserRole());
            const role = getUserRole();
            if (role === "ADMIN") {
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
}