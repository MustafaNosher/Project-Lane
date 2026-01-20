import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/routes";
import type { Notification, NotificationState } from "@/types/notificationTypes";
import apiClient from "../apiClient";

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/notification`);
            return response.data.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "Failed to fetch notifications");
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

export const markNotificationRead = createAsyncThunk(
    "notifications/markRead",
    async (notificationId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(
                `${API_BASE_URL}/notification/${notificationId}/read`,
                {}
            );
            return { notificationId, data: response.data.data };
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || "Failed to mark notification as read");
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.isLoading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const { notificationId } = action.payload;
                if (notificationId === "all") {
                    state.notifications.forEach(n => n.isRead = true);
                    state.unreadCount = 0;
                } else {
                    const notification = state.notifications.find(n => n._id === notificationId);
                    if (notification && !notification.isRead) {
                        notification.isRead = true;
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                }
            });
    }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
