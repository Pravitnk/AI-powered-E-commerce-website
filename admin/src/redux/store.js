import { configureStore } from "@reduxjs/toolkit";

// Import your reducers (e.g., themeReducer)
import themeReducer from "./reducer/themeSlice";
import authReducer from "./reducer/authSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },
});
