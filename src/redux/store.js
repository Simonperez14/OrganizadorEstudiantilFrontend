import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice.js";
import subjectsSlice from "./features/subjectsSlice.js";
import categoriesSlice from "./features/categoriesSlice.js";
import loadingSlice from "./features/loadingSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    subjects: subjectsSlice,
    categories: categoriesSlice,
    loading: loadingSlice,
  },
});