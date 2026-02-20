import { useState } from "react";
import styles from "./AuthPanel.module.css";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export const AuthPanel = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div className={styles.authPanelContainer}>
            <div className={styles.card}>
                {isSignup ? (
                    <SignupForm onSwitch={() => setIsSignup(false)} onLogin={onLogin} />
                ) : (
                    <LoginForm onLogin={onLogin} onSwitch={() => setIsSignup(true)} />
                )}
            </div>
        </div>
    );
};