"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import type { Notification } from "../../store/interface/notificationInterface";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  groupedNotifications: Record<string, Notification[]>;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function NotificationList({
  groupedNotifications,
  hasMore,
  onLoadMore,
}: NotificationListProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto">
      <div
        className={`rounded-2xl p-6 min-h-[500px] ${
          theme === "dark"
            ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([groupKey, groupNotifications]) => (
            <div key={groupKey} className="space-y-3">
              <h3
                className={`text-sm font-semibold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {groupKey}
              </h3>
              <div className="space-y-2">
                {groupNotifications.map((notification) => (
                  <NotificationItem key={notification._id} notification={notification} />
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onLoadMore}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {language === "ar" ? "تحميل المزيد" : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
