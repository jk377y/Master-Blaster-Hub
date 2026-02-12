import { useState } from "react";
import styles from "./AuthPage.module.css";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {isSignup ? (
                    <SignupForm onSwitch={() => setIsSignup(false)} />
                ) : (
                    <LoginForm onSwitch={() => setIsSignup(true)} />
                )}
            </div>
        </div>
    );
}