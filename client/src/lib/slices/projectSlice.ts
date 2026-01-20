import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/routes";
import axios from "axios";
import apiClient from "../apiClient";
import type { Project, CreateProjectData } from "@/types/projectTypes";
import type { Workspace } from "@/types/workspaceTypes";
import { logoutUser } from "./authSlice";

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  lastFetchedWorkspaceId: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  lastFetchedWorkspaceId: null,
};

// Fetch projects by workspace ID
export const fetchProjectsByWorkspace = createAsyncThunk(
  "projects/fetchByWorkspace",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(
        `${API_BASE_URL}/workspace/${workspaceId}/projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The endpoint returns { projects: [...], workspace: {...} }
      return response.data.data; 
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
         return rejectWithValue(
          error.response?.data?.message || "Failed to fetch projects"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  "projects/create",
  async (
    { workspaceId, projectData }: { workspaceId: string; projectData: CreateProjectData },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.post(
        `${API_BASE_URL}/project/create/${workspaceId}`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
         return rejectWithValue(
          error.response?.data?.message || "Failed to create project"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Fetch project details
export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchDetails",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(
        `${API_BASE_URL}/project/details/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch project details"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update project
export const updateProjectThunk = createAsyncThunk(
  "projects/update",
  async (
    { projectId, projectData }: { projectId: string; projectData: Partial<CreateProjectData> & { progress?: number } },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.patch(
        `${API_BASE_URL}/project/${projectId}`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update project"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Add Project Member
export const addProjectMemberThunk = createAsyncThunk(
  "projects/addMember",
  async (
    { projectId, memberId }: { projectId: string; memberId: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.patch(
        `${API_BASE_URL}/project/${projectId}/members`,
        { memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add project member"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const deleteProjectThunk = createAsyncThunk(
  "projects/delete",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.delete(
        `${API_BASE_URL}/project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return projectId;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete project"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

  const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.projects = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.projects = [];
      state.loading = false;
      state.error = null;
      state.lastFetchedWorkspaceId = null;
    })
    .addCase(fetchProjectsByWorkspace.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(
      fetchProjectsByWorkspace.fulfilled,
      (state, action: PayloadAction<{ projects: Project[]; workspace: Workspace }, string, { arg: string }>) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.lastFetchedWorkspaceId = action.meta.arg;
      }
    )
    .addCase(fetchProjectsByWorkspace.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(createProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(
      createProject.fulfilled,
      (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects.unshift(action.payload); // Add new project to the start
      }
    )
    .addCase(createProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(deleteProjectThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteProjectThunk.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.projects = state.projects.filter(p => p._id !== action.payload);
    })
    .addCase(deleteProjectThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      })
    .addCase(fetchProjectDetails.fulfilled, (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      } else {
        state.projects.unshift(action.payload);
      }
    })
    .addMatcher(
      (action) => [updateProjectThunk.fulfilled.type, addProjectMemberThunk.fulfilled.type].includes(action.type),
      (state, action: PayloadAction<Project>) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      }
    )
    .addMatcher(
      (action) => [updateProjectThunk.pending.type, addProjectMemberThunk.pending.type].includes(action.type), 
      (state) => {
        state.loading = true;
      }
    )
    .addMatcher(
      (action) => [updateProjectThunk.rejected.type, addProjectMemberThunk.rejected.type].includes(action.type),
      (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );

  },
});

export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
