"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import Background from "../../../components/layout/Background";
import Footer from "../../../components/layout/Footer";
import { useAppDispatch } from "../../../store/hooks";
import { getCourseById } from "../../../store/api/courseApi";
import { getLessonsByCourse, getLessonById } from "../../../store/api/lessonApi";
import type { Course } from "../../../store/interface/courseInterface";
import type { Lesson } from "../../../store/interface/lessonInterface";
import toast from "react-hot-toast";
import CourseWatchContent from "../../../components/courses/CourseWatchContent";

export default function CourseWatchPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      router.push("/courses");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const courseData = await getCourseById(courseId, dispatch);
        setCourse(courseData as unknown as Course);

        const lessonsData = await getLessonsByCourse(courseId, dispatch);
        setLessons(lessonsData);

        // Select first lesson by default
        if (lessonsData.length > 0) {
          const firstLesson = await getLessonById(lessonsData[0]._id, dispatch);
          setSelectedLesson(firstLesson);
        }
      } catch (error) {
        console.error("Failed to load course data:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل بيانات الدورة"
            : "Failed to load course data"
        );
        router.push(`/courses/${courseId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [courseId, dispatch, router, language]);

  const handleLessonSelect = async (lessonId: string) => {
    try {
      const lesson = await getLessonById(lessonId, dispatch);
      setSelectedLesson(lesson);
    } catch (error) {
      console.error("Failed to load lesson:", error);
      toast.error(
        language === "ar"
          ? "فشل تحميل الدرس"
          : "Failed to load lesson"
      );
    }
  };

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
          <main className={`${language === "ar" ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
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
          <main className={`${language === "ar" ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "الدورة غير موجودة" : "Course not found"}
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
        <main className={`${language === "ar" ? "mr-64" : "ml-64"} mt-16 p-6`}>
          <CourseWatchContent
            course={course}
            lessons={lessons}
            selectedLesson={selectedLesson}
            onLessonSelect={handleLessonSelect}
          />
        </main>
        <div className={`${language === "ar" ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
