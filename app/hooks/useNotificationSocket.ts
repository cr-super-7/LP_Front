"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addNewNotification,
  markNotificationAsRead,
  markAllAsRead,
} from "../store/slice/notificationSlice";
import type { Notification } from "../store/interface/notificationInterface";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getNotificationSocketManager,
  NotificationSocketManager,
} from "../socket/notificationSocket";

export const useNotificationSocket = () => {
  const dispatch = useAppDispatch();
  const { language } = useLanguage();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const socketManagerRef = useRef<NotificationSocketManager | null>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if user is not authenticated
      if (socketManagerRef.current) {
        socketManagerRef.current.disconnect();
        socketManagerRef.current = null;
      }
      return;
    }

    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return;
    }

    // Get socket manager instance
    const socketManager = getNotificationSocketManager();
    socketManagerRef.current = socketManager;

    // Connect to socket
    socketManager.connect(token);

    // Register event handlers and store cleanup functions
    const cleanupFunctions: (() => void)[] = [];

    // Handle new notification
    const unsubscribeNotification = socketManager.onNotification(
      (notification: Notification) => {
        // Add notification to Redux store
        dispatch(addNewNotification(notification));

        // Show toast notification (disabled for professor inquiry routes)
        const shouldMuteToast =
          typeof pathname === "string" && pathname.startsWith("/inquiry_teacher");

        if (!shouldMuteToast) {
          const title =
            language === "ar" ? notification.title.ar : notification.title.en;
          const message =
            language === "ar" ? notification.message.ar : notification.message.en;

          toast.success(`${title}\n${message}`, {
            duration: 5000,
          });
        }
      }
    );
    cleanupFunctions.push(unsubscribeNotification);

    // Handle notification marked as read
    const unsubscribeMarkedRead = socketManager.onMarkedRead(
      (data: { notificationId: string; isRead: boolean }) => {
        dispatch(markNotificationAsRead(data.notificationId));
      }
    );
    cleanupFunctions.push(unsubscribeMarkedRead);

    // Handle all notifications marked as read
    const unsubscribeAllMarkedRead = socketManager.onAllMarkedRead(
      (data: { success: boolean }) => {
        if (data.success) {
          dispatch(markAllAsRead());
        }
      }
    );
    cleanupFunctions.push(unsubscribeAllMarkedRead);

    // Handle errors
    const unsubscribeError = socketManager.onError(
      (error: { message: string; error?: string }) => {
        toast.error(error.message || "An error occurred");
      }
    );
    cleanupFunctions.push(unsubscribeError);

    cleanupRef.current = cleanupFunctions;

    // Cleanup on unmount
    return () => {
      // Unsubscribe from all events
      cleanupRef.current.forEach((cleanup) => cleanup());
      cleanupRef.current = [];

      // Disconnect socket if this is the last component using it
      // Note: In a singleton pattern, you might want to keep the connection alive
      // and only disconnect when all components are unmounted
      // For now, we'll keep it connected as long as user is authenticated
    };
  }, [isAuthenticated, dispatch, language, pathname]);

  // Function to mark notification as read via socket
  const markAsRead = (notificationId: string) => {
    if (socketManagerRef.current) {
      socketManagerRef.current.markAsRead(notificationId);
    }
  };

  // Function to mark all notifications as read via socket
  const markAllAsReadSocket = () => {
    if (socketManagerRef.current) {
      socketManagerRef.current.markAllAsRead();
    }
  };

  return {
    markAsRead,
    markAllAsReadSocket,
    isConnected: socketManagerRef.current?.isConnected() || false,
  };
};
