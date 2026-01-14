"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
  total: number;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
}

export default function NotificationHeader({
  unreadCount,
  total,
  onMarkAllAsRead,
  onDeleteAll,
}: NotificationHeaderProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Bell
          className={`h-6 w-6 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
        <h1
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {language === "ar" ? "الإشعارات" : "Notifications"}
        </h1>
        {unreadCount > 0 && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              theme === "dark"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-700"
            }`}
          >
            {unreadCount} {language === "ar" ? "جديد" : "new"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {total} {language === "ar" ? "إشعار" : "notification"}
          {total !== 1 ? (language === "ar" ? "ات" : "s") : ""}
        </span>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <CheckCheck className="h-4 w-4" />
            <span>{language === "ar" ? "تحديد الكل كمقروء" : "Mark all as read"}</span>
          </button>
        )}

        {total > 0 && (
          <button
            onClick={onDeleteAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-red-600/80 hover:bg-red-700 text-white"
                : "bg-red-50 hover:bg-red-100 text-red-600"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>{language === "ar" ? "حذف الكل" : "Delete all"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
