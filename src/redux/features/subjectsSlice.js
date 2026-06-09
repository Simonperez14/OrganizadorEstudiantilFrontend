import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lista: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

const subjectsSlice = createSlice({
    name: "subjects",
    initialState,
    reducers: {
        cargaInicialSubjects: (state, action) => {
            state.lista = action.payload.subjects;
            state.pagination = action.payload.pagination;
        },
        agregarSubjectRedux: (state, action) => {
            state.lista.unshift(action.payload);
            state.pagination.total += 1;
        },
        editarSubjectRedux: (state, action) => {
            const actualizado = action.payload;
            const index = state.lista.findIndex((s) => s.id === actualizado.id);
            if (index !== -1) {
                state.lista[index] = { ...state.lista[index], ...actualizado };
            }
        },
        eliminarSubjectRedux: (state, action) => {
            const id = action.payload;
            state.lista = state.lista.filter((s) => s.id !== id);
            state.pagination.total -= 1;
        },
    },
});

export const {
    cargaInicialSubjects,
    agregarSubjectRedux,
    editarSubjectRedux,
    eliminarSubjectRedux,
} = subjectsSlice.actions;
export default subjectsSlice.reducer;