import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Admin } from "./pages/Admin/Admin";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Homepage } from "./pages/Homepage/Homepage";
import { MyPortal } from "./pages/MyPortal/MyPortal";
import { Footer } from "./components/Footer/Footer";
import { NotFound } from "./pages/NotFound/NotFound";
import { NotAuthorized } from "./pages/NotAuthorized/NotAuthorized";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { isAuthenticated, getUserRole } from "./utils/auth";
import { useState, useEffect } from "react";

export const App = () => {
    const [role, setRole] = useState(null);
    useEffect(() => {
        if (isAuthenticated()) {
            setRole(getUserRole());
        }
    }, []);
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<AuthPage />} />

                <Route
                    path="/myportal"
                    element={
                        <ProtectedRoute 
                            user={{ role }} allowedRoles={["CUSTOMER", "ADMIN"]}>
                            <MyPortal />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute 
                            user={{ role }} allowedRoles={["ADMIN"]}>
                            <Admin />
                        </ProtectedRoute>
                    }
                />

                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
};
