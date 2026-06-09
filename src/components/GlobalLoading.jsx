const GlobalLoading = () => (
    <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
        style={{ zIndex: 9999 }}
    >
        <div className="text-center text-white">
            <div className="spinner-border mb-2" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mb-0 fw-semibold">Cargando...</p>
        </div>
    </div>
);

export default GlobalLoading;