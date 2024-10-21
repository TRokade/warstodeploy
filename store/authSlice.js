import api from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password, guestId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signin", {
        email,
        password,
        guestId,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ name, email, password, mobileNumber }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
        mobileNumber,
      });
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      return rejectWithValue(
        error.response?.data || { message: "An error occurred during sign up" }
      );
    }
  }
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/user");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const setUser = createAsyncThunk(
  "auth/setUser",
  async (token, { dispatch }) => {
    try {
      const response = await api.get("/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.error("Error setting user:", error);
      throw error;
    }
  }
);

export const checkTokenValidity = createAsyncThunk(
  "auth/checkTokenValidity",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await api.get("/auth/validate-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(logout());
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/update User",
  async (formData, { dispatch }) => {
    try {
      const response = await api.put("/auth/profile", formData);
      return response.data;
    } catch (error) {
      console.error("Error setting user:", error);
      throw error;
    }
  }
);

export const Addaddress = createAsyncThunk(
  "auth/address",
  async (address, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/address", address);
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const Editaddress = createAsyncThunk(
  "auth/edit-address",
  async ({ updatedAddress, ID }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/auth/address/${ID}`, updatedAddress);
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


const isClient = typeof window !== "undefined";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    guestId: isClient ? localStorage.getItem("guestId") || null : null, // Check if window exists
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setGuestId: (state, action) => {
      state.guestId = action.payload;
      localStorage.setItem("guestId", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && action.payload.message
            ? action.payload.message
            : "An error occurred during sign up";
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.removeItem("guestId");
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && action.payload.message
            ? action.payload.message
            : "An error occurred during sign in";
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem("token");
      })
      .addCase(setUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Addaddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(Addaddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user.addresses = action.payload;
      })
      .addCase(Addaddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Editaddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(Editaddress.fulfilled, (state, action) => {
        state.loading = false;
        console.log(state.user.addresses);
        const index = state.user?.addresses?.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.user.addresses[index] = action.payload;
        }
      })
      .addCase(Editaddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setGuestId } = authSlice.actions;
export default authSlice.reducer;
