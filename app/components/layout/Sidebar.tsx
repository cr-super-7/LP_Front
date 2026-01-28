"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slice/authSlice";
import { getCategories } from "../../store/api/categoryApi";
import type { RootState } from "../../store/store";
import type { Category } from "../../store/interface/categoryInterface";
import {
  Home,
  Grid3x3,
  BookOpen,
  Heart,
  User,
  Package,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BarChart3,
  FileText,
  Megaphone,
  Building2,
  Search,
  Users,
  MessageSquare,
} from "lucide-react";

export default function Sidebar() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const isRTL = language === "ar";
  const [mounted, setMounted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fix hydration mismatch by only showing auth-dependent content after mount
  // This pattern is necessary in Next.js to prevent SSR/client mismatch
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories(dispatch);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, [dispatch]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const isStudent = user?.role === "student";
  const isInstructor = user?.role === "instructor";

  // Generate category subItems from API data
  const categorySubItems = categories.map((category) => {
    // Handle both LocalizedText and string name formats
    let categoryName: string;
    if (typeof category.name === "string") {
      categoryName = category.name;
    } else {
      categoryName = language === "ar" ? category.name.ar : category.name.en;
    }

    return {
      key: category._id,
      href: `/courses/category/${category._id}`,
      label: categoryName,
    };
  });

  // Student menu items
  const studentMenuItems = [
    {
      key: "home",
      href: "/courses",
      icon: Home,
      label: t("sidebar.home"),
    },
    {
      key: "category",
      href: "",
      icon: Grid3x3,
      label: t("sidebar.category"),
      hasSubmenu: true,
      subItems: categorySubItems.length > 0 
        ? categorySubItems 
        : [
            // Fallback to static items if categories are loading or empty
            { key: "webDevelopment", href: "/courses/web-development", label: t("sidebar.webDevelopment") },
            { key: "flutter", href: "/courses/flutter", label: t("sidebar.flutter") },
            { key: "uxUiDesign", href: "/courses/ux-ui-design", label: t("sidebar.uxUiDesign") },
            { key: "ai", href: "/courses/ai", label: t("sidebar.ai") },
          ],
    },
    {
      key: "myCourses",
      href: "/courses/my-courses",
      icon: BookOpen,
      label: t("sidebar.myCourses"),
    },
    {
      key: "myOrders",
      href: "/orders",
      icon: Package,
      label: language === "ar" ? "طلباتي" : "My Orders",
    },
    {
      key: "liked",
      href: "/courses/liked",
      icon: Heart,
      label: t("sidebar.liked"),
    },
    {
      key: "explore",
      href: "/explore",
      icon: Building2,
      label: language === "ar" ? "استكشف" : "Explore",
    },
    {
      key: "privateLessons",
      href: "/privet_lessons_student",
      icon: Users,
      label: language === "ar" ? "الدروس الخصوصية" : "Private Lessons",
    },
    {
      key: "researches",
      href: "/researches",
      icon: Search,
      label: language === "ar" ? "الأبحاث" : "Researches",
    },
    {
      key: "inquiry",
      href: "/inquiry",
      icon: MessageSquare,
      label: language === "ar" ? "الاستشارات" : "Inquiry",
    },
    {
      key: "profile",
      href: "/profile",
      icon: User,
      label: t("sidebar.profile"),
    },

  ];

  // Instructor menu items
  const instructorMenuItems = [
    {
      key: "courses",
      href: "",
      icon: BookOpen,
      label: t("sidebar.courses"),
      hasSubmenu: true,
      subItems: [
        { key: "coursesDashboard", href: "/courseDashboard", label: t("sidebar.coursesDashboard") },
        { key: "myCourses", href: "/myCoursesTeacher", label: t("sidebar.myCourses") },
      ],
    },
    {
      key: "privateLessons",
      href: "/private-lessons",
      icon: GraduationCap,
      label: t("sidebar.privateLessons"),
      hasSubmenu: true,
      subItems: [
        { key: "lessonsDashboard", href: "/private-lessons/dashboard", label: t("sidebar.lessonsDashboard") },
        { key: "myPrivateLessons", href: "/private-lessons/my-lessons", label: t("sidebar.myPrivateLessons") },
        { key: "myAppointments", href: "/private-lessons/appointments", label: t("sidebar.myAppointments") },
      ],
    },
    {
      key: "researches",
      href: "/researches",
      icon: FileText,
      label: t("sidebar.researches"),
      hasSubmenu: true,
      subItems: [
        { key: "researchesDashboard", href: "/researches/dashboard", label: t("sidebar.researchesDashboard") },
        { key: "myResearches", href: "/researches/my-researches", label: t("sidebar.myResearches") },
      ],
    },
    {
      key: "report",
      href: "/report",
      icon: BarChart3,
      label: t("sidebar.report"),
    },
    {
      key: "advertisements",
      href: "/advertisements",
      icon: Megaphone,
      label: t("sidebar.advertisements"),
      hasSubmenu: true,
      subItems: [
        { key: "myAdvertisements", href: "/advertisements/my-advertisements", label: t("sidebar.myAdvertisements") },
        { key: "createAdvertisement", href: "/advertisements/create", label: t("sidebar.createAdvertisement") },
      ],
    },
    {
      key: "inquiry",
      href: "/inquiry",
      icon: MessageSquare,
      label: language === "ar" ? "الاستشارات" : "Inquiry",
    },
    {
      key: "profile",
      href: "/profile",
      icon: User,
      label: t("sidebar.profile"),
    },
  
  ];

  const menuItems = mounted && isAuthenticated ? (isStudent ? studentMenuItems : isInstructor ? instructorMenuItems : []) : studentMenuItems;

  return (
    <aside
      className={`fixed top-0 h-full w-64 z-40 transition-all duration-300 ${
        theme === "dark" ? "bg-blue-950" : "bg-white"
      } ${isRTL ? "right-0 border-l border-blue-800/50" : "left-0 border-r border-blue-800/50"}`}
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
            <span className="text-blue-400">LP</span>
            <span className={theme === "dark" ? "text-white" : "text-blue-950"}> Company</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/courses" && pathname?.startsWith("/courses"));
              const isExpanded = expandedCategories.includes(item.key);
              const hasActiveSubItem = item.subItems?.some((subItem) => pathname === subItem.href);

              return (
                <li key={item.key}>
                  {item.hasSubmenu ? (
                    <>
                      <button
                        onClick={() => toggleCategory(item.key)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive || hasActiveSubItem
                            ? theme === "dark"
                              ? "bg-blue-900 text-blue-400"
                              : "bg-blue-50 text-blue-600"
                            : theme === "dark"
                            ? "text-gray-300 hover:bg-blue-900/50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} className="shrink-0" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={16} className="shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="shrink-0" />
                        )}
                      </button>
                      {isExpanded && item.subItems && (
                        <ul className={`mt-1 space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}>
                          {item.subItems.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <li key={subItem.key}>
                                <Link
                                  href={subItem.href}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                                    isSubActive
                                      ? theme === "dark"
                                        ? "text-blue-400"
                                        : "text-blue-600"
                                      : theme === "dark"
                                      ? "text-gray-400 hover:text-gray-300"
                                      : "text-gray-600 hover:text-gray-900"
                                  }`}
                                >
                                  <span className="w-1 h-1 rounded-full bg-current"></span>
                                  <span>{subItem.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? theme === "dark"
                            ? "bg-blue-900 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-blue-900/50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} className="shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer (Logout) */}
        <div className="mt-auto pt-4 border-t border-blue-800/50">
          {mounted && isAuthenticated && (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium mt-2 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <LogOut size={20} className="shrink-0" />
              <span>{t("sidebar.logout")}</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
