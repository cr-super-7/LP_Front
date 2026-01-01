"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Blogs() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const blogs = [
    {
      id: 1,
      titleKey: "blogs.blog1.title",
      snippetKey: "blogs.blog1.snippet",
      imageBg: "from-yellow-400 to-yellow-600",
    },
    {
      id: 2,
      titleKey: "blogs.blog2.title",
      snippetKey: "blogs.blog2.snippet",
      imageBg: "from-yellow-300 to-yellow-500",
    },
    {
      id: 3,
      titleKey: "blogs.blog3.title",
      snippetKey: "blogs.blog3.snippet",
      imageBg: "from-blue-300 to-blue-500",
    },
  ];

  return (
    <section className="px-4 md:px-8 py-8 md:py-16">
      <div className="flex flex-col items-center gap-6 md:gap-8">
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t("blogs.title")}</h2>

        {/* Blog cards */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex flex-col overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm"
            >
              {/* Blog image */}
              <div
                className={`h-40 md:h-48 w-full bg-linear-to-br ${blog.imageBg} flex items-center justify-center`}
              >
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-lg bg-white/20"></div>
              </div>

              {/* Blog content */}
              <div className="flex flex-col gap-2 md:gap-3 p-4 md:p-6">
                <h3 className={`text-lg md:text-xl font-semibold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t(blog.titleKey)}</h3>
                <p className={`text-xs md:text-sm leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-600"}`}>{t(blog.snippetKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

