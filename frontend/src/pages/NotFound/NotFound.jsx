import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <p>You will be redirected to the homepage in 5 seconds.</p>
            
            <h2> OR CLICK </h2>
            <button onClick={() => navigate("/")}>
                Go to Homepage Now
            </button>
        </div>
    );
};
