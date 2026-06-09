import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Form, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import { registerApi, loginApi } from "../services/apiServices.js";
import { loginRedux } from "../redux/features/authSlice.js";
import { startLoading, stopLoading } from "../redux/features/loadingSlice.js";

const registerSchema = Yup.object({
    username: Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .max(50, "Máximo 50 caracteres")
        .required("El nombre de usuario es obligatorio"),
    firstName: Yup.string()
        .min(2, "Mínimo 2 caracteres")
        .required("El nombre es obligatorio"),
    lastName: Yup.string()
        .min(2, "Mínimo 2 caracteres")
        .required("El apellido es obligatorio"),
    email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
    password: Yup.string()
        .min(6, "Mínimo 6 caracteres")
        .max(30, "Máximo 30 caracteres")
        .required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Repetí la contraseña"),

});

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    const onSubmit = async (values) => {
        setError(null);
        try {
            dispatch(startLoading());

            const { confirmPassword, ...datosParaApi } = values;
            await registerApi(datosParaApi);

            const data = await loginApi(values.username, values.password);
            dispatch(loginRedux({ token: data.token }));

            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Error al registrarse");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <Container className="min-vh-100 d-flex align-items-center justify-content-center py-4">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={7} lg={5}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">

                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary">Organizador Estudiantil</h2>
                                <p className="text-muted mb-0">Creá tu cuenta</p>
                            </div>

                            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                            <Formik
                                initialValues={{
                                    username: "", firstName: "", lastName: "",
                                    email: "", password: "", confirmPassword: "", role: "estudiante"
                                }}
                                validationSchema={registerSchema}
                                onSubmit={onSubmit}
                            >
                                {({ values, isSubmitting, isValid, dirty }) => (
                                    <FormikForm>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nombre</Form.Label>
                                                    <Field as={Form.Control} type="text" name="firstName" placeholder="Juan" />
                                                    <div className="text-danger small mt-1"><ErrorMessage name="firstName" /></div>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Apellido</Form.Label>
                                                    <Field as={Form.Control} type="text" name="lastName" placeholder="Pérez" />
                                                    <div className="text-danger small mt-1"><ErrorMessage name="lastName" /></div>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre de usuario</Form.Label>
                                            <Field as={Form.Control} type="text" name="username" placeholder="juanperez99" />
                                            <div className="text-danger small mt-1"><ErrorMessage name="username" /></div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Field as={Form.Control} type="email" name="email" placeholder="juan@email.com" />
                                            <div className="text-danger small mt-1"><ErrorMessage name="email" /></div>
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Contraseña</Form.Label>
                                                    <Field as={Form.Control} type="password" name="password" placeholder="••••••" />
                                                    <div className="text-danger small mt-1"><ErrorMessage name="password" /></div>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Repetir contraseña</Form.Label>
                                                    <Field as={Form.Control} type="password" name="confirmPassword" placeholder="••••••" />
                                                    <div className="text-danger small mt-1"><ErrorMessage name="confirmPassword" /></div>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100"
                                            disabled={!isValid || !dirty || isSubmitting}
                                        >
                                            Registrarse
                                        </Button>

                                    </FormikForm>
                                )}
                            </Formik>

                            <hr />
                            <p className="text-center text-muted mb-0">
                                ¿Ya tenés cuenta?{" "}
                                <Link to="/login" className="text-primary fw-semibold">
                                    Iniciá sesión
                                </Link>
                            </p>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;