import { Badge, Button, Form, Image } from "react-bootstrap";
import { useObtenerCategory } from "../../useObtenerCategory.js";

const badgeStatus = { activa: "success", pausada: "warning", completada: "primary" };

export const crearColumnasSubjects = ({
    idEditando,
    nombreEditado, setNombreEditado,
    horasEditadas, setHorasEditadas,
    statusEditado, setStatusEditado,
    empezarEdicion,
    guardarEdicion,
    cancelarEdicion,
    eliminar,
}) => {

    const { getCategoria } = useObtenerCategory();

    return [
        {
            name: "",
            width: "30px",
            cell: (row) => (
                <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: row.color || "#4A90E2", flexShrink: 0 }} />
            ),
        },
        {
            name: "Nombre",
            grow: 2,
            cell: (row) =>
                idEditando === row.id ? (
                    <Form.Control
                        size="sm"
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <span className="fw-semibold">{row.name}</span>
                ),
            sortable: true,
            selector: (row) => row.name,
        },
        {
            name: "Categoría",
            sortable: true,
            selector: (row) => getCategoria(row.categoryId)?.name ?? "—",
            cell: (row) => {
                const categoria = getCategoria(row.categoryId);

                if (!categoria) return <span className="text-muted">—</span>;

                return (
                    <div className="d-flex align-items-center gap-2">
                        {categoria.imageUrl && (
                            <Image
                                src={categoria.imageUrl}
                                alt={categoria.name}
                                roundedCircle
                                style={{ width: 24, height: 24, objectFit: "cover", flexShrink: 0 }}
                            />
                        )}
                        <span>{categoria.name}</span>
                    </div>
                );
            },
            hide: "sm",
        },
        {
            name: "Horas/sem",
            center: true,
            width: "100px",
            cell: (row) =>
                idEditando === row.id ? (
                    <Form.Control
                        size="sm"
                        type="number"
                        min={1}
                        max={40}
                        value={horasEditadas}
                        onChange={(e) => setHorasEditadas(Number(e.target.value))}
                        style={{ width: "65px" }}
                    />
                ) : (
                    <span>{row.hoursPerWeek}h</span>
                ),
            sortable: true,
            selector: (row) => row.hoursPerWeek,
        },
        {
            name: "Estado",
            center: true,
            width: "130px",
            cell: (row) =>
                idEditando === row.id ? (
                    <Form.Select
                        size="sm"
                        value={statusEditado}
                        onChange={(e) => setStatusEditado(e.target.value)}
                    >
                        <option value="activa">Activa</option>
                        <option value="pausada">Pausada</option>
                        <option value="completada">Completada</option>
                    </Form.Select>
                ) : (
                    <Badge bg={badgeStatus[row.status]} className="text-capitalize">
                        {row.status}
                    </Badge>
                ),
            sortable: true,
            selector: (row) => row.status,
        },
        {
            name: "Acciones",
            center: true,
            width: "130px",
            cell: (row) => {
                const enEdicion = idEditando === row.id;

                if (enEdicion) {
                    return (
                        <div className="d-flex gap-1">
                            <Button size="sm" variant="success" onClick={() => guardarEdicion(row)}>✔</Button>
                            <Button size="sm" variant="secondary" onClick={cancelarEdicion}>✖</Button>
                        </div>
                    );
                }

                if (idEditando === null) {
                    return (
                        <div className="d-flex gap-1">
                            <Button size="sm" variant="outline-primary" onClick={() => empezarEdicion(row)}>✏️</Button>
                            <Button size="sm" variant="outline-danger" onClick={() => eliminar(row.id, row.name)}>🗑️</Button>
                        </div>
                    );
                }

                return null;
            },
        },
    ];
};