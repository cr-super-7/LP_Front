"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import Background from "../../../components/layout/Background";
import Footer from "../../../components/layout/Footer";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getPrivateLessonById } from "../../../store/api/privateLessonApi";
import PrivateLessonInstructorDetailsContent from "../../../components/privateLessons/instructor/PrivateLessonInstructorDetailsContent";

export default function InstructorPrivateLessonDetailPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hasShownOwnershipError = useRef(false);

  const lessonId = params?.id as string;
  const { currentPrivateLesson, isLoading } = useAppSelector((state) => state.privateLesson);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isInstructor = user?.role === "instructor" || user?.role === "teacher";

  // Guard: instructor only
  useEffect(() => {
    if (!lessonId) return;

    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.replace("/login");
      return;
    }

    if (!isInstructor) {
      toast.error(language === "ar" ? "هذه الصفحة للمدرس فقط" : "This page is for instructors only");
      router.replace(`/private-lessons/${lessonId}`);
    }
  }, [isAuthenticated, isInstructor, language, lessonId, router]);

  // Fetch lesson only when authorized
  useEffect(() => {
    if (!lessonId || !isAuthenticated || !isInstructor) return;
    getPrivateLessonById(lessonId, dispatch).catch((error) => {
      console.error("Failed to load private lesson:", error);
    });
  }, [dispatch, isAuthenticated, isInstructor, lessonId]);

  // Guard: make sure instructor owns this lesson (best-effort client-side)
  useEffect(() => {
    if (!currentPrivateLesson || !isAuthenticated || !isInstructor) return;

    const userId = user?._id || user?.id;
    type InstructorRef =
      | string
      | {
          _id?: string;
          user?: string | { _id?: string; id?: string };
        };

    const instructor = currentPrivateLesson.instructor as InstructorRef;

    const candidateIds: string[] = [];
    if (typeof instructor === "string") {
      candidateIds.push(instructor);
    } else if (instructor) {
      if (typeof instructor._id === "string") candidateIds.push(instructor._id);

      const u = instructor.user;
      if (typeof u === "string") candidateIds.push(u);
      else if (u && typeof u._id === "string") candidateIds.push(u._id);
      else if (u && typeof u.id === "string") candidateIds.push(u.id);
    }

    const normalizedCandidateIds = candidateIds.filter(Boolean);

    // If we can't determine IDs, don't block to avoid false negatives.
    if (!userId || normalizedCandidateIds.length === 0) return;

    const isOwner = normalizedCandidateIds.includes(userId);

    if (!isOwner && !hasShownOwnershipError.current) {
      hasShownOwnershipError.current = true;
      toast.error(language === "ar" ? "لا يمكنك عرض درس ليس تابعًا لك" : "You can't view a lesson that isn't yours");
      router.replace("/private-lessons/my-lessons");
    }
  }, [currentPrivateLesson, isAuthenticated, isInstructor, language, router, user?._id, user?.id]);

  if (!lessonId) {
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
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "معرف الدرس غير موجود" : "Lesson ID not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
          <main
            className={`${isRTL ? "mr-64" : "ml-64"} mt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]`}
          >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </main>
        </div>
      </div>
    );
  }

  if (!currentPrivateLesson) {
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
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "الدرس غير موجود" : "Lesson not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16`}>
          <PrivateLessonInstructorDetailsContent lesson={currentPrivateLesson} />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

