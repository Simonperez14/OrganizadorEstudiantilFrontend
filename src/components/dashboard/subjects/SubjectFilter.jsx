import { Form, Row, Col, Button } from "react-bootstrap";

const SubjectFilter = ({ filtros, onChange, onReset }) => (
    <Row className="g-2 align-items-end mb-3">
        <Col xs={12} md={4}>
            <Form.Label className="small fw-semibold mb-1">Buscar por nombre</Form.Label>
            <Form.Control
                size="sm"
                type="text"
                placeholder="Ej: Cálculo..."
                value={filtros.name}
                onChange={(e) => onChange("name", e.target.value)}
            />
        </Col>
        <Col xs={12} md={3}>
            <Form.Label className="small fw-semibold mb-1">Estado</Form.Label>
            <Form.Select size="sm" value={filtros.status} onChange={(e) => onChange("status", e.target.value)}>
                <option value="">Todos</option>
                <option value="activa">Activa</option>
                <option value="pausada">Pausada</option>
                <option value="completada">Completada</option>
            </Form.Select>
        </Col>
        <Col xs="auto">
            <Button size="sm" variant="outline-secondary" onClick={onReset}>
                Limpiar filtros
            </Button>
        </Col>
    </Row>
);

export default SubjectFilter;