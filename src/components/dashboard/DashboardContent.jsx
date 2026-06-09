import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { obtenerSubjectsApi, obtenerCategoriesApi } from "../../services/apiServices.js";
import { cargaInicialSubjects } from "../../redux/features/subjectsSlice.js";
import { cargaInicialCategories } from "../../redux/features/categoriesSlice.js";
import { startLoading, stopLoading } from "../../redux/features/loadingSlice.js";
import AgregarMateria from "./AgregarMateria.jsx";
import InformeUso from "./InformeUso.jsx";
import GraficaMaterias from "./GraficaMaterias.jsx";
import SubjectsList from "./subjects/SubjectsList.jsx";
import CategoriasList from "./CategoriasList.jsx";

const DashboardContent = () => {
    const dispatch = useDispatch();
    const usuario = useSelector((state) => state.auth.usuario);
    const subjects = useSelector((state) => state.subjects.lista);
    const pagination = useSelector((state) => state.subjects.pagination);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                dispatch(startLoading());
                const [subjectsData, categoriesData] = await Promise.all([
                    obtenerSubjectsApi({ limit: 100 }),
                    obtenerCategoriesApi(),
                ]);
                dispatch(cargaInicialSubjects(subjectsData));
                dispatch(cargaInicialCategories(categoriesData.categorias));
            } catch (err) {
                toast.error("Error al cargar los datos");
            } finally {
                dispatch(stopLoading());
            }
        };
        cargarDatos();
    }, [dispatch]);

    const totalMaterias = pagination.total;
    const limiteAlcanzado = usuario?.plan === "plus" && totalMaterias >= 4;

    return (
        <Container fluid className="py-4 px-4">

            <Row className="g-3 mb-4">
                <Col xs={6} md={3}>
                    <div className="bg-white rounded-3 shadow-sm p-3 text-center">
                        <div className="fs-2 fw-bold text-primary">{totalMaterias}</div>
                        <div className="text-muted small">Materias totales</div>
                    </div>
                </Col>
                <Col xs={6} md={3}>
                    <div className="bg-white rounded-3 shadow-sm p-3 text-center">
                        <div className="fs-2 fw-bold text-success">
                            {subjects.filter((s) => s.status === "activa").length}
                        </div>
                        <div className="text-muted small">Activas</div>
                    </div>
                </Col>
                <Col xs={6} md={3}>
                    <div className="bg-white rounded-3 shadow-sm p-3 text-center">
                        <div className="fs-2 fw-bold text-warning">
                            {subjects.reduce((acc, s) => acc + (s.hoursPerWeek || 0), 0)}
                        </div>
                        <div className="text-muted small">Horas/semana totales</div>
                    </div>
                </Col>
                <Col xs={6} md={3}>
                    <div className="bg-white rounded-3 shadow-sm p-3 text-center">
                        <div className="fs-2 fw-bold text-danger">
                            {subjects.filter((s) => s.status === "completada").length}
                        </div>
                        <div className="text-muted small">Completadas</div>
                    </div>
                </Col>
            </Row>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <AgregarMateria limiteAlcanzado={limiteAlcanzado} />
                </Col>
                <Col md={4}>
                    <InformeUso totalMaterias={totalMaterias} />
                </Col>
                <Col md={4}>
                    <GraficaMaterias subjects={subjects} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <SubjectsList />
                </Col>
            </Row>

            {usuario?.role === "admin" && (
                <Row className="mt-3">
                    <Col md={6}>
                        <CategoriasList />
                    </Col>
                </Row>
            )}

        </Container>
    );
};

export default DashboardContent;