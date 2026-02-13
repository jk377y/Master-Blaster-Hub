import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, user, allowedRoles }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/not-authorized" replace />;
    }

    return children;
};