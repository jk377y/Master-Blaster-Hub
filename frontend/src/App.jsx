import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { Admin } from "./pages/Admin/Admin";
import { Homepage } from "./pages/Homepage/Homepage";
import { MyPortal } from "./pages/MyPortal/MyPortal";
import { NotAuthorized } from "./pages/NotAuthorized/NotAuthorized";
import { NotFound } from "./pages/NotFound/NotFound";
import { clearAuth } from "./utils/auth";
import "./styles/global.css";

export const App = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem("authUser");
        setUser(null);
    };
    return (
        <div className="appContainer">
            <BrowserRouter>
                <Header user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Homepage user={user} setUser={setUser} />}/>
                    <Route path="/myportal" element={
                            <ProtectedRoute user={user} allowedRoles={["CUSTOMER", "ADMIN"]}>
                                <MyPortal user={user}/>
                            </ProtectedRoute>
                        }/>
                    <Route path="/admin" element={
                            <ProtectedRoute user={user} allowedRoles={["ADMIN"]}>
                                <Admin user={user}/>
                            </ProtectedRoute>
                        }/>
                    <Route path="/not-authorized" element={<NotAuthorized />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
};
