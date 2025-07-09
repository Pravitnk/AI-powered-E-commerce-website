import { configureStore } from "@reduxjs/toolkit";

// Import your reducers (e.g., themeReducer)
import themeReducer from "./reducers/themeSlice";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice";
import productReducer from "./reducers/productSlice";
import cartReducer from "./reducers/cartSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    // Add other slices like: user, cart, product etc.
  },
});
