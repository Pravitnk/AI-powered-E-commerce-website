import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/cart"; // You can move this to .env later

// Fetch cart for logged-in user
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/item`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// Add or update item in cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, qty, size }, thunkAPI) => {
    try {
      console.log(productId, qty, size);

      const res = await axios.post(
        `${API}/add`,
        { productId, qty, size },
        { withCredentials: true }
      );
      console.log(res.data);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Add to cart failed"
      );
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, qty }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${API}/update/${id}`,
        { qty },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update cart quantity failed"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Handle updateQty
      .addCase(updateQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.loading = false;
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
