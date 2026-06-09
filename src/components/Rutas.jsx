import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import { useSelector } from "react-redux";
import DashboardContent from "./dashboard/DashboardContent.jsx";
import Pagina404 from "./Pagina404.jsx";
import GlobalLoading from "./GlobalLoading.jsx";

const Rutas = () => {
    const isLoading = useSelector((state) => state.loading.count > 0);


    return (
        <BrowserRouter>

            {isLoading && <GlobalLoading />}

            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Dashboard />}>
                    <Route index element={<DashboardContent />} />
                </Route>
                <Route path="*" element={<Pagina404 />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Rutas;