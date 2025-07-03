import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/auth"; // You can move this to .env later

const initialState = {
  admin: null,
  loading: false,
  error: null,
  isFetchingAdmin: true, // 👈 new flag
};

// Thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/admin-login`, adminData, {
        withCredentials: true,
      });
      return response.data; // response = { success, token }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Logout
export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
  await axios.post(`${API}/admin-logout`, null, { withCredentials: true });
});

export const fetchAdmin = createAsyncThunk(
  "auth/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/me", {
        withCredentials: true,
      });
      return response.data.admin;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload; // optionally just save token if needed
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAdmin.pending, (state) => {
        state.isFetchingAdmin = true;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isFetchingAdmin = false;
      })
      .addCase(fetchAdmin.rejected, (state) => {
        state.admin = null;
        state.isFetchingAdmin = false;
      });
  },
});

export default authSlice.reducer;
