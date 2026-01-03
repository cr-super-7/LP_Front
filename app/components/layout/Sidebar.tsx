"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Sidebar() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const pathname = usePathname();

  const menuItems = [
    { key: "home", href: "/", icon: "🏠" },
    { key: "category", href: "/courses", icon: "📚" },
    { key: "myCourses", href: "/courses/my-courses", icon: "🎓" },
    { key: "liked", href: "/courses/liked", icon: "❤️" },
    { key: "profile", href: "/courses/profile", icon: "👤" },
    { key: "help", href: "/courses/help", icon: "❓" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 z-40 transition-all duration-300 ${
        theme === "dark" ? "bg-blue-950" : "bg-white"
      } border-r ${theme === "dark" ? "border-blue-800" : "border-gray-200"}`}
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-2xl font-bold">
            <span className="text-blue-400">LP</span>
            <span className={theme === "dark" ? "text-white" : "text-blue-950"}> Company</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/courses" && pathname?.startsWith("/courses"));
              return (
                <li key={item.key}>
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
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{t(`sidebar.${item.key}`)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

