import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const obtenerUsuarioInicial = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return jwtDecode(token);
    } catch {
        return null;
    }
};

const initialState = {
    token: localStorage.getItem("token") || null,
    usuario: obtenerUsuarioInicial(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginRedux: (state, action) => {
            const { token } = action.payload;
            state.token = token;
            state.usuario = jwtDecode(token);
            localStorage.setItem("token", token);
        },
        logoutRedux: (state) => {
            state.token = null;
            state.usuario = null;
            localStorage.removeItem("token");
        },
        actualizarPlanRedux: (state, action) => {
            if (state.usuario) {
                state.usuario.plan = action.payload;
            }
        },
    },
});

export const { loginRedux, logoutRedux, actualizarPlanRedux } = authSlice.actions;
export default authSlice.reducer;