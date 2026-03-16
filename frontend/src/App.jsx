// Root application component with routing and session management
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";

import { Admin } from "./pages/Admin/Admin";
import { Homepage } from "./pages/Homepage/Homepage";
import { MyPortal } from "./pages/MyPortal/MyPortal";
import { NotAuthorized } from "./pages/NotAuthorized/NotAuthorized";
import { NotFound } from "./pages/NotFound/NotFound";
import { TechStack } from "./pages/TechStack/TechStack";

import "./styles/global.css";
import { clearAuth } from "./utils/auth";

export const App = () => {

    // ===== AUTH STATE =====
    const [user, setUser] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Clears session and optionally flags expiration
    const endSession = (wasExpired = false) => {
        clearAuth();
        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
        setUser(null);

        if (wasExpired) {
            setSessionExpired(true);
        }
    };

    const handleLogout = () => {
        endSession(false);
    };

    // Initial auth check on app load
    useEffect(() => {
        const storedUser = localStorage.getItem("authUser");
        const storedToken = localStorage.getItem("token");

        if (!storedUser || !storedToken) {
            setAuthLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;

            // Token expired
            if (decoded.exp < currentTime) {
                endSession(true);
                setAuthLoading(false);
                return;
            }

            setUser(JSON.parse(storedUser));

            // Schedule auto logout
            const timeout = (decoded.exp - currentTime) * 1000;
            const timer = setTimeout(() => {
                endSession(true);
            }, timeout);

            setAuthLoading(false);
            return () => clearTimeout(timer);

        } catch {
            endSession(true);
            setAuthLoading(false);
        }
    }, []);

    // Re-check expiration whenever user changes
    useEffect(() => {
        if (!user) return;

        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        try {
            const decoded = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;
            const timeout = (decoded.exp - currentTime) * 1000;

            if (timeout <= 0) {
                endSession(true);
                return;
            }

            const timer = setTimeout(() => {
                endSession(true);
            }, timeout);

            return () => clearTimeout(timer);

        } catch {
            endSession(true);
        }
    }, [user]);

    // Clear sessionExpired banner on successful login
    useEffect(() => {
        if (user) {
            setSessionExpired(false);
        }
    }, [user]);

    if (authLoading) {
        return null;
    }

    return (
        <div className="appContainer">

            {/* Global header */}
            <Header user={user} onLogout={handleLogout} />

            <div className="modalSection">
                <h2>Thank you for visiting my capstone page.</h2>
                <h2>I am taking this project offline due to no longer needing it to be publicly accessible.</h2>
                <h2>If you would like to see the project, please reach out to me directly.</h2>
                <h2>jk377y@gmail.com</h2>
            </div>

            {/* Application routes */}
            <Routes>

                <Route path="/"
                    element={<Homepage user={user}
                        setUser={setUser}
                        sessionExpired={sessionExpired}
                        clearSessionExpired={
                            () => setSessionExpired(false)} />}
                />

                <Route path="/myportal"
                    element={
                        <ProtectedRoute
                            user={user}
                            allowedRoles={["CUSTOMER"]}>
                            <MyPortal user={user} />
                        </ProtectedRoute>}
                />

                <Route path="/admin"
                    element={
                        <ProtectedRoute
                            user={user}
                            allowedRoles={["ADMIN"]}
                        >
                            <Admin user={user} />
                        </ProtectedRoute>}
                />

                <Route path="/tech-stack" element={<TechStack />} />
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />

            </Routes>

            {/* Global footer */}
            <Footer />

        </div>
    );
};