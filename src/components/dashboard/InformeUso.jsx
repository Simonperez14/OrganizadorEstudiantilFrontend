import { useDispatch, useSelector } from "react-redux";
import { Card, ProgressBar, Button, Badge, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { upgradePlanApi } from "../../services/apiServices.js";
import { loginRedux, actualizarPlanRedux } from "../../redux/features/authSlice.js";
import { startLoading, stopLoading } from "../../redux/features/loadingSlice.js";
import { loginApi } from "../../services/apiServices.js";

const LIMITE_PLUS = 4;

const InformeUso = ({ totalMaterias }) => {
    const dispatch = useDispatch();
    const usuario = useSelector((state) => state.auth.usuario);

    const esMasEstudiante = usuario?.role === "estudiante";
    const esMasPlus = usuario?.plan === "plus";
    const esMasPremium = usuario?.plan === "premium";
    const porcentaje = esMasPlus ? Math.min((totalMaterias / LIMITE_PLUS) * 100, 100) : 100;

    const handleUpgrade = async () => {
        try {
            dispatch(startLoading());
            //await upgradePlanApi();
            const respuesta = await upgradePlanApi();
            const { token } = respuesta;
            dispatch(actualizarPlanRedux("premium"));
            // renovar token
            dispatch(loginRedux({ token }));
            //const token = localStorage.getItem("token");
            if (token) {
                toast.success("¡Ahora sos usuario Premium!");
            }
        } catch (err) {
            toast.error(err.data.message || "Error al cambiar el plan");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-info text-white fw-semibold">
                Informe de uso
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-between">

                <div>
                    {esMasPlus && (
                        <>
                            <p className="text-muted small mb-1">Materias utilizadas</p>
                            <div className="d-flex justify-content-between mb-1">
                                <span className="fw-bold">{totalMaterias} / {LIMITE_PLUS}</span>
                                <span className="text-muted small">{Math.round(porcentaje)}%</span>
                            </div>
                            <ProgressBar
                                now={porcentaje}
                                variant={porcentaje >= 100 ? "danger" : porcentaje >= 75 ? "warning" : "success"}
                                className="mb-3"
                                style={{ height: "10px" }}
                            />
                            {porcentaje >= 100 && (
                                <Alert variant="danger" className="py-2 small">
                                    Límite alcanzado. Hacé upgrade para agregar más.
                                </Alert>
                            )}
                        </>
                    )}

                    {esMasPremium && (
                        <>
                            <p className="text-muted small mb-1">Total de materias</p>
                            <div className="fs-2 fw-bold text-success mb-1">{totalMaterias}</div>
                            <p className="text-muted small">Sin límite — Plan Premium</p>
                        </>
                    )}

                    {!esMasEstudiante && (
                        <p className="text-muted small">Los administradores no gestionan planes.</p>
                    )}
                </div>

                {/* Badge de plan actual */}
                <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Plan actual:</span>
                        <Badge bg={esMasPremium ? "warning" : "secondary"} text="dark">
                            {usuario?.plan?.toUpperCase() || "—"}
                        </Badge>
                    </div>

                    {esMasEstudiante && esMasPlus && (
                        <Button variant="warning" size="sm" onClick={handleUpgrade}>
                            Pasarme a Premium
                        </Button>
                    )}
                </div>

            </Card.Body>
        </Card>
    );
};

export default InformeUso;