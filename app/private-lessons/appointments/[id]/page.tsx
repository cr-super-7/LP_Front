"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import Background from "../../../components/layout/Background";
import Footer from "../../../components/layout/Footer";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getBookingById } from "../../../store/api/bookingApi";
import BookingDetailsContent from "../../../components/privateLessons/instructor/BookingDetailsContent";

export default function AppointmentDetailsPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const bookingId = params?.id as string;
  const { currentBooking, isLoading } = useAppSelector((s) => s.booking);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const isInstructor = user?.role === "instructor" || user?.role === "teacher";

  useEffect(() => {
    if (!bookingId) return;
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.replace("/login");
      return;
    }
    if (!isInstructor) {
      toast.error(language === "ar" ? "هذه الصفحة للمدرس فقط" : "This page is for instructors only");
      router.replace("/private-lessons/appointments");
    }
  }, [bookingId, isAuthenticated, isInstructor, language, router]);

  useEffect(() => {
    if (!bookingId || !isAuthenticated || !isInstructor) return;
    getBookingById(bookingId, dispatch).catch((e) => {
      console.error("Failed to load booking:", e);
    });
  }, [bookingId, dispatch, isAuthenticated, isInstructor]);

  if (!bookingId) {
    return (
      <div className={`relative min-h-screen overflow-x-hidden ${theme === "dark" ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950" : "bg-linear-to-b from-white via-gray-50 to-white"}`}>
        <Background />
        <div className="relative z-10">
          <Sidebar />
          <Navbar />
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "معرف الحجز غير موجود" : "Booking ID not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`relative min-h-screen overflow-x-hidden ${theme === "dark" ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950" : "bg-linear-to-b from-white via-gray-50 to-white"}`}>
        <Background />
        <div className="relative z-10">
          <Sidebar />
          <Navbar />
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]`}>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </main>
        </div>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className={`relative min-h-screen overflow-x-hidden ${theme === "dark" ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950" : "bg-linear-to-b from-white via-gray-50 to-white"}`}>
        <Background />
        <div className="relative z-10">
          <Sidebar />
          <Navbar />
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "الحجز غير موجود" : "Booking not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${theme === "dark" ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950" : "bg-linear-to-b from-white via-gray-50 to-white"}`}>
      <Background />
      <div className="relative z-10">
        <Sidebar />
        <Navbar />
        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16`}>
          <BookingDetailsContent booking={currentBooking} />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

