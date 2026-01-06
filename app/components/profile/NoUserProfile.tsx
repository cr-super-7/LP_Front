"use client";

import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import Background from "../layout/Background";
import Footer from "../layout/Footer";
import LoginModal from "../auth/LoginModal";

export default function NoUserProfile() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isRTL = language === "ar";

  const title =
    language === "ar"
      ? "لا يوجد مستخدم مسجل الدخول"
      : "No user is currently logged in";
  const description =
    language === "ar"
      ? "يبدو أنك لست مسجلاً حالياً. قم بتسجيل الدخول للوصول إلى صفحة البروفايل الخاصة بك ومتابعة دوراتك."
      : "It looks like you are not logged in. Please sign in to access your profile and continue your courses.";
  const buttonLabel =
    language === "ar" ? "تسجيل الدخول" : "Login to your account";

  const containerBg =
    theme === "dark" ? "bg-blue-950 text-white" : "bg-gray-50 text-slate-900";

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${containerBg}`}
    >
      <Background />

      <div className="relative z-10">
        <Sidebar />
        <Navbar />

        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
          <div className="max-w-4xl mx-auto">
            <section
              className={`w-full rounded-3xl border ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-900/70"
                  : "border-slate-200 bg-white/80"
              } p-8 sm:p-10 shadow-2xl backdrop-blur-sm`}
            >
              <div className="flex flex-col items-center gap-6 text-center">
                {/* Simple animation */}
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <span className="text-2xl font-bold">LP</span>
                  </div>
                </div>

                <div
                  className={`max-w-xl ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
                  <p className="mt-2 text-sm opacity-80">{description}</p>
                </div>

                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-blue-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  {buttonLabel}
                </button>
              </div>
            </section>
          </div>
        </main>

        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}