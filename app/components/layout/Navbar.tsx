"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector } from "../../store/hooks";
import LanguageSelector from "../home/LanguageSelector";
import ThemeToggle from "../home/ThemeToggle";
import LoginModal from "../auth/LoginModal";
import type { RootState } from "../../store/store";
import { Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../store/hooks";
import { getUnreadCount } from "../../store/api/notificationApi";
import { getCart } from "../../store/api/cartApi";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

export default function Navbar() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const { unreadCount } = useAppSelector((state: RootState) => state.notification);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Initialize Socket.IO connection for real-time notifications
  useNotificationSocket();

  // Check if user is a teacher/instructor
  const isTeacher = user?.role === "instructor";

  // Fix hydration mismatch by only showing auth-dependent content after mount
  // This pattern is necessary in Next.js to prevent SSR/client mismatch
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Load unread count and cart count when authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      const loadUnreadCount = async () => {
        try {
          await getUnreadCount(dispatch);
        } catch (error) {
          console.error("Failed to load unread count:", error);
        }
      };
      loadUnreadCount();

      // Load cart count (only for students)
      if (!isTeacher) {
        const loadCartCount = async () => {
          try {
            const cart = await getCart(dispatch);
            setCartCount(cart.items?.length || 0);
          } catch (error) {
            // Cart might be empty or not available
            setCartCount(0);
          }
        };
        loadCartCount();
      }

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount();
        if (!isTeacher) {
          getCart(dispatch)
            .then((cart) => setCartCount(cart.items?.length || 0))
            .catch(() => setCartCount(0));
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [mounted, isAuthenticated, dispatch, isTeacher]);

  return (
    <nav
      className={`fixed top-0 h-16 z-30 flex items-center justify-between px-6 border-b gap-4 ${
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
        {/* Hide Cart icon if user is a teacher/instructor - Only render after mount to prevent hydration mismatch */}
        {mounted && !isTeacher && (
          <button
            onClick={() => router.push("/cart")}
            className={`p-2 rounded-lg transition-colors relative ${
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
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-semibold rounded-full border-2 bg-red-500 text-white border-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        )}
        {mounted && isAuthenticated && (
          <button
            onClick={() => router.push("/notifications")}
            className={`p-2 rounded-lg transition-colors relative ${
              theme === "dark" ? "hover:bg-blue-900" : "hover:bg-gray-100"
            }`}
            aria-label="Notifications"
          >
            <Bell className={`h-5 w-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
            {unreadCount > 0 ? (
              <span
                className={`absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-semibold rounded-full border-2 bg-red-500 text-white ${
                  theme === "dark" ? "border-blue-950" : "border-white"
                }`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        )}
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

