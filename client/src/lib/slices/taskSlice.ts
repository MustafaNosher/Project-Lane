import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/routes";
import type { Task, CreateTaskData } from "@/types/taskTypes";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks by project ID
export const fetchProjectTasks = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/project/tasks/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/task/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/task/create/${projectId}`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/task/${taskId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
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

// Update task description
export const updateTaskDescriptionThunk = createAsyncThunk(
  "tasks/updateDescription",
  async (
    { taskId, description }: { taskId: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/task/${taskId}/description`,
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/task/${taskId}/priority`,
        { priority },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/task/${taskId}/subtasks`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/task/${taskId}/subtasks/${subtaskId}`,
        { completed },
        { headers: { Authorization: `Bearer ${token}` } }
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

// Add comment
export const addCommentThunk = createAsyncThunk(
  "tasks/addComment",
  async (
    { taskId, text }: { taskId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/task/${taskId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("attachment", file);

      const response = await axios.post(
        `${API_BASE_URL}/task/${taskId}/attachments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    // fetchProjectTasks
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectTasks.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.loading = false;
          state.tasks = action.payload;
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

    // Generic update for task updates (status, description, priority, subtasks, comments)
    builder.addMatcher(
      (action) =>
        [
          fetchTaskByIdThunk.fulfilled.type,
          updateTaskStatusThunk.fulfilled.type,
          updateTaskDescriptionThunk.fulfilled.type,
          updateTaskPriorityThunk.fulfilled.type,
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

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
