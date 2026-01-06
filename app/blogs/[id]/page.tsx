"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getBlogById } from "../../store/api/blogApi";

import Background from "../../components/layout/Background";
import Footer from "../../components/layout/Footer";
import type { Blog } from "../../store/interface/blogInterface";
import Header from "../../components/layout/Header";

export default function BlogDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { currentBlog, isLoading, error } = useAppSelector((state) => state.blog);

  const blogId = params?.id as string;

  useEffect(() => {
    if (blogId) {
      const loadBlog = async () => {
        try {
          await getBlogById(blogId, dispatch);
        } catch (err) {
          console.error("Failed to load blog:", err);
        }
      };
      loadBlog();
    }
  }, [blogId, dispatch]);

  const getLocalizedTitle = (blog: Blog): string => {
    return language === "ar" ? blog.title.ar : blog.title.en;
  };

  const getLocalizedDescription = (blog: Blog): string => {
    return language === "ar" ? blog.description.ar : blog.description.en;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        theme === "dark"
          ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950"
          : "bg-linear-to-b from-white via-gray-50 to-white"
      }`}
    >
      <Background />

      <div className="relative z-10">
        <Header />

        <main className={`mt-16 p-6`}>
          <div className="max-w-7xl mx-auto">
            {/* Back button */}
            <Link
              href="/"
              className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-blue-300 hover:bg-blue-900/50"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{language === "ar" ? "العودة" : "Back"}</span>
            </Link>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div
                className={`rounded-lg px-6 py-4 mb-6 ${
                  theme === "dark" ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-700"
                }`}
              >
                {error}
              </div>
            )}

            {/* Blog content */}
            {!isLoading && !error && currentBlog && (
              <article
                className={`rounded-3xl shadow-2xl overflow-hidden ${
                  theme === "dark"
                    ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                    : "bg-white/80 backdrop-blur-sm border border-gray-200"
                }`}
              >
                {/* Blog image */}
                <div className="relative h-64 md:h-96 w-full">
                  {currentBlog.image ? (
                    <Image
                      src={currentBlog.image}
                      alt={getLocalizedTitle(currentBlog)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                      <div className="h-32 w-32 rounded-lg bg-white/20"></div>
                    </div>
                  )}
                </div>

                {/* Blog content */}
                <div className="p-6 md:p-10">
                  {/* Title */}
                  <h1
                    className={`text-3xl md:text-4xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-blue-950"
                    }`}
                  >
                    {getLocalizedTitle(currentBlog)}
                  </h1>

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                    {currentBlog.author && (
                      <div
                        className={`flex items-center gap-2 ${
                          theme === "dark" ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>
                          {language === "ar" ? "بواسطة: " : "By: "}
                          {currentBlog.author.email}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex items-center gap-2 ${
                        theme === "dark" ? "text-blue-300" : "text-gray-600"
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(currentBlog.createdAt)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div
                    className={`prose prose-lg max-w-none ${
                      theme === "dark"
                        ? "prose-invert text-white/90"
                        : "text-gray-700"
                    }`}
                  >
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {getLocalizedDescription(currentBlog)}
                    </p>
                  </div>

                  {/* Author details */}
                  {currentBlog.author && (
                    <div
                      className={`mt-8 pt-8 border-t ${
                        theme === "dark" ? "border-blue-800" : "border-gray-200"
                      }`}
                    >
                      <h3
                        className={`text-xl font-semibold mb-4 ${
                          theme === "dark" ? "text-white" : "text-blue-950"
                        }`}
                      >
                        {language === "ar" ? "عن الكاتب" : "About the Author"}
                      </h3>
                      <div className="flex items-start gap-4">
                        {currentBlog.author.profilePicture && (
                          <div className="relative h-16 w-16 rounded-full overflow-hidden">
                            <Image
                              src={currentBlog.author.profilePicture}
                              alt={currentBlog.author.email}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-blue-950"
                            }`}
                          >
                            {currentBlog.author.email}
                          </p>
                          {currentBlog.author.bio && (
                            <p
                              className={`text-sm mt-1 ${
                                theme === "dark" ? "text-blue-200" : "text-gray-600"
                              }`}
                            >
                              {currentBlog.author.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

