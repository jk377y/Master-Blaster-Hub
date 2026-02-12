import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Homepage } from "./pages/Homepage/Homepage";
import { MyPortal } from "./pages/MyPortal/MyPortal";
import { Admin } from "./pages/Admin/Admin";

export const App = () => {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/portal" element={<MyPortal />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
};
