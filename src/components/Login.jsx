import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Form, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import { loginApi } from "../services/apiServices.js";
import { loginRedux } from "../redux/features/authSlice.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const loginSchema = Yup.object({
    emailOUsername: Yup.string()
        .min(3, "Debe tener al menos 3 caracteres")
        .required("El usuario o email es obligatorio"),
    password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    const onSubmit = async (values) => {
        setError(null);
        try {
            dispatch(startLoading());
            const data = await loginApi(values.emailOUsername, values.password);
            dispatch(loginRedux({ token: data.token }));
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <Container className="min-vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={6} lg={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">

                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">Organizador Estudiantil</h2>
                                <p className="text-muted mb-0">Iniciá sesión para continuar</p>
                            </div>

                            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                            <Formik
                                initialValues={{ emailOUsername: "", password: "" }}
                                validationSchema={loginSchema}
                                onSubmit={onSubmit}
                            >
                                {({ values, isSubmitting }) => (
                                    <FormikForm>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Usuario o email</Form.Label>
                                            <Field
                                                as={Form.Control}
                                                type="text"
                                                name="emailOUsername"
                                                placeholder="Ingresá tu usuario o email"
                                            />
                                            <div className="text-danger small mt-1">
                                                <ErrorMessage name="emailOUsername" />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Field
                                                as={Form.Control}
                                                type="password"
                                                name="password"
                                                placeholder="Ingresá tu contraseña"
                                            />
                                            <div className="text-danger small mt-1">
                                                <ErrorMessage name="password" />
                                            </div>
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100"
                                            disabled={!values.emailOUsername || !values.password || isSubmitting}
                                        >
                                            Ingresar
                                        </Button>

                                    </FormikForm>
                                )}
                            </Formik>

                            <hr />
                            <p className="text-center text-muted mb-0">
                                ¿No tenés cuenta?{" "}
                                <Link to="/register" className="text-primary fw-semibold">
                                    Registrate
                                </Link>
                            </p>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;