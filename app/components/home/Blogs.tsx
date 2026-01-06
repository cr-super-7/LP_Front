"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getBlogs } from "../../store/api/blogApi";
import type { Blog } from "../../store/interface/blogInterface";

export default function Blogs() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { blogs, isLoading, error } = useAppSelector((state) => state.blog);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        await getBlogs({ page: 1, limit: 10, sort: "-createdAt" }, dispatch);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      }
    };

    loadBlogs();
  }, [dispatch]);

  const getLocalizedTitle = (blog: Blog): string => {
    return language === "ar" ? blog.title.ar : blog.title.en;
  };

  const getLocalizedDescription = (blog: Blog): string => {
    return language === "ar" ? blog.description.ar : blog.description.en;
  };

  return (
    <section className="px-4 md:px-8 py-8 md:py-16">
      <div className="flex flex-col items-center gap-6 md:gap-8">
        <h2
          className={`text-2xl md:text-3xl lg:text-4xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {t("blogs.title")}
        </h2>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            className={`rounded-lg px-4 py-3 ${
              theme === "dark" ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {/* Blog cards */}
        {!isLoading && !error && (
          <>
            {blogs.length === 0 ? (
              /* Empty state with animation */
              <div className="w-full max-w-2xl mx-auto">
                <div
                  className={`relative overflow-hidden rounded-3xl shadow-2xl p-8 md:p-12 ${
                    theme === "dark"
                      ? "bg-linear-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80 border border-blue-800/50"
                      : "bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50"
                  } backdrop-blur-sm`}
                >
                  {/* Animated background elements */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                      className={`absolute -left-20 -top-20 h-40 w-40 rounded-full blur-3xl opacity-40 animate-pulse ${
                        theme === "dark" ? "bg-blue-500" : "bg-blue-300"
                      }`}
                    />
                    <div
                      className={`absolute -right-20 top-20 h-48 w-48 rounded-full blur-3xl opacity-40 animate-pulse delay-300 ${
                        theme === "dark" ? "bg-indigo-500" : "bg-indigo-300"
                      }`}
                      style={{ animationDelay: "1s" }}
                    />
                    <div
                      className={`absolute bottom-10 left-1/2 h-32 w-32 rounded-full blur-3xl opacity-30 animate-pulse delay-700 ${
                        theme === "dark" ? "bg-purple-500" : "bg-purple-300"
                      }`}
                      style={{ animationDelay: "2s" }}
                    />
                  </div>

                  <div className="relative flex flex-col items-center gap-6 text-center">
                    {/* Animated icon */}
                    <div className="relative">
                      <div
                        className={`absolute inset-0 rounded-full blur-xl ${
                          theme === "dark"
                            ? "bg-blue-500/50 animate-ping"
                            : "bg-blue-400/50 animate-ping"
                        }`}
                        style={{ animationDuration: "2s" }}
                      />
                      <div
                        className={`relative flex h-24 w-24 items-center justify-center rounded-full ${
                          theme === "dark"
                            ? "bg-linear-to-br from-blue-500 to-indigo-600"
                            : "bg-linear-to-br from-blue-400 to-indigo-500"
                        } shadow-2xl`}
                      >
                        <BookOpen
                          className={`h-12 w-12 ${
                            theme === "dark" ? "text-white" : "text-white"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Sparkles animation */}
                    <div className="absolute top-8 right-8">
                      <Sparkles
                        className={`h-6 w-6 animate-bounce ${
                          theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                        }`}
                        style={{ animationDelay: "0.5s" }}
                      />
                    </div>
                    <div className="absolute top-12 left-8">
                      <Sparkles
                        className={`h-5 w-5 animate-bounce ${
                          theme === "dark" ? "text-pink-400" : "text-pink-500"
                        }`}
                        style={{ animationDelay: "1s" }}
                      />
                    </div>
                    <div className="absolute bottom-8 right-12">
                      <Sparkles
                        className={`h-4 w-4 animate-bounce ${
                          theme === "dark" ? "text-cyan-400" : "text-cyan-500"
                        }`}
                        style={{ animationDelay: "1.5s" }}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3
                        className={`text-2xl md:text-3xl font-bold ${
                          theme === "dark" ? "text-white" : "text-blue-950"
                        }`}
                      >
                        {language === "ar"
                          ? "لا توجد مدونات متاحة حالياً"
                          : "No Blogs Available Yet"}
                      </h3>
                      <p
                        className={`text-base md:text-lg max-w-md mx-auto ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {language === "ar"
                          ? "نعمل على إضافة محتوى جديد ومثير للاهتمام. تحقق مرة أخرى قريباً!"
                          : "We're working on adding new and exciting content. Check back soon!"}
                      </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="flex gap-2 mt-4">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                        } animate-bounce`}
                        style={{ animationDelay: "0s" }}
                      />
                      <div
                        className={`h-2 w-2 rounded-full ${
                          theme === "dark" ? "bg-indigo-400" : "bg-indigo-500"
                        } animate-bounce`}
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className={`h-2 w-2 rounded-full ${
                          theme === "dark" ? "bg-purple-400" : "bg-purple-500"
                        } animate-bounce`}
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
                {blogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blogs/${blog._id}`}
                    className={`flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      theme === "dark"
                        ? "bg-blue-900/50 backdrop-blur-sm"
                        : "bg-white/80 backdrop-blur-sm"
                    }`}
                  >
                    {/* Blog image */}
                    <div className="relative h-40 md:h-48 w-full">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={getLocalizedTitle(blog)}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                          <div className="h-24 w-24 md:h-32 md:w-32 rounded-lg bg-white/20"></div>
                        </div>
                      )}
                    </div>

                    {/* Blog content */}
                    <div className="flex flex-col gap-2 md:gap-3 p-4 md:p-6">
                      <h3
                        className={`text-lg md:text-xl font-semibold line-clamp-2 ${
                          theme === "dark" ? "text-white" : "text-blue-950"
                        }`}
                      >
                        {getLocalizedTitle(blog)}
                      </h3>
                      <p
                        className={`text-xs md:text-sm leading-relaxed line-clamp-3 ${
                          theme === "dark" ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {getLocalizedDescription(blog)}
                      </p>
                      {blog.author && (
                        <div className="flex items-center gap-2 mt-2">
                          <p
                            className={`text-xs ${
                              theme === "dark" ? "text-blue-300" : "text-blue-600"
                            }`}
                          >
                            {language === "ar" ? "بواسطة: " : "By: "}
                            {blog.author.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

