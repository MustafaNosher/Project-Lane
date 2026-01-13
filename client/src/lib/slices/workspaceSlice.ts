import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROUTES } from "@/config/routes";
import type { Workspace, WorkspaceState, CreateWorkspacePayload } from "@/types/workspaceTypes";

const initialState: WorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
    isLoading: false,
    error: null,
};

export const fetchWorkspaces = createAsyncThunk<
    Workspace[],
    void,
    { rejectValue: string }
>("workspace/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_ROUTES.WORKSPACE.GET_ALL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error: any) {
         if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || "Failed to fetch workspaces");
        }
        return rejectWithValue(error.message || "Network error");
    }
});

export const createWorkspace = createAsyncThunk<
    Workspace,
    CreateWorkspacePayload,
    { rejectValue: string }
>("workspace/create", async (payload, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(API_ROUTES.WORKSPACE.CREATE, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || "Failed to create workspace");
        }
        return rejectWithValue(error.message || "Network error");
    }
});


const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        clearWorkspaceError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Workspaces
        builder.addCase(fetchWorkspaces.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workspaces = action.payload;
        });
        builder.addCase(fetchWorkspaces.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create Workspace
        builder.addCase(createWorkspace.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createWorkspace.fulfilled, (state, action) => {
            state.isLoading = false;
            state.workspaces.unshift(action.payload); // Add new workspace to top
        });
        builder.addCase(createWorkspace.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearWorkspaceError } = workspaceSlice.actions;
export default workspaceSlice.reducer;
