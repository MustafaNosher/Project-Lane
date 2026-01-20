import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/routes";
import axios from "axios";
import apiClient from "../apiClient";
import type { Task, CreateTaskData } from "@/types/taskTypes";
import { logoutUser } from "./authSlice";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  lastFetchedProjectId: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  lastFetchedProjectId: null,
};

// Fetch tasks by project ID
export const fetchProjectTasks = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/project/tasks/${projectId}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Fetch task by ID
export const fetchTaskByIdThunk = createAsyncThunk(
  "tasks/fetchById",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/task/${taskId}`
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch task"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/create",
  async (
    { projectId, taskData }: { projectId: string; taskData: CreateTaskData },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/task/create/${projectId}`,
        taskData
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to create task"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update task status
export const updateTaskStatusThunk = createAsyncThunk(
  "tasks/updateStatus",
  async (
    { taskId, status }: { taskId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE_URL}/task/${taskId}/status`,
        { status }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update task status"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update task title
export const updateTaskTitleThunk = createAsyncThunk(
  "tasks/updateTitle",
  async (
    { taskId, title }: { taskId: string; title: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE_URL}/task/${taskId}/title`,
        { title }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update title"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update task description
export const updateTaskDescriptionThunk = createAsyncThunk(
  "tasks/updateDescription",
  async (
    { taskId, description }: { taskId: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE_URL}/task/${taskId}/description`,
        { description }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update description"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update task priority
export const updateTaskPriorityThunk = createAsyncThunk(
  "tasks/updatePriority",
  async (
    { taskId, priority }: { taskId: string; priority: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE_URL}/task/${taskId}/priority`,
        { priority }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update priority"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Add subtask
export const addSubTaskThunk = createAsyncThunk(
  "tasks/addSubTask",
  async (
    { taskId, title }: { taskId: string; title: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/task/${taskId}/subtasks`,
        { title }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add subtask"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update subtask (toggle completion)
export const updateSubTaskThunk = createAsyncThunk(
  "tasks/updateSubTask",
  async (
    { taskId, subtaskId, completed }: { taskId: string; subtaskId: string; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE_URL}/task/${taskId}/subtasks/${subtaskId}`,
        { completed }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update subtask"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Update Task Assignees
export const updateTaskAssigneesThunk = createAsyncThunk(
  "tasks/updateAssignees",
  async (
    { taskId, assignees }: { taskId: string; assignees: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(
        `${API_BASE_URL}/task/${taskId}/assignees`,
        { assignees }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update assignees"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Add comment
export const addCommentThunk = createAsyncThunk(
  "tasks/addComment",
  async (
    { taskId, text }: { taskId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/task/${taskId}/comments`,
        { text }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add comment"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);


// Upload Attachment
export const uploadAttachmentThunk = createAsyncThunk(
  "tasks/uploadAttachment",
  async (
    { taskId, file }: { taskId: string; file: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("attachment", file);

      const response = await apiClient.post(
        `${API_BASE_URL}/task/${taskId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to upload attachment"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Fetch My Tasks
export const fetchMyTasksThunk = createAsyncThunk(
  "tasks/fetchMyTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/task/my-tasks`
      );
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch my tasks"
        );
      }
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
    updateTaskInState: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      } else {
        state.tasks.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.tasks = [];
      state.loading = false;
      state.error = null;
      state.lastFetchedProjectId = null;
    });

    // fetchProjectTasks
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectTasks.fulfilled,
        (state, action: PayloadAction<Task[], string, { arg: string }>) => {
          state.loading = false;
          state.tasks = action.payload;
          state.lastFetchedProjectId = action.meta.arg;
        }
      )
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createTask
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchMyTasks
    builder
      .addCase(fetchMyTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTasksThunk.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchMyTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Generic update for task updates (status, description, priority, subtasks, comments)
    builder.addMatcher(
      (action) =>
        [
          fetchTaskByIdThunk.fulfilled.type,
          updateTaskStatusThunk.fulfilled.type,
          updateTaskTitleThunk.fulfilled.type,
          updateTaskDescriptionThunk.fulfilled.type,
          updateTaskPriorityThunk.fulfilled.type,
          updateTaskAssigneesThunk.fulfilled.type,
          addSubTaskThunk.fulfilled.type,
          updateSubTaskThunk.fulfilled.type,
          addCommentThunk.fulfilled.type,
          uploadAttachmentThunk.fulfilled.type,
        ].includes(action.type),
      (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        } else {
          state.tasks.unshift(action.payload);
        }
      }
    );

  },
});

export const { clearTasks, updateTaskInState } = taskSlice.actions;
export default taskSlice.reducer;
