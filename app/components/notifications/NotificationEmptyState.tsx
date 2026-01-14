"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Bell } from "lucide-react";

export default function NotificationEmptyState() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <Bell
            className={`h-20 w-20 mx-auto ${
              theme === "dark" ? "text-white" : "text-gray-400"
            }`}
            strokeWidth={1.5}
            fill="none"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
              theme === "dark" ? "bg-blue-700" : "bg-gray-300"
            }`}
          >
            <span
              className={`text-xs font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-600"
              }`}
            >
              0
            </span>
          </div>
        </div>
        <p
          className={`text-lg font-semibold mb-2 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {language === "ar" ? "لا توجد إشعارات جديدة" : "No New Notifications"}
        </p>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-white" : "text-gray-600"
          }`}
        >
          {language === "ar"
            ? "يبدو أنك على ما يرام. استمر في العمل الجيد!"
            : "Looks like you're all set. Keep up the great work!"}
        </p>
      </div>
    </div>
  );
}
