"use client";

import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSelector from "../home/LanguageSelector";
import ThemeToggle from "../home/ThemeToggle";

export default function Navbar() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav
      className={`fixed top-0 right-0 left-64 h-16 z-30 flex items-center justify-between px-6 border-b ${
        theme === "dark" ? "bg-blue-950 border-blue-800" : "bg-white border-gray-200"
      }`}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder={t("navbar.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 pl-10 rounded-lg border ${
              theme === "dark"
                ? "bg-blue-900 border-blue-800 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <button
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark" ? "hover:bg-blue-900" : "hover:bg-gray-100"
          }`}
          aria-label="Cart"
        >
          <span className="text-xl">🛒</span>
        </button>
        <button
          className={`p-2 rounded-lg transition-colors relative ${
            theme === "dark" ? "hover:bg-blue-900" : "hover:bg-gray-100"
          }`}
          aria-label="Notifications"
        >
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark" ? "hover:bg-blue-900" : "hover:bg-gray-100"
          }`}
          aria-label="Profile"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            U
          </div>
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );
}

