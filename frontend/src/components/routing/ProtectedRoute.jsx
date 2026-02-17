import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(getUserRole())) {
        return <Navigate to="/not-authorized" replace />;
    }

    return children;
};