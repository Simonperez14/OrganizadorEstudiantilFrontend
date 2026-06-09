import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { editarSubjectApi, eliminarSubjectApi } from "../../../services/apiServices.js";
import { editarSubjectRedux, eliminarSubjectRedux } from "../../../redux/features/subjectsSlice.js";
import { startLoading, stopLoading } from "../../../redux/features/loadingSlice.js";
import SubjectFilter from "./SubjectFilter.jsx";
import { crearColumnasSubjects } from "./columnasSubjects.jsx";

const FILTROS_INICIALES = { name: "", status: "" };

const SubjectsList = () => {
    const dispatch = useDispatch();
    const subjects = useSelector((state) => state.subjects.lista);
    const categorias = useSelector((state) => state.categories);

    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [idEditando, setIdEditando] = useState(null);
    const [nombreEditado, setNombreEditado] = useState("");
    const [horasEditadas, setHorasEditadas] = useState(1);
    const [statusEditado, setStatusEditado] = useState("activa");

    const empezarEdicion = (row) => {
        setIdEditando(row.id);
        setNombreEditado(row.name);
        setHorasEditadas(row.hoursPerWeek);
        setStatusEditado(row.status);
    };

    const cancelarEdicion = () => setIdEditando(null);

    const guardarEdicion = async (row) => {
        const datosEditados = {
            name: nombreEditado.trim(),
            hoursPerWeek: horasEditadas,
            status: statusEditado,
        };
        try {
            dispatch(startLoading());
            const data = await editarSubjectApi(row.id, datosEditados);
            dispatch(editarSubjectRedux(data.materia));
            toast.success("Materia actualizada");
            setIdEditando(null);
        } catch (err) {
            toast.error(err.data.message || "Error al actualizar");
        } finally {
            dispatch(stopLoading());
        }
    };

    const eliminar = async (id, nombre) => {
        if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
        try {
            dispatch(startLoading());
            await eliminarSubjectApi(id);
            dispatch(eliminarSubjectRedux(id));
            toast.success(`"${nombre}" eliminada`);
        } catch (err) {
            toast.error(err.data.message || "Error al eliminar");
        } finally {
            dispatch(stopLoading());
        }
    };

    const listaFiltrada = useMemo(() => subjects.filter((s) => {
        const porNombre = filtros.name ? s.name.toLowerCase().includes(filtros.name.toLowerCase()) : true;
        const porStatus = filtros.status ? s.status === filtros.status : true;
        return porNombre && porStatus;
    }), [subjects, filtros]);

    const columnas = crearColumnasSubjects({
        idEditando,
        nombreEditado, setNombreEditado,
        horasEditadas, setHorasEditadas,
        statusEditado, setStatusEditado,
        empezarEdicion,
        guardarEdicion,
        cancelarEdicion,
        eliminar,
    });

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-secondary text-white fw-semibold">
                Mis materias ({listaFiltrada.length})
            </Card.Header>
            <Card.Body>
                <SubjectFilter
                    filtros={filtros}
                    onChange={(campo, valor) => setFiltros((prev) => ({ ...prev, [campo]: valor }))}
                    onReset={() => setFiltros(FILTROS_INICIALES)}
                />
                <DataTable
                    columns={columnas}
                    data={listaFiltrada}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 20]}
                    highlightOnHover
                    responsive
                    striped
                    noDataComponent={
                        <p className="text-muted py-3 mb-0">
                            {subjects.length === 0 ? "Aún no agregaste materias." : "No hay materias que coincidan."}
                        </p>
                    }
                />
            </Card.Body>
        </Card>
    );
};

export default SubjectsList;