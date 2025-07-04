import { configureStore } from "@reduxjs/toolkit";

// Import your reducers (e.g., themeReducer)
import themeReducer from "./reducers/themeSlice";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice";
import productReducer from "./reducers/productSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    // Add other slices like: user, cart, product etc.
  },
});
