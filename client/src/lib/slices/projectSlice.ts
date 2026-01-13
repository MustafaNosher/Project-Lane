import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/routes";
import type { Project, CreateProjectData } from "@/types/projectTypes";
import type { Workspace } from "@/types/workspaceTypes";

interface ProjectState {
  projects: Project[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

// Fetch projects by workspace ID
export const fetchProjectsByWorkspace = createAsyncThunk(
  "projects/fetchByWorkspace",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
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
      const response = await axios.post(
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
      const response = await axios.get(
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
      const response = await axios.patch(
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

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.projects = [];
      state.currentWorkspace = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProjectsByWorkspace
    builder
      .addCase(fetchProjectsByWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectsByWorkspace.fulfilled,
        (state, action: PayloadAction<{ projects: Project[]; workspace: Workspace }>) => {
          state.loading = false;
          state.projects = action.payload.projects;
          state.currentWorkspace = action.payload.workspace;
        }
      )
      .addCase(fetchProjectsByWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createProject
    builder
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
      });

    // fetchProjectDetails
    builder
      .addCase(fetchProjectDetails.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        } else {
          state.projects.unshift(action.payload);
        }
      });

    // updateProject
    builder
      .addCase(updateProjectThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProjectThunk.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
