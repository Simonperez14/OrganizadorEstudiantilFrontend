import { useDispatch, useSelector } from "react-redux";
import { Card, ListGroup, Badge, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { eliminarCategoryApi } from "../../services/apiServices.js";
import { eliminarCategoryRedux } from "../../redux/features/categoriesSlice.js";
import { startLoading, stopLoading } from "../../redux/features/loadingSlice.js";

const CategoriasList = () => {
    const dispatch = useDispatch();
    const categorias = useSelector((state) => state.categories);

    const handleEliminar = async (id, nombre) => {
        if (!window.confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
        try {
            dispatch(startLoading());
            await eliminarCategoryApi(id);
            dispatch(eliminarCategoryRedux(id));
            toast.success(`Categoría "${nombre}" eliminada`);
        } catch (err) {
            toast.error(err.data.message || "Error al eliminar la categoría");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white fw-semibold d-flex justify-content-between align-items-center">
                <span>Categorías ({categorias.length})</span>
            </Card.Header>
            <Card.Body className="p-0">
                {categorias.length === 0 ? (
                    <p className="text-muted text-center py-3 mb-0">No hay categorías creadas.</p>
                ) : (
                    <ListGroup variant="flush">
                        {categorias.map((cat) => (
                            <ListGroup.Item
                                key={cat.id}
                                className="d-flex align-items-center justify-content-between py-2 px-3"
                            >
                                <div className="d-flex align-items-center gap-2">
                                    {cat.imageUrl ? (
                                        <Image
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            roundedCircle
                                            style={{ width: 32, height: 32, objectFit: "cover", flexShrink: 0 }}
                                        />
                                    ) : (
                                        <div
                                            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"
                                            style={{ width: 32, height: 32, fontSize: "0.75rem", flexShrink: 0 }}
                                        >
                                            {cat.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="fw-semibold small">{cat.name}</div>
                                        {cat.description && (
                                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                                {cat.description}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleEliminar(cat.id, cat.name)}
                                >
                                    🗑️
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default CategoriasList;