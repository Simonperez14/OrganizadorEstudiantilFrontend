import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { agregarCategoryApi } from "../../services/apiServices.js";
import { agregarCategoryRedux } from "../../redux/features/categoriesSlice.js";
import { startLoading, stopLoading } from "../../redux/features/loadingSlice.js";
import SubirImagen from "../SubirImagen.jsx";

const categorySchema = Yup.object({
    name: Yup.string().min(2, "Mínimo 2 caracteres").max(100).required("El nombre es obligatorio"),
    description: Yup.string().max(300).optional()
});

const ModalCrearCategoria = ({ onClose, onCreada }) => {
    const dispatch = useDispatch();
    const [imagen, setImagen] = useState(null);

    const onSubmit = async (values, { resetForm }) => {
        try {
            dispatch(startLoading());

            const datos = { ...values };
            if (imagen?.imageUrl) datos.imageUrl = imagen.imageUrl;
            if (imagen?.imagePublicId) datos.imagePublicId = imagen.imagePublicId;

            const data = await agregarCategoryApi(datos);
            dispatch(agregarCategoryRedux(data.categoria));
            toast.success(`Categoría "${data.categoria.name}" creada`);
            onCreada?.(data.categoria); // notifica al padre para preseleccionarla
            resetForm();
            onClose();
        } catch (err) {
            toast.error(err.data.message || "Error al crear la categoría");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <Modal show onHide={onClose} centered size="sm">
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fs-6 fw-bold">Nueva categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{ name: "", description: "" }}
                    validationSchema={categorySchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, isValid, dirty }) => (
                        <FormikForm>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Nombre *</Form.Label>
                                <Field as={Form.Control} size="sm" name="name" placeholder="Ej: Exactas" />
                                <div className="text-danger" style={{ fontSize: "0.75rem" }}>
                                    <ErrorMessage name="name" />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Descripción</Form.Label>
                                <Field as="textarea" name="description" className="form-control form-control-sm" rows={2} placeholder="Opcional..." />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Imagen (opcional)</Form.Label>
                                <SubirImagen onImageUploaded={setImagen} />
                            </Form.Group>

                            <div className="d-flex gap-2 justify-content-end">
                                <Button size="sm" variant="secondary" onClick={onClose}>Cancelar</Button>
                                <Button size="sm" variant="success" type="submit" disabled={!isValid || !dirty || isSubmitting}>
                                    Crear
                                </Button>
                            </div>

                        </FormikForm>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCrearCategoria;