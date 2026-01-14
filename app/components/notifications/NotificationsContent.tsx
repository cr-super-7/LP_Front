"use client";

import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getNotifications,
  getUnreadCount,
} from "../../store/api/notificationApi";
import type { Notification } from "../../store/interface/notificationInterface";
import NotificationList from "./NotificationList";
import NotificationEmptyState from "./NotificationEmptyState";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

export default function NotificationsContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { notifications, isLoading, hasMore } = useAppSelector(
    (state) => state.notification
  );

  // Initialize Socket.IO connection
  useNotificationSocket();

  const [filter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);
  const limit = 50;

  // Load notifications on mount and when filter/page changes
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await getNotifications(
          {
            isRead: filter === "all" ? undefined : filter === "read",
            limit,
            skip: (page - 1) * limit,
          },
          dispatch
        );
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();
  }, [dispatch, filter, page]);

  // Load unread count on mount
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        await getUnreadCount(dispatch);
      } catch (error) {
        console.error("Failed to load unread count:", error);
      }
    };

    loadUnreadCount();
  }, [dispatch]);

  // Filter notifications based on selected filter
  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    } else if (filter === "unread") {
      return notifications.filter((n) => !n.isRead);
    } else {
      return notifications.filter((n) => n.isRead);
    }
  }, [notifications, filter]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {};

    filteredNotifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      let groupKey = "";
      if (date >= today) {
        groupKey = language === "ar" ? "اليوم" : "Today";
      } else if (date >= yesterday) {
        groupKey = language === "ar" ? "أمس" : "Yesterday";
      } else if (date >= lastWeek) {
        groupKey = language === "ar" ? "الأسبوع الماضي" : "Last week";
      } else {
        groupKey = language === "ar" ? "أقدم" : "Older";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  }, [filteredNotifications, language]);

  return (
    <div className="p-6  min-h-[calc(100vh-12rem)]">
      {/* Content */}
      {isLoading && notifications.length === 0 ? (
        <div
          className={`text-center py-12 ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {language === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <NotificationList
          groupedNotifications={groupedNotifications}
          hasMore={hasMore}
          onLoadMore={() => {
            if (hasMore) {
              setPage((prev) => prev + 1);
            }
          }}
        />
      )}
    </div>
  );
}
