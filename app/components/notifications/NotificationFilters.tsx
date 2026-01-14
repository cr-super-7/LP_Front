"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Filter, ChevronDown } from "lucide-react";

interface NotificationFiltersProps {
  filter: "all" | "unread" | "read";
  onFilterChange: (filter: "all" | "unread" | "read") => void;
}

export default function NotificationFilters({
  filter,
  onFilterChange,
}: NotificationFiltersProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter
          className={`h-5 w-5 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-blue-200" : "text-gray-700"
          }`}
        >
          {language === "ar" ? "فلترة" : "Filter"}
        </span>
      </div>
      <div className="relative">
        <select
          value={filter}
          onChange={(e) =>
            onFilterChange(e.target.value as "all" | "unread" | "read")
          }
          className={`appearance-none px-4 py-2 pr-10 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-blue-800/30 border-blue-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
        >
          <option value="all">
            {language === "ar" ? "جميع الإشعارات" : "All Notifications"}
          </option>
          <option value="unread">
            {language === "ar" ? "غير المقروءة" : "Unread"}
          </option>
          <option value="read">
            {language === "ar" ? "المقروءة" : "Read"}
          </option>
        </select>
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
            theme === "dark" ? "text-blue-300" : "text-gray-500"
          }`}
        />
      </div>
    </div>
  );
}
