import api from "../utils/api";
import {
  setLoading,
  setError,
  setNotificationsData,
  setUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} from "../slice/notificationSlice";
import { AppDispatch } from "../store";
import type {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
} from "../interface/notificationInterface";
import toast from "react-hot-toast";

// Define error response interface
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

interface GetNotificationsParams {
  isRead?: boolean;
  limit?: number;
  skip?: number;
}

const getNotifications = async (
  params: GetNotificationsParams = {},
  dispatch: AppDispatch
): Promise<NotificationsResponse> => {
  try {
    dispatch(setLoading(true));

    const queryParams = new URLSearchParams();
    if (params.isRead !== undefined) {
      queryParams.append("isRead", params.isRead.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params.skip !== undefined) {
      queryParams.append("skip", params.skip.toString());
    }

    const { data } = await api.get<NotificationsResponse>(
      `/notifications?${queryParams.toString()}`
    );

    dispatch(
      setNotificationsData({
        notifications: data.notifications,
        total: data.total,
        unreadCount: data.unreadCount,
        hasMore: data.hasMore,
      })
    );

    dispatch(setLoading(false));
    return data;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch notifications";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const getUnreadCount = async (dispatch: AppDispatch): Promise<number> => {
  try {
    const { data } = await api.get<UnreadCountResponse>("/notifications/unread-count");
    dispatch(setUnreadCount(data.unreadCount));
    return data.unreadCount;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch unread count";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  }
};

const markAsRead = async (
  notificationId: string,
  dispatch: AppDispatch
): Promise<Notification> => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.put<{ message: string; notification: Notification }>(
      `/notifications/${notificationId}/read`
    );

    dispatch(markNotificationAsRead(notificationId));
    dispatch(setLoading(false));
    return data.notification;
  } catch (error: unknown) {
    let errorMessage = "Failed to mark notification as read";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const markAllNotificationsAsRead = async (dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));

    await api.put("/notifications/all/read");

    dispatch(markAllAsRead());
    dispatch(setLoading(false));
    toast.success("All notifications marked as read");
  } catch (error: unknown) {
    let errorMessage = "Failed to mark all notifications as read";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const deleteNotification = async (
  notificationId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setLoading(true));

    await api.delete(`/notifications/${notificationId}`);

    dispatch(removeNotification(notificationId));
    dispatch(setLoading(false));
    toast.success("Notification deleted successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to delete notification";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const deleteAllNotifications = async (dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));

    await api.delete("/notifications");

    dispatch(clearAllNotifications());
    dispatch(setLoading(false));
    toast.success("All notifications deleted successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to delete all notifications";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};
