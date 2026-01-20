"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  BookOpen,
  Users,
  Clock,
  Star,
  ShoppingCart,
  Heart,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCourseById } from "../../store/api/courseApi";
import { getLessonsByCourse } from "../../store/api/lessonApi";
import { getCourseReviews } from "../../store/api/reviewApi";
import { addToCart } from "../../store/api/cartApi";
import { addToWishlist } from "../../store/api/wishlistApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Lesson } from "../../store/interface/lessonInterface";
import type { Review } from "../../store/interface/reviewInterface";
import toast from "react-hot-toast";
import CourseReviews from "./course-details/CourseReviews";

export default function CourseDetailsContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  // Get rating from course data
  const getRating = () => {
    if (!course) return null;
    const courseData = course as any;
    if (courseData.averageRating !== undefined && courseData.averageRating !== null) {
      return courseData.averageRating;
    }
    if (courseData.Teacher?.rating !== undefined && courseData.Teacher.rating !== null) {
      return courseData.Teacher.rating;
    }
    return null;
  };

  const handleReviewAdded = async () => {
    try {
      const reviewsData = await getCourseReviews(courseId, dispatch);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to reload reviews:", error);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.push("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart({ courseId }, dispatch);
      toast.success(language === "ar" ? "تم إضافة الدورة إلى السلة" : "Course added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.push("/login");
      return;
    }

    try {
      setIsAddingToWishlist(true);
      await addToWishlist({ courseId }, dispatch);
      setIsFavorite(true);
      toast.success(language === "ar" ? "تم إضافة الدورة إلى المفضلة" : "Course added to wishlist");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleEnroll = () => {
    router.push(`/courses/${courseId}/watch`);
  };

  // Group lessons by sections (using description or creating generic sections)
  const groupLessonsBySections = () => {
    if (lessons.length === 0) return [];

    // For now, group all lessons under one section or create sections of ~5 lessons each
    const sections: { title: string; lessons: Lesson[] }[] = [];
    const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Check if lessons have section info
    const hasDescriptions = sortedLessons.some(
      (l) => l.title?.ar || l.title?.en
    );

    if (hasDescriptions) {
      // Group by unique descriptions as section titles
      const sectionMap = new Map<string, Lesson[]>();
      sortedLessons.forEach((lesson) => {
        const sectionTitle =
          language === "ar"
            ? lesson.title?.ar || lesson.title?.en || "الدروس"
            : lesson.title?.en || lesson.title?.ar || "Lessons";
        if (!sectionMap.has(sectionTitle)) {
          sectionMap.set(sectionTitle, []);
        }
        sectionMap.get(sectionTitle)!.push(lesson);
      });
      sectionMap.forEach((lessonsList, title) => {
        sections.push({ title, lessons: lessonsList });
      });
    } else {
      // Create a single section with all lessons
      sections.push({
        title: language === "ar" ? "محتوى الدورة" : "Course Content",
        lessons: sortedLessons,
      });
    }

    return sections;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
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
          className={`h-20 w-20 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
        />
        <h2
          className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}
        >
          {language === "ar" ? "الدورة غير موجودة" : "Course not found"}
        </h2>
      </div>
    );
  }

  const courseData = course as any;
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const courseDescription = language === "ar" ? course.description.ar : course.description.en;
  const rating = getRating();
  const sections = groupLessonsBySections();

  // Calculate total duration
  const totalDuration = lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section - Image + Course Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl overflow-hidden ${
          theme === "dark"
            ? "bg-blue-900/50 border border-blue-800/50"
            : "bg-white border border-gray-200 shadow-lg"
        }`}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Course Image */}
          <div className="relative lg:w-2/5 h-64 lg:h-auto">
            <Image
              src={course.thumbnail || "/images/courses/course-placeholder.jpg"}
              alt={courseTitle}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              unoptimized
            />
            {/* Favorite/Wishlist Button on Image */}
            <motion.button
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-black/50 text-white hover:bg-black/70"
              } disabled:opacity-50`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={language === "ar" ? "إضافة إلى المفضلة" : "Add to wishlist"}
            >
              <Heart
                className={`h-5 w-5 transition-all ${
                  isFavorite ? "fill-current" : ""
                }`}
              />
            </motion.button>
          </div>

          {/* Course Info */}
          <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
            {/* Title and Description */}
            <div>
              <h1
                className={`text-2xl lg:text-3xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {courseTitle}
              </h1>
              <p
                className={`text-sm lg:text-base leading-relaxed mb-6 line-clamp-4 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {courseDescription}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-600"
                }`}
              >
                {course.price}
              </span>
              <span
                className={`text-lg ml-2 ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                {course.currency || "SAR"}
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {/* Lessons Count */}
              {(course.totalLessons || lessons.length > 0) && (
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
                    }`}
                  >
                    <BookOpen
                      className={`h-4 w-4 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.totalLessons || lessons.length}
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "درس" : "Lessons"}
                    </p>
                  </div>
                </div>
              )}

              {/* Students Count */}
              {(courseData.enrollCount || courseData.Teacher?.totalStudents) > 0 && (
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-red-800/50" : "bg-red-100"
                    }`}
                  >
                    <Users
                      className={`h-4 w-4 ${
                        theme === "dark" ? "text-red-300" : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {courseData.enrollCount || courseData.Teacher?.totalStudents || 0}
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "طالب" : "Student"}
                    </p>
                  </div>
                </div>
             )}: 
             
                <div
                    className={`p-2 rounded-lg flex items-center gap-2`}
                  >
                    <Users
                      className={`h-4 w-4 ${
                        theme === "dark" ? "text-red-300" : "text-red-600"
                      }`}
                    />
                    <p className={`text-sm font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>{language === "ar" ? "لا يوجد طلاب" : "No students"}</p>
                </div>

            
              
              
              
              

              {/* Duration */}
              {(course.durationHours || totalDuration > 0) && (
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-green-800/50" : "bg-green-100"
                    }`}
                  >
                    <Clock
                      className={`h-4 w-4 ${
                        theme === "dark" ? "text-green-300" : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.durationHours || totalHours || Math.ceil(totalMinutes / 60)}
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "ساعة" : "Hour"}
                    </p>
                  </div>
                </div>
              )}

              {/* Rating */}
              {rating !== null && (
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-yellow-800/50" : "bg-yellow-100"
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 text-yellow-400 fill-yellow-400`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {rating.toFixed(1)}
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "التقييم" : "Rating"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  theme === "dark"
                    ? "bg-blue-900/50 border border-blue-700 text-white hover:bg-blue-800"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {isAddingToCart
                    ? language === "ar"
                      ? "جاري الإضافة..."
                      : "Adding..."
                    : language === "ar"
                    ? "إضافة للسلة"
                    : "Add to cart"}
                </span>
              </button>

              <button
                onClick={handleEnroll}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <span>{language === "ar" ? "التسجيل" : "Enroll"}</span>
                {isRTL ? (
                  <ArrowLeft className="h-5 w-5" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What You Will Learn Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-3xl p-6 lg:p-8 ${
          theme === "dark"
            ? "bg-blue-900/50 border border-blue-800/50"
            : "bg-white border border-gray-200 shadow-lg"
        }`}
      >
        <h2
          className={`text-xl lg:text-2xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {language === "ar" ? "ماذا ستتعلم؟" : "What You Will Learn?"}
        </h2>

        {isLessonsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : sections.length === 0 ? (
          <div
            className={`text-center py-12 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لا توجد دروس متاحة حالياً"
              : "No lessons available at the moment"}
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={`rounded-xl overflow-hidden ${
                  theme === "dark"
                    ? "bg-blue-800/30 border border-blue-700/50"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className={`w-full flex items-center justify-between p-4 transition-colors ${
                    theme === "dark" ? "hover:bg-blue-800/50" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    } ${expandedSections.has(sectionIndex) ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Section Content */}
                {expandedSections.has(sectionIndex) && (
                  <div
                    className={`border-t ${
                      theme === "dark" ? "border-blue-700/50" : "border-gray-200"
                    }`}
                  >

                    {/* Lessons List */}
                    <div className="p-4 space-y-2">
                      {section.lessons.map((lesson, lessonIndex) => {
                        const lessonTitle =
                          language === "ar"
                            ? lesson.title.ar || lesson.title.en
                            : lesson.title.en || lesson.title.ar;

                        return (
                          <div
                            key={lesson._id}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                              theme === "dark"
                                ? "hover:bg-blue-800/30"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => router.push(`/courses/${courseId}/watch`)}
                          >
                            {/* Checkbox/Play Icon */}
                            <div
                              className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                                theme === "dark"
                                  ? "border-blue-500 text-blue-400"
                                  : "border-gray-400 text-gray-500"
                              }`}
                            >
                              {lesson.isFree ? (
                                <Play className="h-3 w-3" />
                              ) : (
                                <span className="text-xs">{lessonIndex + 1}</span>
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Play
                                  className={`h-4 w-4 shrink-0 ${
                                    theme === "dark" ? "text-blue-400" : "text-blue-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm truncate ${
                                    theme === "dark" ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {lessonTitle}
                                </span>
                                {lesson.isFree && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      theme === "dark"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-green-100 text-green-600"
                                    }`}
                                  >
                                    {language === "ar" ? "مجاني" : "Free"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Duration */}
                            {lesson.duration && (
                              <span
                                className={`text-xs shrink-0 ${
                                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                                }`}
                              >
                                ({formatDuration(lesson.duration)})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Reviews Section - Keep as is */}
      <CourseReviews
        reviews={reviews}
        isLoading={isReviewsLoading}
        courseId={courseId}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
}
