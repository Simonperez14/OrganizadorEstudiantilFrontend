import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        cargaInicialCategories: (state, action) => {
            return action.payload;
        },
        agregarCategoryRedux: (state, action) => {
            state.push(action.payload);
        },
        eliminarCategoryRedux: (state, action) => {
            const id = action.payload;
            const index = state.findIndex((c) => c.id === id);
            if (index !== -1) state.splice(index, 1);
        },
        editarCategoryRedux: (state, action) => {
            const actualizada = action.payload;
            const index = state.findIndex((c) => c.id === actualizada.id);
            if (index !== -1) Object.assign(state[index], actualizada);
        },
    },
});

export const {
    cargaInicialCategories,
    agregarCategoryRedux,
    eliminarCategoryRedux,
    editarCategoryRedux,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;