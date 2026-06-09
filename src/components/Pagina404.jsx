import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const Pagina404 = () => {
    const navigate = useNavigate();
    return (
        <Container className="text-center mt-5">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <p className="fs-4 text-muted">Página no encontrada</p>
            <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </Container>
    );
};

export default Pagina404;