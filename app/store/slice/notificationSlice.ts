import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationState } from "../interface/notificationInterface";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  total: 0,
  hasMore: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = [...state.notifications, ...action.payload];
    },
    setNotificationsData: (
      state,
      action: PayloadAction<{
        notifications: Notification[];
        total: number;
        unreadCount: number;
        hasMore: boolean;
      }>
    ) => {
      state.notifications = action.payload.notifications;
      state.total = action.payload.total;
      state.unreadCount = action.payload.unreadCount;
      state.hasMore = action.payload.hasMore;
      state.isLoading = false;
      state.error = null;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n._id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.total = 0;
      state.hasMore = false;
    },
    resetNotificationState: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
      state.isLoading = false;
      state.total = 0;
      state.hasMore = false;
    },
    addNewNotification: (state, action: PayloadAction<Notification>) => {
      // Add new notification at the beginning of the array
      const existingIndex = state.notifications.findIndex(
        (n) => n._id === action.payload._id
      );
      if (existingIndex === -1) {
        state.notifications = [action.payload, ...state.notifications];
        state.total += 1;
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setNotifications,
  addNotifications,
  setNotificationsData,
  setUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  resetNotificationState,
  addNewNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
