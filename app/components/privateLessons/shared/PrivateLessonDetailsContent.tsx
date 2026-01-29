"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../../store/api/wishlistApi";
import { addToCart } from "../../../store/api/cartApi";
import { addPrivateLessonScheduleSlot, removePrivateLessonScheduleSlot } from "../../../store/api/privateLessonApi";
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
  Star,
  TrendingUp,
  CalendarDays,
  Heart,
  ShoppingCart,
  BookOpen,
  Users,
  Building2,
  Trash2,
  Plus,
} from "lucide-react";
import type { PrivateLesson } from "../../../store/interface/privateLessonInterface";
import type { RootState } from "../../../store/store";
import toast from "react-hot-toast";
import PrivateLessonStudentReviews from "../student/PrivateLessonStudentReviews";

interface PrivateLessonDetailsContentProps {
  lesson: PrivateLesson;
  viewer?: "auto" | "student" | "instructor";
}

export default function PrivateLessonDetailsContent({ lesson, viewer = "auto" }: PrivateLessonDetailsContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const isInstructorRole = user?.role === "instructor" || user?.role === "teacher";
  const isStudentRole = user?.role === "student";
  const isStudentView = viewer === "student" || (viewer === "auto" && isStudentRole);
  const isInstructorView = viewer === "instructor" || (viewer === "auto" && isInstructorRole);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState<number>(1);
  const [isScheduleSaving, setIsScheduleSaving] = useState(false);
  const [deletingSlotKey, setDeletingSlotKey] = useState<string | null>(null);

  // Check if lesson is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (isAuthenticated && user?.role === "student") {
        try {
          const wishlist = await getWishlist(dispatch);
          const matched = wishlist.items?.find((item) => item.courseId === lesson._id);
          setIsInWishlist(!!matched);
        } catch {
          // Silently fail
        }
      }
    };
    checkWishlist();
  }, [dispatch, isAuthenticated, lesson._id, user?.role]);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "student") {
      toast.error(language === "ar" ? "هذه الميزة للطلاب فقط" : "This feature is for students only");
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        // New API expects privateLessonId in path + type in query
        await removeFromWishlist(lesson._id, "privateLesson", dispatch);
        setIsInWishlist(false);
        toast.success(language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from wishlist");
      } else {
        // Wishlist API supports private lessons via privateLessonId
        await addToWishlist({ privateLessonId: lesson._id }, dispatch);
        // Refresh state
        setIsInWishlist(true);
        toast.success(language === "ar" ? "تمت الإضافة إلى المفضلة" : "Added to wishlist");
      }
    } catch {
      toast.error(language === "ar" ? "حدث خطأ" : "Something went wrong");
    }
    setIsAddingToWishlist(false);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "student") {
      toast.error(language === "ar" ? "هذه الميزة للطلاب فقط" : "This feature is for students only");
      return;
    }

    setIsAddingToCart(true);
    try {
      // Cart API supports private lessons via privateLessonId
      await addToCart({ privateLessonId: lesson._id }, dispatch);
      toast.success(language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart");
    } catch {
      toast.error(language === "ar" ? "حدث خطأ" : "Something went wrong");
    }
    setIsAddingToCart(false);
  };

  // Get localized content
  const lessonName =
    language === "ar" ? lesson.lessonName.ar || lesson.lessonName.en : lesson.lessonName.en || lesson.lessonName.ar;

  const description =
    language === "ar" ? lesson.description.ar || lesson.description.en : lesson.description.en || lesson.description.ar;

  const instructorName =
    language === "ar"
      ? lesson.instructorName.ar || lesson.instructorName.en
      : lesson.instructorName.en || lesson.instructorName.ar;

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
  const getPrice = (lessonData: PrivateLesson): { price: number; label: string } | null => {
    if (lessonData.packagePrice) {
      return {
        price: lessonData.packagePrice,
        label: language === "ar" ? "سعر الباقة" : "Package Price",
      };
    }
    if (lessonData.oneLessonPrice) {
      return {
        price: lessonData.oneLessonPrice,
        label: language === "ar" ? "سعر الدرس" : "Lesson Price",
      };
    }
    if (lessonData.price) {
      return {
        price: lessonData.price,
        label: language === "ar" ? "السعر" : "Price",
      };
    }
    return null;
  };

  const priceInfo = getPrice(lesson);

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

  const handleAddSchedule = async () => {
    if (!isInstructorView) return;
    if (!scheduleDate || !scheduleTime || !scheduleDuration || scheduleDuration <= 0) {
      toast.error(language === "ar" ? "يرجى إدخال التاريخ والوقت والمدة" : "Please enter date, time, and duration");
      return;
    }
    setIsScheduleSaving(true);
    try {
      await addPrivateLessonScheduleSlot(
        lesson._id,
        { date: scheduleDate, time: scheduleTime, duration: Number(scheduleDuration) },
        dispatch
      );
      setScheduleDate("");
      setScheduleTime("");
      setScheduleDuration(1);
    } finally {
      setIsScheduleSaving(false);
    }
  };

  const handleDeleteSchedule = async (slot: { date: string; time: string; duration: number }) => {
    if (!isInstructorView) return;
    const ok = window.confirm(
      language === "ar" ? "هل تريد حذف هذا الموعد؟" : "Do you want to delete this schedule slot?"
    );
    if (!ok) return;

    const key = `${slot.date}|${slot.time}|${slot.duration}`;
    setDeletingSlotKey(key);
    try {
      await removePrivateLessonScheduleSlot(lesson._id, slot, dispatch);
    } finally {
      setDeletingSlotKey(null);
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
        className={`mb-8 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden ${
          theme === "dark"
            ? "bg-linear-to-br from-blue-900/90 to-blue-800/70 backdrop-blur-sm border border-blue-700/50"
            : "bg-linear-to-br from-blue-600 to-blue-700 border border-blue-500"
        }`}
      >
        {/* Background decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/3 w-96 h-96 border border-white/5 rounded-full" />
          <div className="absolute top-20 left-1/4 w-80 h-80 border border-white/5 rounded-full" />
          <div className="absolute -top-10 left-1/2 w-72 h-72 border border-white/5 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-row">
          {/* Instructor Image - Left Side */}
          <div className="relative w-64 md:w-72 lg:w-80 shrink-0 self-stretch">
            <Image
              src={imageUrl}
              alt={instructorName}
              fill
              className="object-cover rounded-r-none rounded-l-3xl"
              sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
            />
          </div>

          {/* Content - Right Side */}
          <div className="flex-1 p-6 md:p-8 relative">
            {/* Wishlist Heart Button - Top Right (Students only) */}
            {isStudentView && (
              <button
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={`absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full transition-all duration-300 ${
                  isInWishlist ? "text-red-500" : "text-white/60 hover:text-red-400"
                } ${isAddingToWishlist ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
                title={
                  isInWishlist
                    ? language === "ar"
                      ? "إزالة من المفضلة"
                      : "Remove from wishlist"
                    : language === "ar"
                    ? "إضافة إلى المفضلة"
                    : "Add to wishlist"
                }
              >
                <Heart className={`h-6 w-6 ${isInWishlist ? "fill-red-500" : ""}`} />
              </button>
            )}

            {/* Instructor Name */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 pr-10">{instructorName}</h1>

            {/* Description */}
            {description && <p className="text-blue-100/90 text-sm md:text-base leading-relaxed mb-6">{description}</p>}

            {/* Location & Department Info */}
            <div className="space-y-2 mb-6 text-sm text-blue-100/80">
              {lesson.department?.college?.university && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>
                    {typeof lesson.department.college.university.name === "string"
                      ? lesson.department.college.university.name
                      : language === "ar"
                      ? lesson.department.college.university.name.ar || lesson.department.college.university.name.en
                      : lesson.department.college.university.name.en || lesson.department.college.university.name.ar}
                    {lesson.department?.college && (
                      <>
                        {" "}
                        &quot;{language === "ar" ? lesson.department.college.name.ar : lesson.department.college.name.en}
                        &quot;
                      </>
                    )}
                  </span>
                </div>
              )}
              {lesson.locationUrl && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{language === "ar" ? "الموقع" : "location"}</span>
                </div>
              )}
              {lessonName && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>{lessonName}</span>
                </div>
              )}
            </div>

            {/* Price - Right aligned */}
            {priceInfo && (
              <div className="flex justify-end mb-6">
                <div>
                  <span className="text-3xl md:text-4xl font-bold text-emerald-400">{priceInfo.price}</span>
                  <span className="text-emerald-300/80 text-lg ml-2">{lesson.currency}</span>
                </div>
              </div>
            )}

            {/* Stats Bar */}
            <div
              className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 py-4 px-4 rounded-2xl mb-6 ${
                theme === "dark" ? "bg-blue-900/40" : "bg-white/10"
              }`}
            >
              {lesson.schedule && lesson.schedule.length > 0 && (
                <div className="flex flex-col items-center">
                  <BookOpen className="h-5 w-5 text-blue-200 mb-1" />
                  <span className="text-white font-bold">{lesson.schedule.length}</span>
                  <span className="text-blue-200/70 text-xs">{language === "ar" ? "درس" : "Lessons"}</span>
                </div>
              )}
              {lesson.totalReviews !== undefined && (
                <div className="flex flex-col items-center">
                  <Users className="h-5 w-5 text-red-400 mb-1" />
                  <span className="text-white font-bold">{lesson.totalReviews || 0}</span>
                  <span className="text-blue-200/70 text-xs">{language === "ar" ? "طالب" : "Student"}</span>
                </div>
              )}
              {lesson.courseHours && (
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-blue-200 mb-1" />
                  <span className="text-white font-bold">{lesson.courseHours}</span>
                  <span className="text-blue-200/70 text-xs">{language === "ar" ? "ساعة" : "Hour"}</span>
                </div>
              )}
              <div className="flex flex-col items-center">
                <Star className="h-5 w-5 text-yellow-400 mb-1" />
                <span className="text-white font-bold">{lesson.averageRating?.toFixed(1) || "0.0"}</span>
                <span className="text-blue-200/70 text-xs">{language === "ar" ? "التقييم" : "Rating"}</span>
              </div>
            </div>

            {/* Action Buttons (Students only) */}
            {isStudentView && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 ${
                    isAddingToCart ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
                  } border-blue-300/30 text-white`}
                >
                  <span>
                    {isAddingToCart
                      ? language === "ar"
                        ? "جاري الإضافة..."
                        : "Adding..."
                      : language === "ar"
                      ? "أضف إلى السلة"
                      : "Add to cart"}
                  </span>
                  <ShoppingCart className="h-4 w-4" />
                </button>
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
            {isInstructorView
              ? language === "ar"
                ? "مواعيد الدرس"
                : "Lesson Schedule"
              : language === "ar"
              ? "الأوقات المتاحة"
              : "Available Times"}
          </h2>
          <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
            {isInstructorView
              ? language === "ar"
                ? "المواعيد التي قمت بتحديدها لهذا الدرس"
                : "Times you set for this lesson"
              : language === "ar"
              ? "اختر الوقت المناسب لحجز الدرس الخاص"
              : "Choose the perfect time to book your private lesson"}
          </p>
        </div>

        {/* Instructor Controls */}
        {isInstructorView && (
          <div
            className={`mb-6 rounded-2xl p-4 md:p-5 border ${
              theme === "dark"
                ? "bg-blue-900/40 border-blue-700/50"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={`text-xs font-semibold ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                    {language === "ar" ? "التاريخ" : "Date"}
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 border outline-none ${
                      theme === "dark"
                        ? "bg-blue-950/40 border-blue-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={`text-xs font-semibold ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                    {language === "ar" ? "الوقت" : "Time"}
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 border outline-none ${
                      theme === "dark"
                        ? "bg-blue-950/40 border-blue-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={`text-xs font-semibold ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                    {language === "ar" ? "المدة (ساعات)" : "Duration (hours)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={scheduleDuration}
                    onChange={(e) => setScheduleDuration(Number(e.target.value))}
                    className={`w-full rounded-lg px-3 py-2 border outline-none ${
                      theme === "dark"
                        ? "bg-blue-950/40 border-blue-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
              <button
                onClick={handleAddSchedule}
                disabled={isScheduleSaving}
                className={`shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-colors ${
                  isScheduleSaving ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
                } bg-blue-600 text-white`}
              >
                <Plus className="h-4 w-4" />
                {isScheduleSaving
                  ? language === "ar"
                    ? "جاري الحفظ..."
                    : "Saving..."
                  : language === "ar"
                  ? "إضافة موعد"
                  : "Add slot"}
              </button>
            </div>
          </div>
        )}

        {/* Schedule Display */}
        {lesson.schedule && lesson.schedule.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.schedule.map((item, index) => (
              <div
                key={index}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                  isInstructorView ? "" : "hover:scale-105 hover:shadow-xl cursor-pointer"
                } ${
                  theme === "dark"
                    ? `bg-blue-800/40 border-blue-600/50 ${
                        isInstructorView ? "" : "hover:border-blue-500 hover:bg-blue-800/60"
                      }`
                    : `bg-white border-blue-200 shadow-md ${isInstructorView ? "" : "hover:border-blue-400 hover:bg-blue-50"}`
                }`}
              >
                {isInstructorView && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSchedule({ date: item.date, time: item.time, duration: item.duration })}
                    disabled={deletingSlotKey === `${item.date}|${item.time}|${item.duration}`}
                    className={`absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors ${
                      deletingSlotKey === `${item.date}|${item.time}|${item.duration}`
                        ? "opacity-60 cursor-not-allowed"
                        : theme === "dark"
                        ? "hover:bg-red-500/20"
                        : "hover:bg-red-50"
                    }`}
                    title={language === "ar" ? "حذف الموعد" : "Delete slot"}
                  >
                    <Trash2 className={`h-4 w-4 ${theme === "dark" ? "text-red-300" : "text-red-600"}`} />
                  </button>
                )}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-blue-700/50" : "bg-blue-100"}`}>
                    <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-base font-bold mb-2 ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                      {formatScheduleDate(item.date)}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                      <span className={`text-sm font-semibold ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}>
                        {formatTime(item.time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === "dark" ? "bg-blue-700/50 text-blue-200" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.duration} {language === "ar" ? "ساعة" : "hours"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Hover Effect Overlay */}
                {!isInstructorView && (
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      theme === "dark"
                        ? "bg-linear-to-br from-blue-600/20 to-blue-500/20"
                        : "bg-linear-to-br from-blue-100/50 to-blue-50/50"
                    }`}
                  />
                )}
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
            <h3 className={`text-xl md:text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
              {isInstructorView
                ? language === "ar"
                  ? "لم تقم بإضافة مواعيد بعد"
                  : "No schedule added yet"
                : language === "ar"
                ? "لا توجد أوقات متاحة حالياً"
                : "No Available Times"}
            </h3>
            <p className={`text-sm md:text-base text-center max-w-md ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
              {isInstructorView
                ? language === "ar"
                  ? "لم يتم تحديد مواعيد لهذا الدرس بعد. يمكنك إضافتها من صفحة التعديل."
                  : "No times have been added for this lesson yet. You can add them from the edit page."
                : language === "ar"
                ? "لم يتم تحديد أوقات متاحة بعد. يرجى التحقق لاحقاً أو التواصل مع المدرس مباشرة."
                : "No available times have been set yet. Please check back later or contact the instructor directly."}
            </p>
            {/* Animated Dots */}
            <div className="flex gap-2 mt-6">
              <div
                className={`h-2 w-2 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-500"} animate-bounce`}
                style={{ animationDelay: "0s", animationDuration: "1.4s" }}
              />
              <div
                className={`h-2 w-2 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-500"} animate-bounce`}
                style={{ animationDelay: "0.2s", animationDuration: "1.4s" }}
              />
              <div
                className={`h-2 w-2 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-500"} animate-bounce`}
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
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                {language === "ar" ? "الوصف" : "Description"}
              </h2>
              <div className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
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
              theme === "dark" ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50" : "bg-white border border-gray-200"
            }`}
          >
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
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
              theme === "dark" ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50" : "bg-white border border-gray-200"
            }`}
          >
            <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
              {language === "ar" ? "معلومات الدرس" : "Lesson Information"}
            </h3>
            <div className="space-y-4">
              {/* Lesson Type */}
              <div className="flex items-center gap-3">
                {lesson.lessonType === "department" ? (
                  <GraduationCap className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                ) : (
                  <Briefcase className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                )}
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>{language === "ar" ? "النوع" : "Type"}</p>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{lessonTypeLabel}</p>
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center gap-3">
                <TrendingUp className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>{language === "ar" ? "المستوى" : "Level"}</p>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{levelLabel}</p>
                </div>
              </div>

              {/* Course Hours */}
              {lesson.courseHours && (
                <div className="flex items-center gap-3">
                  <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <div>
                    <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>{language === "ar" ? "عدد الساعات" : "Course Hours"}</p>
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
              theme === "dark" ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50" : "bg-white border border-gray-200"
            }`}
          >
            <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
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
                theme === "dark" ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50" : "bg-white border border-gray-200"
              }`}
            >
              <h3 className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "معلومات القسم" : "Department Information"}
              </h3>
              <div className={`p-4 rounded-lg space-y-3 ${theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"}`}>
                {lesson.department && (
                  <>
                    <div>
                      <span className={`text-xs font-semibold block mb-1 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                        {language === "ar" ? "القسم" : "Department"}
                      </span>
                      <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                        {language === "ar" ? lesson.department.name.ar : lesson.department.name.en}
                      </span>
                    </div>
                    {lesson.department.college && (
                      <div>
                        <span className={`text-xs font-semibold block mb-1 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                          {language === "ar" ? "الكلية" : "College"}
                        </span>
                        <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                          {language === "ar" ? lesson.department.college.name.ar : lesson.department.college.name.en}
                        </span>
                      </div>
                    )}
                    {lesson.department.college?.university && (
                      <div>
                        <span className={`text-xs font-semibold block mb-1 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
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
        </aside>
      </div>

      {/* Reviews Section (Students only) */}
      {isStudentView && (
        <section className="mt-8">
          <PrivateLessonStudentReviews privateLessonId={lesson._id} />
        </section>
      )}
    </div>
  );
}

