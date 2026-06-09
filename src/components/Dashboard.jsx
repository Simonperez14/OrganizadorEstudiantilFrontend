import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navbar, Container, Button, Badge } from "react-bootstrap";
import { logoutRedux } from "../redux/features/authSlice.js";

const Dashboard = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const usuario   = useSelector((state) => state.auth.usuario);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded     = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || decoded.exp <= currentTime) {
        dispatch(logoutRedux());
        navigate("/login", { replace: true });
        return;
      }

      setCheckingAuth(false);

      // Auto-logout cuando el token expira
      const msHastaExpirar = (decoded.exp - currentTime) * 1000;
      const timeout = setTimeout(() => {
        dispatch(logoutRedux());
        navigate("/login", { replace: true });
      }, msHastaExpirar);

      return () => clearTimeout(timeout);
    } catch {
      dispatch(logoutRedux());
      navigate("/login", { replace: true });
    }
  }, [navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logoutRedux());
    navigate("/login", { replace: true });
  };

  if (checkingAuth) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <Navbar bg="primary" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold">Organizador Estudiantil</Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">
              Hola, <strong>{usuario?.username}</strong>
            </span>
            {usuario?.plan && (
              <Badge bg={usuario.plan === "premium" ? "warning" : "secondary"} text="dark">
                {usuario.plan.toUpperCase()}
              </Badge>
            )}
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </Container>
      </Navbar>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Dashboard;