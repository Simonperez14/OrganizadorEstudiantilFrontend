import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const customError = {
            message: error.response?.data?.error || error.message || "Error desconocido",
            status: error.response?.status || 500,
            data: error.response?.data || null,
        };
        return Promise.reject(customError);
    }
);

// Auth

export const loginApi = async (emailOUsername, password) => {
    const response = await api.post("/auth/login", { emailOUsername, password });
    return response.data;
};

export const registerApi = async (datos) => {
    try {
        const response = await api.post("/auth/register", datos);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Error al registrarse");
    }


};

// User

export const upgradePlanApi = async () => {
    try {
        const response = await api.patch("/users/upgrade-plan");
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Error al cambiar el plan");
    }
    //const response = await api.patch("/users/upgrade-plan");
    //return response.data;
};

// Subject

export const obtenerSubjectsApi = async (params = {}) => {
    const response = await api.get("/subjects", { params });
    return response.data;
};

export const agregarSubjectApi = async (datos) => {
    const response = await api.post("/subjects", datos);
    return response.data;
};

export const editarSubjectApi = async (id, datos) => {
    const response = await api.put(`/subjects/${id}`, datos);
    return response.data;
};

export const eliminarSubjectApi = async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
};

// Categories

export const obtenerCategoriesApi = async () => {
    const response = await api.get("/categories");
    return response.data;
};

export const agregarCategoryApi = async (datos) => {
    const response = await api.post("/categories", datos);
    return response.data;
};

// export const editarCategoryApi = async (id, datos) => {
//     const response = await api.put(`/categories/${id}`, datos);
//     return response.data;
// };

export const eliminarCategoryApi = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

// Cloudinary

export const getCloudinarySignatureApi = async () => {
  const response = await api.get("/cloudinary/signature");
  return response.data; 
};

export const destroyCloudinaryImageApi = async (publicId) => {
  const response = await api.delete("/cloudinary/destroy", { data: { publicId } });
  return response.data;
};

