"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import type { Notification } from "../../store/interface/notificationInterface";
import {
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  FileText,
  Calendar,
  ShoppingCart,
  UserCheck,
  Bell,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Get icon based on notification type
  const getNotificationIcon = () => {
    if (notification.type.includes("approved")) {
      return (
        <CheckCircle
          className={`h-5 w-5 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
          
        />
      );
    } else if (notification.type.includes("rejected")) {
      return (
        <XCircle
          className={`h-5 w-5 ${
            theme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        />
      );
    } else if (notification.type.includes("review")) {
      return (
        <Star
          className={`h-5 w-5 ${
            theme === "dark" ? "text-yellow-400" : "text-yellow-600"
          }`}
          
        />
      );
    } else if (notification.type.includes("enrollment")) {
      return (
        <div className="relative">
          <div
            className={`h-5 w-5 rounded-full ${
              theme === "dark" ? "bg-blue-400" : "bg-blue-600"
            }`}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              theme === "dark" ? "text-white" : "text-white"
            }`}
          >
            <span className="text-xs font-bold">👤</span>
          </div>
        </div>
      );
    } else if (notification.type.includes("assignment")) {
      return (
        <FileText
          className={`h-5 w-5 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
      );
    } else if (notification.type.includes("message")) {
      return (
        <MessageSquare
          className={`h-5 w-5 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
      );
    } else if (notification.type.includes("booking") || notification.type.includes("enrollment")) {
      return (
        <Calendar
          className={`h-5 w-5 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
      );
    } else if (notification.type.includes("order")) {
      return (
        <ShoppingCart
          className={`h-5 w-5 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
      );
    } else if (notification.type.includes("consultation")) {
      return (
        <UserCheck
          className={`h-5 w-5 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
      );
    } else {
      return (
        <Bell
          className={`h-5 w-5 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
      );
    }
  };

  // Format time ago
  const formatTimeAgo = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return language === "ar" ? `${diffInSeconds} ثانية` : `${diffInSeconds} sec ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return language === "ar" ? `${minutes} دقيقة` : `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return language === "ar" ? `${hours} ساعة` : `${hours} hour ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return language === "ar" ? `${days} يوم` : `${days} day ago`;
    }
  };

  const message = language === "ar" ? notification.message.ar : notification.message.en;

  return (
    <div
      className={`p-4 rounded-lg ${
        theme === "dark"
          ? "bg-blue-800/50"
          : "bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{getNotificationIcon()}</div>
        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          <p
            className={`text-sm ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {message}
          </p>
          <p
            className={`text-xs whitespace-nowrap ${
              theme === "dark" ? "text-blue-300" : "text-gray-500"
            }`}
          >
            {formatTimeAgo(notification.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
