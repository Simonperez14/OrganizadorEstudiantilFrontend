import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaMaterias = ({ subjects }) => {
    const activas = subjects.filter((s) => s.status === "activa").length;
    const pausadas = subjects.filter((s) => s.status === "pausada").length;
    const completadas = subjects.filter((s) => s.status === "completada").length;

    const data = {
        labels: ["Activas", "Pausadas", "Completadas"],
        datasets: [{
            data: [activas, pausadas, completadas],
            backgroundColor: ["#198754", "#ffc107", "#0d6efd"],
            borderWidth: 2,
            borderColor: "#fff",
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${ctx.label}: ${ctx.raw} materia${ctx.raw !== 1 ? "s" : ""}`,
                },
            },
        },
    };

    const sinDatos = activas + pausadas + completadas === 0;

    return (
        <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-success text-white fw-semibold">
                Estado de materias
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
                {sinDatos ? (
                    <p className="text-muted text-center">Aún no hay materias para graficar.</p>
                ) : (
                    <div style={{ maxWidth: "260px", width: "100%" }}>
                        <Doughnut data={data} options={options} />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default GraficaMaterias;