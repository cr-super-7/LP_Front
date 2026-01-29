"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import Background from "../layout/Background";
import Footer from "../layout/Footer";
import InquiryTeacherContent from "./InquiryTeacherContent";
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";

 
export default function InquiryTeacherPageClient() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Guard: instructor-only
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    if (user?.role !== "instructor") {
      router.replace("/inquiry");
      return;
    }
    if (!user?.inquiry) {
      router.replace("/courseDashboard");
    }
  }, [mounted, isAuthenticated, user?.role, user?.inquiry, router]);

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
        <Sidebar />
        <Navbar />
        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
          <InquiryTeacherContent />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

