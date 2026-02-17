import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MoonIcon from "../../assets/icons/moon.png";
import SunIcon from "../../assets/icons/sun.png";
import { clearAuth, getUserRole, isAuthenticated } from "../../utils/auth";
import styles from "./Header.module.css";

export const Header = () => {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    const role = getUserRole();
    const handleLogout = () => {
        clearAuth();           // removes token
        navigate("/login");    // send user to login
    };
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });
    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <header className={styles.header}>
            <div className={styles.brandContainer}>
                <h1 className={styles.brand}>
                    🌊 Master Blaster Hub
                </h1>
            </div>

            <div className={styles.navigation}>
                <nav className={styles.nav}>
                    <Link to="/" className={styles.link}>Homepage</Link>

                    {authenticated && role === "ADMIN" && (
                        <>
                            {/* <span className={styles.span}>|</span> */}
                            <Link to="/admin" className={styles.link}>Admin</Link>
                        </>
                    )}

                    {authenticated && (
                        <>
                            {/* <span className={styles.span}>|</span> */}
                            <Link to="/myportal" className={styles.link}>MyPortal</Link>
                            {/* <span className={styles.span}>|</span> */}
                            <span onClick={handleLogout} className={styles.link} style={{ cursor: "pointer" }}>Logout</span>
                        </>
                    )}
                    {!authenticated && (
                        <>
                            {/* <span className={styles.span}>|</span> */}
                            <Link to="/login" className={styles.link}>Login</Link>
                        </>
                    )}
                </nav>
            </div>

            <img
                onClick={toggleTheme}
                className={styles.toggle}
                aria-label="Toggle theme"
                src={theme === "dark" ? SunIcon : MoonIcon}
                alt={theme === "dark" ? "Light mode" : "Dark mode"}
            />
        </header>
    );
};
