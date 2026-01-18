"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deletePrivateLesson } from "../../store/api/privateLessonApi";
import UpdatePrivateLessonModal from "./UpdatePrivateLessonModal";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";
import {
  ArrowLeft,
  Clock,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";
import type { RootState } from "../../store/store";
import toast from "react-hot-toast";

interface PrivateLessonDetailsContentProps {
  lesson: PrivateLesson;
}

export default function PrivateLessonDetailsContent({ lesson }: PrivateLessonDetailsContentProps) {
  const { language } = useLanguage(); 
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Check if current user is the instructor (owner of the lesson)
  const isInstructor = user?.role === "instructor";
  const userId = user?.id;
  const isOwner = isInstructor && userId && 
    (typeof lesson.instructor === "object" 
      ? lesson.instructor.user === userId || lesson.instructor._id === userId
      : lesson.instructor === userId);

  // Get localized content
  const lessonName =
    language === "ar" ? lesson.lessonName.ar || lesson.lessonName.en : lesson.lessonName.en || lesson.lessonName.ar;

  const description =
    language === "ar" ? lesson.description.ar || lesson.description.en : lesson.description.en || lesson.description.ar;

  const instructorName =
    language === "ar"
      ? lesson.instructorName.ar || lesson.instructorName.en
      : lesson.instructorName.en || lesson.instructorName.ar;

  const jobTitle =
    lesson.jobTitle && (language === "ar" ? lesson.jobTitle.ar || lesson.jobTitle.en : lesson.jobTitle.en || lesson.jobTitle.ar);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Format level
  const levelLabels: Record<string, { ar: string; en: string }> = {
    beginner: { ar: "مبتدئ", en: "Beginner" },
    intermediate: { ar: "متوسط", en: "Intermediate" },
    advanced: { ar: "متقدم", en: "Advanced" },
  };
  const levelLabel = levelLabels[lesson.lessonLevel]?.[language] || lesson.lessonLevel;

  // Get status icon and label
  const getStatusInfo = () => {
    switch (lesson.status) {
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: language === "ar" ? "معتمد" : "Approved",
          color: "green",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          label: language === "ar" ? "مرفوض" : "Rejected",
          color: "red",
        };
      case "pending":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          label: language === "ar" ? "قيد المراجعة" : "Pending Review",
          color: "yellow",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
          label: language === "ar" ? "لا توجد حالة" : "No Status",
          color: "gray",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Get lesson type label
  const lessonTypeLabel =
    lesson.lessonType === "department"
      ? language === "ar"
        ? "أكاديمي"
        : "Academic"
      : language === "ar"
      ? "مهني"
      : "Professional";

  // Get price info
  const getPrice = (lesson: PrivateLesson): { price: number; label: string } | null => {
    if (lesson.packagePrice) {
      return {
        price: lesson.packagePrice,
        label: language === "ar" ? "سعر الباقة" : "Package Price"
      };
    }
    if (lesson.oneLessonPrice) {
      return {
        price: lesson.oneLessonPrice,
        label: language === "ar" ? "سعر الدرس" : "Lesson Price"
      };
    }
    if (lesson.price) {
      return {
        price: lesson.price,
        label: language === "ar" ? "السعر" : "Price"
      };
    }
    return null;
  };

  const priceInfo = getPrice(lesson);

  // Handle delete
  const handleDelete = async () => {
    try {
      await deletePrivateLesson(lesson._id, dispatch);
      toast.success(language === "ar" ? "تم حذف الدرس الخاص بنجاح" : "Private lesson deleted successfully");
      router.push("/private-lessons/my-lessons");
    } catch (error) {
      console.error("Failed to delete private lesson:", error);
    }
  };

  // Handle update success
  const handleUpdateSuccess = async () => {
    setIsEditModalOpen(false);
    router.refresh();
  };

  // Get image URL
  const imageUrl = lesson.instructorImage || "/home/privet_lessons.png";

  // Get department name
  const getDepartmentName = (): string | null => {
    if (lesson.lessonType === "department" && lesson.department) {
      return language === "ar" ? lesson.department.name.ar : lesson.department.name.en;
    }
    return null;
  };

  const departmentName = getDepartmentName();

  // Format schedule date for display
  const formatScheduleDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header with Back Button and Actions */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            theme === "dark"
              ? "hover:bg-blue-900/50 text-blue-300 hover:scale-105"
              : "hover:bg-gray-100 text-gray-600 hover:scale-105"
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{language === "ar" ? "رجوع" : "Back"}</span>
        </button>

      
      </div>

      {/* Instructor Section - At the Top */}
      <section
        className={`mb-8 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-linear-to-br from-blue-900/60 to-blue-800/40 backdrop-blur-sm border border-blue-700/50"
            : "bg-linear-to-br from-white to-blue-50/50 border border-gray-200 shadow-blue-100/50"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          {/* Instructor Image - Left Side */}
          <div className={`relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 shrink-0 rounded-2xl overflow-hidden shadow-xl ring-4 ring-offset-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
            theme === "dark" ? "ring-blue-500/30" : "ring-blue-300/20"
          }`}>
            <Image
              src={imageUrl}
              alt={instructorName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 250px"
            />
          </div>

          {/* Instructor Info - Right Side */}
          <div className="flex-1 text-center md:text-right">
            <div className="mb-4">
              <h2
                className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {instructorName}
              </h2>
              {jobTitle && (
                <p
                  className={`text-lg md:text-xl ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {jobTitle}
                </p>
              )}
            </div>

            {/* Rating Display */}
            {lesson.averageRating !== undefined && lesson.averageRating !== null && (
              <div className="flex items-center justify-center md:justify-end gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {lesson.averageRating.toFixed(1)}
                  </span>
                </div>
                {lesson.totalReviews !== undefined && lesson.totalReviews > 0 && (
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    ({lesson.totalReviews} {language === "ar" ? "تقييم" : "reviews"})
                  </span>
                )}
              </div>
            )}

            {/* Price Display */}
            {priceInfo && (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <DollarSign className={`h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                <span className={`text-xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                  {priceInfo.price} {lesson.currency}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Available Times Section */}
      <section
        className={`mb-8 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-linear-to-br from-blue-900/60 to-blue-800/40 backdrop-blur-sm border border-blue-700/50"
            : "bg-linear-to-br from-white to-blue-50/50 border border-gray-200 shadow-blue-100/50"
        }`}
      >
        <div className="mb-6">
          <h2
            className={`text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3 ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            <CalendarDays className="h-8 w-8 text-blue-500" />
            {language === "ar" ? "الأوقات المتاحة" : "Available Times"}
          </h2>
          <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
            {language === "ar"
              ? "اختر الوقت المناسب لحجز الدرس الخاص"
              : "Choose the perfect time to book your private lesson"}
          </p>
        </div>

        {/* Schedule Display */}
        {lesson.schedule && lesson.schedule.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.schedule.map((item, index) => (
              <div
                key={index}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                  theme === "dark"
                    ? "bg-blue-800/40 border-blue-600/50 hover:border-blue-500 hover:bg-blue-800/60"
                    : "bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      theme === "dark" ? "bg-blue-700/50" : "bg-blue-100"
                    }`}
                  >
                    <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-base font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-blue-950"
                      }`}
                    >
                      {formatScheduleDate(item.date)}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                      <span
                        className={`text-sm font-semibold ${
                          theme === "dark" ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        {formatTime(item.time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === "dark"
                            ? "bg-blue-700/50 text-blue-200"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.duration} {language === "ar" ? "ساعة" : "hours"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Hover Effect Overlay */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-600/20 to-blue-500/20"
                      : "bg-gradient-to-br from-blue-100/50 to-blue-50/50"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State with Animation */
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <div className="relative mb-6">
              {/* Animated Calendar Icon */}
              <div className="relative">
                <CalendarDays
                  className={`h-20 w-20 md:h-24 md:w-24 ${
                    theme === "dark" ? "text-blue-400/50" : "text-blue-300/50"
                  } animate-pulse`}
                />
                <div
                  className={`absolute inset-0 rounded-full ${
                    theme === "dark" ? "bg-blue-500/20" : "bg-blue-200/30"
                  } animate-ping`}
                  style={{ animationDuration: "2s" }}
                />
              </div>
            </div>
            <h3
              className={`text-xl md:text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "لا توجد أوقات متاحة حالياً" : "No Available Times"}
            </h3>
            <p
              className={`text-sm md:text-base text-center max-w-md ${
                theme === "dark" ? "text-blue-300" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "لم يتم تحديد أوقات متاحة بعد. يرجى التحقق لاحقاً أو التواصل مع المدرس مباشرة."
                : "No available times have been set yet. Please check back later or contact the instructor directly."}
            </p>
            {/* Animated Dots */}
            <div className="flex gap-2 mt-6">
              <div
                className={`h-2 w-2 rounded-full ${
                  theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                } animate-bounce`}
                style={{ animationDelay: "0s", animationDuration: "1.4s" }}
              />
              <div
                className={`h-2 w-2 rounded-full ${
                  theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                } animate-bounce`}
                style={{ animationDelay: "0.2s", animationDuration: "1.4s" }}
              />
              <div
                className={`h-2 w-2 rounded-full ${
                  theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                } animate-bounce`}
                style={{ animationDelay: "0.4s", animationDuration: "1.4s" }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Lesson Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Lesson Description */}
        <article className="lg:col-span-2">
          <div
            className={`rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-linear-to-br from-blue-900/60 to-blue-800/40 backdrop-blur-sm border border-blue-700/50"
                : "bg-linear-to-br from-white to-blue-50/50 border border-gray-200 shadow-blue-100/50"
            }`}
          >
            {/* Lesson Title */}
            <header className="mb-8">
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {lessonName}
              </h1>
            </header>

            {/* Lesson Description */}
            <section>
              <h2
                className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "الوصف" : "Description"}
              </h2>
              <div
                className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${
                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                }`}
              >
                {description}
              </div>
            </section>
          </div>
        </article>

        {/* Sidebar - Additional Information */}
        <aside className="space-y-6">
          {/* Status Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar" ? "الحالة" : "Status"}
            </h3>
            <div className="flex items-center gap-2">
              {statusInfo.icon}
              <span
                className={`text-sm font-medium ${
                  statusInfo.color === "green"
                    ? theme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                    : statusInfo.color === "red"
                    ? theme === "dark"
                      ? "text-red-400"
                      : "text-red-600"
                    : statusInfo.color === "yellow"
                    ? theme === "dark"
                      ? "text-yellow-400"
                      : "text-yellow-600"
                    : theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Lesson Info Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-semibold mb-4 ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar" ? "معلومات الدرس" : "Lesson Information"}
            </h3>
            <div className="space-y-4">
              {/* Lesson Type */}
              <div className="flex items-center gap-3">
                {lesson.lessonType === "department" ? (
                  <GraduationCap
                    className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}
                  />
                ) : (
                  <Briefcase className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                )}
                <div>
                  <p
                    className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}
                  >
                    {language === "ar" ? "النوع" : "Type"}
                  </p>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {lessonTypeLabel}
                  </p>
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center gap-3">
                <TrendingUp className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <div>
                  <p
                    className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}
                  >
                    {language === "ar" ? "المستوى" : "Level"}
                  </p>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {levelLabel}
                  </p>
                </div>
              </div>

              {/* Course Hours */}
              {lesson.courseHours && (
                <div className="flex items-center gap-3">
                  <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <div>
                    <p
                      className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}
                    >
                      {language === "ar" ? "عدد الساعات" : "Course Hours"}
                    </p>
                    <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                      {lesson.courseHours} {language === "ar" ? "ساعة" : "hours"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-semibold mb-4 ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar" ? "الموقع" : "Location"}
            </h3>
            <a
              href={lesson.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                theme === "dark"
                  ? "bg-blue-800/30 hover:bg-blue-800/50 text-blue-300"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600"
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">{language === "ar" ? "عرض على الخريطة" : "View on Map"}</span>
            </a>
          </div>

          {/* Department/Place Info Card */}
          {departmentName && (
            <div
              className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                theme === "dark"
                  ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3
                className={`text-sm font-semibold mb-4 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "معلومات القسم" : "Department Information"}
              </h3>
              <div
                className={`p-4 rounded-lg space-y-3 ${
                  theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                }`}
              >
                {lesson.department && (
                  <>
                    <div>
                      <span
                        className={`text-xs font-semibold block mb-1 ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {language === "ar" ? "القسم" : "Department"}
                      </span>
                      <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                        {language === "ar" ? lesson.department.name.ar : lesson.department.name.en}
                      </span>
                    </div>
                    {lesson.department.college && (
                      <div>
                        <span
                          className={`text-xs font-semibold block mb-1 ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "الكلية" : "College"}
                        </span>
                        <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                          {language === "ar" ? lesson.department.college.name.ar : lesson.department.college.name.en}
                        </span>
                      </div>
                    )}
                    {lesson.department.college?.university && (
                      <div>
                        <span
                          className={`text-xs font-semibold block mb-1 ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "الجامعة" : "University"}
                        </span>
                        <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                          {typeof lesson.department.college.university.name === "string"
                            ? lesson.department.college.university.name
                            : language === "ar"
                            ? lesson.department.college.university.name.ar || lesson.department.college.university.name.en
                            : lesson.department.college.university.name.en || lesson.department.college.university.name.ar}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Dates Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-semibold mb-4 ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar" ? "التواريخ" : "Dates"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <div>
                  <p
                    className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}
                  >
                    {language === "ar" ? "تاريخ الإنشاء" : "Created"}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {formatDate(lesson.createdAt)}
                  </p>
                </div>
              </div>
              {lesson.updatedAt && (
                <div className="flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <div>
                    <p
                      className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}
                    >
                      {language === "ar" ? "آخر تحديث" : "Last Updated"}
                    </p>
                    <p className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                      {formatDate(lesson.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
