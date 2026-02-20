import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotAuthorized.module.css";

export const NotAuthorized = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={styles.container}>
            <h1 className={styles.errorHeading}>ERROR 403</h1><br/>
            <br/>
            <h2 className={styles.errorMessage}>You are not authorized to view this page.</h2><br/>
            <br/>
            <h3>You will be redirected to the homepage in 5 seconds.</h3>
            <br/>
            <h1> OR CLICK </h1>
            <br/>
            <button className={styles.rerouteButton} onClick={() => navigate("/")}>
                Go to Homepage Now
            </button>
        </div>
    );
};
