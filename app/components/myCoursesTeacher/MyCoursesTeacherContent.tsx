"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Pencil,
  Paperclip,
  Globe,
  BookOpen,
  Clock,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
} from "lucide-react";
import CourseTypeModal from "./CourseTypeModal";
import UpdateCourseModal from "./UpdateCourseModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getTeacherCourses, deleteCourse } from "../../store/api/courseApi";
import type { Course } from "../../store/interface/courseInterface";

export default function MyCoursesTeacherContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { courses, isLoading } = useAppSelector((state) => state.course);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Load teacher courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        await getTeacherCourses(dispatch);
      } catch (error) {
        console.error("Failed to load teacher courses:", error);
      }
    };
    loadCourses();
  }, [dispatch]);

  // Handle delete course
  const handleDelete = async (courseId: string) => {
   
      try {
        await deleteCourse(courseId, dispatch);
        await getTeacherCourses(dispatch); // Reload courses after deletion
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    
  };

  // Separate published and unpublished courses
  // Note: API already returns only the teacher's courses, so no need to filter by teacher
  const { publishedCourses, unpublishedCourses } = useMemo(() => {
    // Separate published and unpublished courses
    const published = courses.filter((course) => course.isPublished === true);
    const unpublished = courses.filter((course) => course.isPublished === false || course.isPublished === undefined);

    return {
      publishedCourses: published,
      unpublishedCourses: unpublished,
    };
  }, [courses]);

  return (
    <div className="space-y-8 p-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-800/30">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <Image
            src="/myCourse.jpg"
            alt="Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        
        </div>
        
        {/* Dark Blue Overlay */}
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-gray-700/80" : "bg-gray-300/80"}`}></div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {/* Pencil Icon - Yellow with red eraser */}
                <div className="relative">
                  <Pencil className="h-6 w-6 text-yellow-400" strokeWidth={2.5} />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {language === "ar"
                    ? "شارك خبرتك. ألهم العقول."
                    : "Share Your Expertise. Inspire Minds."}
                </h1>
              </div>
              <p className={`text-lg max-w-2xl ${theme === "dark" ? "text-white/90" : "text-blue-950/90"}`}>
                {language === "ar"
                  ? "أنشئ دورتك التالية وساعد المتعلمين على النمو — سواء كانت دورة سريعة أو برنامج كامل، أنت على بعد خطوات قليلة من إحداث تأثير."
                  : "Create your next course and help learners grow — whether it's a quick tutorial or a full program, you're just a few steps away from making an impact."}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <span>{language === "ar" ? "إنشاء دورة جديدة" : "Create new Course"}</span>
              {language === "ar" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Course Type Modal */}
      <CourseTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Update Course Modal */}
      {selectedCourse && (
        <UpdateCourseModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          onUpdateSuccess={() => {
            getTeacherCourses(dispatch);
          }}
        />
      )}

      {/* Published Section - Displayed First */}
      {publishedCourses.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              />
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "منشور" : "Published"}
              </h2>
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {publishedCourses.length}{" "}
              {language === "ar" ? "دورة منشورة حتى الآن" : "Courses Published till now"}
            </p>
          </div>

          {isLoading ? (
            <div className={`text-center py-8 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedCourses.map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={course} 
                  theme={theme} 
                  language={language} 
                  isPublished
                  onUpdate={() => {
                    setSelectedCourse(course);
                    setIsUpdateModalOpen(true);
                  }}
                  onDelete={() => handleDelete(course._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Unpublished Section - Displayed Second */}
      {unpublishedCourses.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Paperclip
              className={`h-6 w-6 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "غير منشور" : "Unpublished"}
            </h2>
          </div>

          {isLoading ? (
            <div className={`text-center py-8 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unpublishedCourses.map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={course} 
                  theme={theme} 
                  language={language}
                  onUpdate={() => {
                    setSelectedCourse(course);
                    setIsUpdateModalOpen(true);
                  }}
                  onDelete={() => handleDelete(course._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && publishedCourses.length === 0 && unpublishedCourses.length === 0 && (
        <div className={`text-center py-12 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
          <p className="text-lg">
            {language === "ar" ? "لا توجد دورات بعد. ابدأ بإنشاء دورة جديدة!" : "No courses yet. Start by creating a new course!"}
          </p>
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  theme: "dark" | "light";
  language: "ar" | "en";
  isPublished?: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
}

function CourseCard({ course, theme, language, isPublished = false, onUpdate, onDelete }: CourseCardProps) {
  // Get localized title and description
  const title = typeof course.title === "string" 
    ? course.title 
    : language === "ar" 
    ? course.title.ar || course.title.en 
    : course.title.en || course.title.ar;
  
  const description = typeof course.description === "string"
    ? course.description
    : language === "ar"
    ? course.description.ar || course.description.en
    : course.description.en || course.description.ar;

  // Format level
  const levelLabels: Record<string, { ar: string; en: string }> = {
    beginner: { ar: "مبتدئ", en: "Beginner" },
    intermediate: { ar: "متوسط", en: "Intermediate" },
    advanced: { ar: "متقدم", en: "Advanced" },
  };
  const levelLabel = levelLabels[course.level]?.[language] || course.level;

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Get image URL
  const imageUrl = course.thumbnail || "/home/privet_lessons.png";

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Course Image */}
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
            aria-label={language === "ar" ? "حذف الدورة" : "Delete course"}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          {course.totalLessons !== undefined && (
            <div className="flex items-center gap-2">
              <BookOpen
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              />
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {course.totalLessons}{" "}
                {language === "ar" ? "درس" : "Lessons"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {course.durationHours} {language === "ar" ? "س" : "h"}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              theme === "dark"
                ? "bg-blue-800/50 text-blue-300"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {levelLabel}
          </span>
        </div>

        {/* Description */}
        <p
          className={`text-sm line-clamp-2 ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Created Date */}
        {course.createdAt && (
          <p
            className={`text-xs ${
              theme === "dark" ? "text-blue-300" : "text-gray-500"
            }`}
          >
            {language === "ar" ? "تم الإنشاء في" : "Created on"} {formatDate(course.createdAt)}
          </p>
        )}

        {/* Status */}
        {!isPublished && (
          <div className="flex items-center gap-2">
            <RefreshCw
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-xs ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar" ? "غير منشور" : "Not Published"}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onUpdate}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {language === "ar" ? "تعديل" : "Update"}
          <Edit className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

