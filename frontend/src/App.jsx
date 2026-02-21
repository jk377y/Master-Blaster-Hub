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
import "./styles/global.css";
import { clearAuth } from "./utils/auth";

export const App = () => {
    const [user, setUser] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
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
            if (decoded.exp < currentTime) {
                endSession(true);
                setAuthLoading(false);
                return;
            }
            setUser(JSON.parse(storedUser));
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
            <Header user={user} onLogout={handleLogout} />

            <Routes>
                <Route path="/" element={
                    <Homepage user={user} setUser={setUser} sessionExpired={sessionExpired} clearSessionExpired={() => setSessionExpired(false)} />
                } />
                <Route path="/myportal" element={
                    <ProtectedRoute user={user} allowedRoles={["CUSTOMER", "ADMIN"]}>
                        <MyPortal user={user} />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute user={user} allowedRoles={["ADMIN"]}>
                        <Admin user={user} />
                    </ProtectedRoute>
                } />
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
        </div>
    );
};