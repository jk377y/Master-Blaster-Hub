// Displays 404 message and auto-redirects to homepage
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

export const NotFound = () => {
    const navigate = useNavigate();

    // Redirect after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={styles.container}>
            <h1 className={styles.errorHeading}>ERROR 404</h1>

            <h2 className={styles.errorMessage}>
                The page you are looking for does not exist.
            </h2>

            <h3>
                You will be redirected to the homepage in 5 seconds.
            </h3>

            <h1>OR CLICK</h1>

            <button
                className={styles.rerouteButton}
                onClick={() => navigate("/")}
            >
                Go to Homepage Now
            </button>
        </div>
    );
};