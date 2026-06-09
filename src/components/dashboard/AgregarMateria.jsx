import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Alert, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { useState } from "react";
import { agregarSubjectApi } from "../../services/apiServices.js";
import { agregarSubjectRedux } from "../../redux/features/subjectsSlice.js";
import { startLoading, stopLoading } from "../../redux/features/loadingSlice.js";
import { useRef } from "react";
import ModalCrearCategoria from "./ModalCrearCategoria.jsx";

const subjectSchema = Yup.object({
    name: Yup.string().min(2).max(100).required("El nombre es obligatorio"),
    description: Yup.string().max(500).optional(),
    hoursPerWeek: Yup.number().min(1, "Mínimo 1 hora").max(40).required("Las horas son obligatorias"),
    status: Yup.string().oneOf(["activa", "pausada", "completada"]).required(),
    categoryId: Yup.string().optional(),
    color: Yup.string().optional(),
});

const AgregarMateria = ({ limiteAlcanzado }) => {
    const dispatch = useDispatch();
    const categorias = useSelector((state) => state.categories);
    const usuario = useSelector((state) => state.auth.usuario);

    const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
    const setFieldValueRef = useRef(null);

    const onSubmit = async (values, { resetForm }) => {
        try {
            dispatch(startLoading());
            const datos = { ...values };
            if (!datos.categoryId) delete datos.categoryId;

            const data = await agregarSubjectApi(datos);
            dispatch(agregarSubjectRedux(data.materia));
            toast.success(`"${data.materia.name}" agregada correctamente`);
            resetForm();
        } catch (err) {
            toast.error(err.data.message || "Error al agregar la materia");
        } finally {
            dispatch(stopLoading());
        }
    };

    const handleCategoriaCreada = (nuevaCategoria) => {
        if (setFieldValueRef.current) {
            setFieldValueRef.current("categoryId", nuevaCategoria.id);
        }
    };

    return (
        <>
            <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-primary text-white fw-semibold d-flex justify-content-between align-items-center">
                    <span>Agregar materia</span>
                    {usuario?.plan && (
                        <Badge bg={usuario.plan === "premium" ? "warning" : "light"} text="dark">
                            {usuario.plan.toUpperCase()}
                        </Badge>
                    )}
                </Card.Header>
                <Card.Body>
                    {limiteAlcanzado ? (
                        <Alert variant="warning" className="mb-0">
                            <strong>Límite alcanzado.</strong> Con el plan Plus solo podés tener 4 materias.
                            Hacé upgrade a Premium en el panel de uso para agregar más.
                        </Alert>
                    ) : (
                        <Formik
                            initialValues={{ name: "", description: "", hoursPerWeek: 1, status: "activa", categoryId: "", color: "#4A90E2" }}
                            validationSchema={subjectSchema}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting, isValid, dirty, setFieldValue }) => {
                                setFieldValueRef.current = setFieldValue;

                                return (
                                    <FormikForm>

                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-semibold">Nombre *</Form.Label>
                                            <Field as={Form.Control} size="sm" name="name" placeholder="Ej: Cálculo II" />
                                            <div className="text-danger" style={{ fontSize: "0.75rem" }}>
                                                <ErrorMessage name="name" />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-semibold">Descripción</Form.Label>
                                            <Field as="textarea" name="description" className="form-control form-control-sm" rows={2} placeholder="Opcional..." />
                                        </Form.Group>

                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-semibold">Categoría</Form.Label>
                                            <div className="d-flex gap-1">
                                                <Field as={Form.Select} size="sm" name="categoryId" className="flex-grow-1">
                                                    <option value="">Sin categoría</option>
                                                    {categorias.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </Field>
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    title="Crear nueva categoría"
                                                    onClick={() => setMostrarModalCategoria(true)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </Form.Group>

                                        <div className="d-flex gap-2 mb-2">
                                            <Form.Group className="flex-grow-1">
                                                <Form.Label className="small fw-semibold">Horas/semana *</Form.Label>
                                                <Field as={Form.Control} size="sm" type="number" name="hoursPerWeek" min={1} max={40} />
                                                <div className="text-danger" style={{ fontSize: "0.75rem" }}>
                                                    <ErrorMessage name="hoursPerWeek" />
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="small fw-semibold">Color</Form.Label>
                                                <Field as={Form.Control} size="sm" type="color" name="color" style={{ width: "50px", padding: "2px" }} />
                                            </Form.Group>
                                        </div>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-semibold">Estado</Form.Label>
                                            <Field as={Form.Select} size="sm" name="status">
                                                <option value="activa">Activa</option>
                                                <option value="pausada">Pausada</option>
                                                <option value="completada">Completada</option>
                                            </Field>
                                        </Form.Group>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="sm"
                                            className="w-100"
                                            disabled={!isValid || !dirty || isSubmitting}
                                        >
                                            Agregar materia
                                        </Button>

                                    </FormikForm>
                                );
                            }}
                        </Formik>
                    )}
                </Card.Body>
            </Card>

            {mostrarModalCategoria && (
                <ModalCrearCategoria
                    onClose={() => setMostrarModalCategoria(false)}
                    onCreada={handleCategoriaCreada}
                />
            )}
        </>
    );
};

export default AgregarMateria;