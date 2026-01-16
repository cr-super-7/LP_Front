"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  BookOpen,
  GraduationCap,
  MapPin,
  Award,
  Building2,
  School,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  Lock,
  Briefcase,
  X,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCourseById } from "../../store/api/courseApi";
import { getLessonsByCourse } from "../../store/api/lessonApi";
import { getCourseReviews, createCourseReview } from "../../store/api/reviewApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Lesson } from "../../store/interface/lessonInterface";
import type { Review } from "../../store/interface/reviewInterface";
import toast from "react-hot-toast";

export default function CourseDetailsContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["all"]));
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!courseId) {
      router.push("/courses");
      return;
    }

    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await getCourseById(courseId, dispatch);
        setCourse(courseData as unknown as Course);
        
        // Load lessons for this course
        try {
          setIsLessonsLoading(true);
          const lessonsData = await getLessonsByCourse(courseId, dispatch);
          setLessons(lessonsData);
        } catch (error) {
          console.error("Failed to load lessons:", error);
          setLessons([]);
        } finally {
          setIsLessonsLoading(false);
        }

        // Load reviews for this course
        try {
          setIsReviewsLoading(true);
          const reviewsData = await getCourseReviews(courseId, dispatch);
          setReviews(reviewsData);
        } catch (error) {
          console.error("Failed to load reviews:", error);
          setReviews([]);
        } finally {
          setIsReviewsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load course:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل تفاصيل الدورة"
            : "Failed to load course details"
        );
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, dispatch, router, language]);

  // Get rating from course data (averageRating from API)
  const getRating = () => {
    if (!course) return null;
    const courseData = course as any;
    // Priority: averageRating from API response
    if (courseData.averageRating !== undefined && courseData.averageRating !== null) {
      return courseData.averageRating;
    }
    // Fallback to Teacher rating if averageRating not available
    if (courseData.Teacher?.rating !== undefined && courseData.Teacher.rating !== null) {
      return courseData.Teacher.rating;
    }
    return null;
  };

  const rating = getRating();

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")} ${language === "ar" ? "ساعة" : "h"}`;
    }
    return `${minutes} ${language === "ar" ? "دقيقة" : "min"}`;
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error(
        language === "ar"
          ? "يرجى تسجيل الدخول أولاً"
          : "Please login first"
      );
      router.push("/login");
      return;
    }

    if (selectedRating === 0) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار تقييم"
          : "Please select a rating"
      );
      return;
    }

    if (!courseId) return;

    try {
      setIsSubmittingReview(true);
      await createCourseReview(courseId, { rate: selectedRating }, dispatch);
      
      // Reload reviews
      const reviewsData = await getCourseReviews(courseId, dispatch);
      setReviews(reviewsData);
      
      setIsReviewModalOpen(false);
      setSelectedRating(0);
      toast.success(
        language === "ar"
          ? "تم إضافة التقييم بنجاح"
          : "Review added successfully"
      );
    } catch (error: unknown) {
      console.error("Failed to submit review:", error);
      
      // Extract error message from API response
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      
      // Get error message from API response
      const apiErrorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      
      // Translate common error messages and show to user
      let errorMessage: string;
      
      if (apiErrorMessage?.toLowerCase().includes("already reviewed") || 
          apiErrorMessage?.includes("قيمت") ||
          apiErrorMessage?.includes("قيم")) {
        errorMessage = language === "ar"
          ? "لقد قيّمت هذه الدورة مسبقاً"
          : "You have already reviewed this course";
        setIsReviewModalOpen(false);
        setSelectedRating(0);
      } else if (!apiErrorMessage) {
        errorMessage = language === "ar"
          ? "فشل إضافة التقييم"
          : "Failed to add review";
      } else {
        // Use the API error message as is
        errorMessage = apiErrorMessage;
      }
      
      // Always show error message to user
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <BookOpen
          className={`h-20 w-20 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        />
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {language === "ar" ? "الدورة غير موجودة" : "Course not found"}
        </h2>
      </div>
    );
  }

  const courseData = course as any; // Extended course data from API
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const courseDescription =
    language === "ar" ? course.description.ar : course.description.en;

  const getCategoryName = () => {
    if (courseData.category) {
      if (typeof courseData.category.name === "string") {
        return courseData.category.name;
      }
      return language === "ar"
        ? courseData.category.name?.ar
        : courseData.category.name?.en;
    }
    return "";
  };

  const getLevelLabel = () => {
    if (course.level === "beginner") {
      return language === "ar" ? "مبتدئ" : "Beginner";
    } else if (course.level === "intermediate") {
      return language === "ar" ? "متوسط" : "Intermediate";
    } else {
      return language === "ar" ? "متقدم" : "Advanced";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push("/")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "الرئيسية" : "Home"}
          </button>
          <span className={theme === "dark" ? "text-blue-400" : "text-gray-500"}>
            {isRTL ? "←" : ">"}
          </span>
          <button
            onClick={() => router.push("/courses")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "الدورات" : "Courses"}
          </button>
          {courseData.category && (
            <>
              <span
                className={theme === "dark" ? "text-blue-400" : "text-gray-500"}
              >
                {isRTL ? "←" : ">"}
              </span>
              <button
                onClick={() =>
                  router.push(`/courses/category/${courseData.category._id}`)
                }
                className={`hover:underline ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              >
                {getCategoryName()}
              </button>
            </>
          )}
          <span className={theme === "dark" ? "text-blue-400" : "text-gray-500"}>
            {isRTL ? "←" : ">"}
          </span>
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {courseTitle}
          </span>
        </nav>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
          theme === "dark"
            ? "hover:bg-blue-900 text-blue-300"
            : "hover:bg-gray-100 text-blue-600"
        }`}
      >
        <ChevronLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
        <span className="font-medium">
          {language === "ar" ? "العودة" : "Back"}
        </span>
      </button>

      <div className="space-y-6">
        {/* Course Image and Lessons Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Image */}
          <div className="relative w-full h-96 rounded-2xl overflow-hidden">
            <Image
              src={course.thumbnail || "/images/courses/course-placeholder.jpg"}
              alt={courseTitle}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            
            {/* Rating Badge on Image */}
            {rating !== null && (
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-semibold">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Course Content - Lessons (Udemy Style) */}
          <div
            className={`rounded-2xl p-6 h-96 overflow-y-auto ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "محتوى الدورة" : "Course Content"}
              </h2>
              {lessons.length > 0 && (
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {lessons.length}{" "}
                  {language === "ar" ? "درس" : lessons.length === 1 ? "lesson" : "lessons"}
                </span>
              )}
            </div>

            {isLessonsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            ) : lessons.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                <p>
                  {language === "ar"
                    ? "لا توجد دروس متاحة حالياً"
                    : "No lessons available at the moment"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* All Lessons Section */}
                <div>
                  <button
                    onClick={() => toggleSection("all")}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "bg-blue-800/30 hover:bg-blue-800/50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {expandedSections.has("all") ? (
                        <ChevronDown className="h-4 w-4 text-blue-400" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-blue-400" />
                      )}
                      <span
                        className={`font-semibold text-sm ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {language === "ar" ? "جميع الدروس" : "All Lessons"}
                      </span>
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-blue-300" : "text-gray-500"
                        }`}
                      >
                        ({lessons.length})
                      </span>
                    </div>
                    <span
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0) > 0
                        ? formatDuration(
                            lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)
                          )
                        : ""}
                    </span>
                  </button>

                  {expandedSections.has("all") && (
                    <div className="mt-2 space-y-1">
                      {lessons
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((lesson, index) => {
                          const lessonTitle =
                            language === "ar" ? lesson.title.ar : lesson.title.en;
                          return (
                            <div
                              key={lesson._id}
                              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                theme === "dark"
                                  ? "hover:bg-blue-800/30"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Play className="h-3 w-3 text-blue-400 shrink-0" />
                                <span
                                  className={`text-xs font-medium truncate ${
                                    theme === "dark" ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {index + 1}. {lessonTitle}
                                </span>
                                {lesson.isFree && (
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      theme === "dark"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-green-100 text-green-600"
                                    }`}
                                  >
                                    {language === "ar" ? "مجاني" : "Free"}
                                  </span>
                                )}
                                {!lesson.isFree && (
                                  <Lock className="h-3 w-3 text-gray-400 shrink-0" />
                                )}
                              </div>
                              {lesson.duration && (
                                <span
                                  className={`text-xs shrink-0 ${
                                    theme === "dark" ? "text-blue-300" : "text-gray-500"
                                  }`}
                                >
                                  {formatDuration(lesson.duration)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">

          {/* Course Title */}
          <div>
            <h1
              className={`text-3xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {courseTitle}
            </h1>
            <p
              className={`text-base leading-relaxed ${
                theme === "dark" ? "text-blue-200" : "text-gray-700"
              }`}
            >
              {courseDescription}
            </p>
          </div>

          {/* Course Information */}
          <div
            className={`rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "معلومات الدورة" : "Course Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              {courseData.category && (
                <div className="flex items-center gap-3">
                  <BookOpen
                    className={`h-5 w-5 shrink-0 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "الفئة" : "Category"}
                    </p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {getCategoryName()}
                    </p>
                  </div>
                </div>
              )}

              {/* Level */}
              <div className="flex items-center gap-3">
                <Award
                  className={`h-5 w-5 shrink-0 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  >
                    {language === "ar" ? "المستوى" : "Level"}
                  </p>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {getLevelLabel()}
                  </p>
                </div>
              </div>

              {/* Duration */}
              {course.durationHours && (
                <div className="flex items-center gap-3">
                  <Clock
                    className={`h-5 w-5 shrink-0 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "المدة" : "Duration"}
                    </p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.durationHours}{" "}
                      {language === "ar" ? "ساعة" : "hours"}
                    </p>
                  </div>
                </div>
              )}

              {/* Total Lessons */}
              {course.totalLessons && (
                <div className="flex items-center gap-3">
                  <BookOpen
                    className={`h-5 w-5 shrink-0 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "عدد الدروس" : "Total Lessons"}
                    </p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.totalLessons}{" "}
                      {language === "ar" ? "درس" : "lessons"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* University/Institution Information */}
          {course.courseType === "university" && courseData.department && (
            <div
              className={`rounded-2xl p-6 ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "معلومات المؤسسة" : "Institution Information"}
              </h2>

              <div className="space-y-4">
                {/* University */}
                {courseData.department.college?.university && (
                  <div className="flex items-start gap-3">
                    <Building2
                      className={`h-5 w-5 shrink-0 mt-1 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {courseData.department.college.university.name}
                      </p>
                      {courseData.department.college.university.location && (
                        <div className="flex items-center gap-1">
                          <MapPin
                            className={`h-4 w-4 ${
                              theme === "dark" ? "text-blue-300" : "text-blue-600"
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            {courseData.department.college.university.location}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* College */}
                {courseData.department.college && (
                  <div className="flex items-start gap-3">
                    <School
                      className={`h-5 w-5 shrink-0 mt-1 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {language === "ar"
                          ? courseData.department.college.name?.ar
                          : courseData.department.college.name?.en}
                      </p>
                    </div>
                  </div>
                )}

                {/* Department */}
                <div className="flex items-start gap-3">
                  <GraduationCap
                    className={`h-5 w-5 shrink-0 mt-1 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language === "ar"
                        ? courseData.department.name?.ar
                        : courseData.department.name?.en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Specialty Information */}
          {course.courseType === "others" && courseData.othersPlace && (
            <div
              className={`rounded-2xl p-6 ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "التخصص المهني" : "Professional Specialty"}
              </h2>

              <div className="space-y-4">
                {/* Specialty Name */}
                <div className="flex items-start gap-3">
                  <Briefcase
                    className={`h-5 w-5 shrink-0 mt-1 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "اسم التخصص" : "Specialty Name"}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language === "ar"
                        ? courseData.othersPlace.name?.ar
                        : courseData.othersPlace.name?.en}
                    </p>
                  </div>
                </div>

                
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div
            className={`rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "التقييمات والمراجعات" : "Reviews & Ratings"}
              </h2>
              {reviews.length > 0 && (
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {reviews.length}{" "}
                  {language === "ar"
                    ? reviews.length === 1
                      ? "تقييم"
                      : "تقييمات"
                    : reviews.length === 1
                    ? "review"
                    : "reviews"}
                </span>
              )}
            </div>

            {isReviewsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                {/* Animation */}
                <div className="relative mb-6">
                  <MessageSquare
                    className={`h-24 w-24 ${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    } animate-bounce`}
                  />
                  <Star className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                </div>
                
                <h3
                  className={`text-xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar"
                    ? "لا توجد تقييمات بعد"
                    : "No reviews yet"}
                </h3>
                <p
                  className={`text-center mb-6 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar"
                    ? "كن أول من يقيّم هذه الدورة"
                    : "Be the first to review this course"}
                </p>
                
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error(
                        language === "ar"
                          ? "يرجى تسجيل الدخول أولاً"
                          : "Please login first"
                      );
                      router.push("/login");
                      return;
                    }
                    setIsReviewModalOpen(true);
                  }}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Star className="h-5 w-5" />
                  {language === "ar" ? "أضف تقييمك" : "Add Your Review"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className={`p-4 rounded-lg ${
                      theme === "dark"
                        ? "bg-blue-800/30 border border-blue-700/50"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                            theme === "dark"
                              ? "bg-blue-700 text-white"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {review.user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {review.user.email}
                          </p>
                          <p
                            className={`text-xs ${
                              theme === "dark" ? "text-blue-300" : "text-gray-500"
                            }`}
                          >
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rate
                                ? "text-yellow-400 fill-yellow-400"
                                : theme === "dark"
                                ? "text-gray-600"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add Review Button */}
                {isAuthenticated && (
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className={`w-full py-3 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center gap-2 ${
                      theme === "dark"
                        ? "border-blue-600 text-blue-300 hover:bg-blue-600/20"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Star className="h-5 w-5" />
                    {language === "ar" ? "أضف تقييمك" : "Add Your Review"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => {
              setIsReviewModalOpen(false);
              setSelectedRating(0);
            }}
          />
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded-2xl ${
              theme === "dark"
                ? "bg-blue-900 border border-blue-800"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "أضف تقييمك" : "Add Your Review"}
              </h3>
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setSelectedRating(0);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-blue-800 text-blue-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p
                className={`text-sm mb-4 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? "اختر تقييمك من 1 إلى 5 نجوم"
                  : "Select your rating from 1 to 5 stars"}
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= selectedRating
                          ? "text-yellow-400 fill-yellow-400"
                          : theme === "dark"
                          ? "text-gray-600"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p
                  className={`text-center mt-4 text-sm ${
                    theme === "dark" ? "text-blue-300" : "text-gray-600"
                  }`}
                >
                  {language === "ar"
                    ? `تم اختيار ${selectedRating} من 5`
                    : `Selected ${selectedRating} out of 5`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setSelectedRating(0);
                }}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-colors ${
                  theme === "dark"
                    ? "border-blue-600 text-blue-300 hover:bg-blue-600/20"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={selectedRating === 0 || isSubmittingReview}
                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmittingReview
                  ? language === "ar"
                    ? "جاري الإرسال..."
                    : "Submitting..."
                  : language === "ar"
                  ? "إرسال"
                  : "Submit"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
