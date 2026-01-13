import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse, RegisterResponse, User } from "@/types/authTypes";
import { API_ROUTES } from "@/config/routes";
import axios from "axios";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};


export const loginUser = createAsyncThunk<
  LoginResponse,
  any, // Payload type (can be strict)
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_ROUTES.AUTH.LOGIN, credentials);
    const data = response.data;
    
    // Axios throws on non-2xx, so we can assume success here if we reach this line
    localStorage.setItem("token", data.data.token);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
       return rejectWithValue(error.response.data.message || "Login failed");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

export const registerUser = createAsyncThunk<
  RegisterResponse,
  any,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_ROUTES.AUTH.REGISTER, userData);
    const data = response.data;

    // Auto-login logic could go here, or just return success
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Registration failed");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
        // Optional: Call backend logout if needed
        // await axios.post(API_ROUTES.AUTH.LOGOUT);
        localStorage.removeItem("token");
    } catch (error) {
        // ignore
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
        return rejectWithValue("No token found");
    }

    const response = await axios.get(API_ROUTES.USER.GET_PROFILE, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    // Assuming response.data.data contains the user object based on controller response
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Failed to fetch user");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      // Depending on flow, might not auth immediately
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
    
    // Fetch Current User
    builder.addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
