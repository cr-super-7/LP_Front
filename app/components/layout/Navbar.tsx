"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector } from "../../store/hooks";
import LanguageSelector from "../home/LanguageSelector";
import ThemeToggle from "../home/ThemeToggle";
import LoginModal from "../auth/LoginModal";
import type { RootState } from "../../store/store";
import { Search } from "lucide-react";

export default function Navbar() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const isRTL = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if user is a teacher/instructor
  const isTeacher = user?.role === "instructor";

  // Fix hydration mismatch by only showing auth-dependent content after mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className={`fixed top-0 h-16 z-30 flex items-center justify-between px-6 border-b ${
        isRTL ? "left-0 right-64" : "right-0 left-64"
      } ${
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
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Search className="h-4 w-4 text-gray-400" /></span>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        <LanguageSelector />
        {/* Hide Cart icon if user is a teacher/instructor */}
        {!isTeacher && (
          <button
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-blue-900" : "hover:bg-gray-100"
            }`}
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={theme === "dark" ? "text-white" : "text-gray-700"}
            >
              <path
                d="M1.66663 1.66406H3.11663C4.01663 1.66406 4.72496 2.43906 4.64996 3.33073L3.95829 11.6307C3.84163 12.9891 4.91662 14.1557 6.28329 14.1557H15.1583C16.3583 14.1557 17.4083 13.1724 17.5 11.9807L17.95 5.73073C18.05 4.3474 17 3.22239 15.6083 3.22239H4.84997"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5417 18.3333C14.117 18.3333 14.5833 17.867 14.5833 17.2917C14.5833 16.7164 14.117 16.25 13.5417 16.25C12.9664 16.25 12.5 16.7164 12.5 17.2917C12.5 17.867 12.9664 18.3333 13.5417 18.3333Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.87504 18.3333C7.45034 18.3333 7.91671 17.867 7.91671 17.2917C7.91671 16.7164 7.45034 16.25 6.87504 16.25C6.29974 16.25 5.83337 16.7164 5.83337 17.2917C5.83337 17.867 6.29974 18.3333 6.87504 18.3333Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 6.66406H17.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <button
          className={`p-2 rounded-lg transition-colors relative ${
            theme === "dark" ? "hover:bg-blue-900" : "hover:bg-gray-100"
          }`}
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={theme === "dark" ? "text-white" : "text-gray-700"}
          >
            <path
              d="M10 5.36719V8.14219"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M10.0167 1.66406C6.95004 1.66406 4.4667 4.1474 4.4667 7.21406V8.96406C4.4667 9.53073 4.23337 10.3807 3.9417 10.8641L2.88337 12.6307C2.23337 13.7224 2.68337 14.9391 3.88337 15.3391C7.8667 16.6641 12.175 16.6641 16.1584 15.3391C17.2834 14.9641 17.7667 13.6474 17.1584 12.6307L16.1 10.8641C15.8084 10.3807 15.575 9.5224 15.575 8.96406V7.21406C15.5667 4.16406 13.0667 1.66406 10.0167 1.66406Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M12.775 15.6797C12.775 17.2047 11.525 18.4547 9.99998 18.4547C9.24164 18.4547 8.54164 18.138 8.04164 17.638C7.54164 17.138 7.22498 16.438 7.22498 15.6797"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeMiterlimit="10"
            />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        {!mounted ? (
          // Show placeholder during SSR to prevent hydration mismatch
          <div className="w-20 h-10"></div>
        ) : !isAuthenticated ? (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            aria-label="Login"
          >
            {t("navbar.login")}
          </button>
        ) : null}
        <ThemeToggle />
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
}

