// Handles new account creation and auto-login
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/authApi";
import { getDecodedToken, saveAuth } from "../../utils/auth";
import styles from "./AuthPanel.module.css";

export const SignupForm = ({ onSwitch, onLogin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            saveAuth(response.token);

            const decodedUser = getDecodedToken();
            if (!decodedUser) throw new Error("Signup failed.");

            const userData = {
                firstName: decodedUser.firstName,
                role: decodedUser.role,
                email: decodedUser.sub
            };

            localStorage.setItem("authUser", JSON.stringify(userData));
            onLogin(userData);

            navigate("/myportal");
        } catch (err) {
            if (err.status === 409) {
                setError(err.message);
            }
            else if (err.status === 400 && err.data && typeof err.data === "object") {
                const firstError = Object.values(err.data)[0];
                setError(firstError);
            }
            else {
                setError("Unable to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className={styles.title}>Sign Up</h2>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
                <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    autoComplete="given-name"
                    required
                    onChange={handleChange}
                />
            </div>

            <div className={styles.field}>
                <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    autoComplete="family-name"
                    required
                    onChange={handleChange}
                />
            </div>

            <div className={styles.field}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                    onChange={handleChange}
                />
            </div>

            <div className={styles.field}>
                <input
                    name="password"
                    type="password"
                    placeholder="Password (8 character minimum)"
                    autoComplete="new-password"
                    required
                    onChange={handleChange}
                />
            </div>

            <div className={styles.field}>
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    required
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                className={styles.button}
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Account"}
            </button>

            <p className={styles.switchText}>
                <span onClick={onSwitch} className={styles.link}>
                    Login Instead
                </span>
            </p>
        </form>
    );
};