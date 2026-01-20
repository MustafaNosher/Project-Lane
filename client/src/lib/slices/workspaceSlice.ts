import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROUTES } from "@/config/routes";
import apiClient from "../apiClient";
import type { Workspace, WorkspaceState, CreateWorkspacePayload } from "@/types/workspaceTypes";
import { logoutUser } from "./authSlice";

const initialState: WorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
    isLoading: false,
    error: null,
    isFetched: false,
};

export const fetchWorkspaces = createAsyncThunk<
    Workspace[],
    void,
    { rejectValue: string }
>("workspace/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get(API_ROUTES.WORKSPACE.GET_ALL, {
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
        const response = await apiClient.post(API_ROUTES.WORKSPACE.CREATE, payload, {
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


export const addWorkspaceMember = createAsyncThunk<
    Workspace,
    { workspaceId: string; userId: string; role?: string },
    { rejectValue: string }
>("workspace/addMember", async ({ workspaceId, userId, role }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await apiClient.post(API_ROUTES.WORKSPACE.ADD_MEMBER(workspaceId), { userId, role }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || "Failed to add member");
        }
        return rejectWithValue(error.message || "Network error");
    }
});

export const fetchWorkspaceById = createAsyncThunk<
    Workspace,
    string,
    { rejectValue: string }
>("workspace/fetchById", async (workspaceId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get(`${API_ROUTES.WORKSPACE.base}/${workspaceId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || "Failed to fetch workspace details");
        }
        return rejectWithValue(error.message || "Network error");
    }
});

export const deleteWorkspace = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("workspace/delete", async (workspaceId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        await apiClient.delete(API_ROUTES.WORKSPACE.DELETE(workspaceId), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return workspaceId;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || "Failed to delete workspace");
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
            state.error = null;
            state.workspaces = action.payload;
            state.isFetched = true;
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
            state.error = null;
            state.workspaces.unshift(action.payload); // Add new workspace to top
        });
        builder.addCase(createWorkspace.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Add Workspace Member
        builder.addCase(addWorkspaceMember.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(addWorkspaceMember.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.currentWorkspace = action.payload;
            // Also update the workspace in the list if it exists
            const index = state.workspaces.findIndex(w => w._id === action.payload._id);
            if (index !== -1) {
                state.workspaces[index] = action.payload;
            }
        });
        builder.addCase(addWorkspaceMember.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch Workspace By ID
        builder.addCase(fetchWorkspaceById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchWorkspaceById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentWorkspace = action.payload;
            state.error = null;
        });
        builder.addCase(fetchWorkspaceById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        //Delete Workspace
        builder.addCase(deleteWorkspace.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteWorkspace.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.workspaces = state.workspaces.filter(w => w._id !== action.payload);
            state.currentWorkspace = null;
        });
        builder.addCase(deleteWorkspace.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        builder.addCase("projects/fetchByWorkspace/fulfilled", (state, action: any) => {
            state.currentWorkspace = action.payload.workspace;
        });
        
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.workspaces = [];
            state.currentWorkspace = null;
            state.isLoading = false;
            state.error = null;
            state.isFetched = false;
        });
    }
});

export const { clearWorkspaceError } = workspaceSlice.actions;
export default workspaceSlice.reducer;
