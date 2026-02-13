import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotAuthorized = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            <h1>Access Denied</h1>
            <p>You are not authorized to view this page.</p>
            <p>YOU ARE A BAD BOY</p>
            <p>You will be redirected to the homepage in 5 seconds.</p>
            
            <h2> OR CLICK </h2>
            <button onClick={() => navigate("/")}>
                Go to Homepage Now
            </button>
        </div>
    );
};
