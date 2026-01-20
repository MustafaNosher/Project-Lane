import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse, RegisterResponse, User } from "@/types/authTypes";
import { API_ROUTES } from "@/config/routes";
import axios from "axios";
import apiClient from "../apiClient";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  allUsers: null,
  dashboardStats: null,
};


export const loginUser = createAsyncThunk<
  LoginResponse,
  any,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    const data = response.data;
    
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
    const response = await apiClient.post(API_ROUTES.AUTH.REGISTER, userData);
    const data = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Registration failed");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logout", async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
      if (response.status === 200) {
        localStorage.removeItem("token");
      }
    } catch (error: any) {
     if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Logout failed");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

// fetchCurrentUser
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(API_ROUTES.USER.GET_PROFILE);
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Failed to fetch user");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("auth/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(API_ROUTES.USER.GET_ALL);
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Failed to fetch users");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

export const fetchDashboardStats = createAsyncThunk<
  { activeProjectsCount: number; pendingTasksCount: number },
  void,
  { rejectValue: string }
>("auth/fetchDashboardStats", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(API_ROUTES.USER.GET_STATS);
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Failed to fetch dashboard stats");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

export const updateProfile = createAsyncThunk<
  User,
  { name: string; email: string; profilePicture?: string },
  { rejectValue: string }
>("auth/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const response = await apiClient.put(API_ROUTES.USER.UPDATE_PROFILE, userData);
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Update profile failed");
    }
    return rejectWithValue(error.message || "Network error");
  }
});

export const updatePassword = createAsyncThunk<
  void,
  any,
  { rejectValue: string }
>("auth/updatePassword", async (passwordData, { rejectWithValue }) => {
  try {
    await apiClient.put(API_ROUTES.USER.CHANGE_PASSWORD, passwordData);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || "Update password failed");
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
    tokenRefreshed: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
    
    builder.addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.error = null;
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

    builder.addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.error = null;
        state.allUsers = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
    });

    builder.addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.dashboardStats = action.payload;
    });
    builder.addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
    });

    builder.addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
    });

    builder.addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
         state.error = null;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
    });
  },
});

export const { clearError, tokenRefreshed } = authSlice.actions;
export default authSlice.reducer;
