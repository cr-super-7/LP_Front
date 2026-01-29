"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Star,
  Users,
  Clock,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getWishlist, removeFromWishlist } from "../../store/api/wishlistApi";
import { addToCart } from "../../store/api/cartApi";
import type { Course } from "../../store/interface/courseInterface";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";
import type { WishlistItem } from "../../store/interface/wishlistInterface";
import toast from "react-hot-toast";

// Liked Course Card Component with remove functionality
interface LikedCourseCardProps {
  itemId: string;
  course: Course;
  onRemove: (itemId: string, type: "course" | "privateLesson") => void;
  isRemoving: boolean;
}

function LikedCourseCard({ itemId, course, onRemove, isRemoving }: LikedCourseCardProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  type CourseData = Course & {
    Teacher?: {
      user?: string | { name?: string; email?: string; [key: string]: unknown };
      name?: string;
      rating?: number;
      totalStudents?: number;
      [key: string]: unknown;
    };
    averageRating?: number;
    enrollCount?: number;
    totalStudents?: number;
  };

  const courseData = course as CourseData;
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const courseDescription =
    language === "ar" ? course.description.ar : course.description.en;

  // Get instructor name from Teacher data
  const getInstructorName = () => {
    if (courseData.Teacher?.user && typeof courseData.Teacher.user === "object") {
      return (
        courseData.Teacher.user.name ||
        courseData.Teacher.user.email ||
        "Instructor"
      );
    }
    if (courseData.Teacher?.name) {
      return courseData.Teacher.name;
    }
    return "Instructor";
  };

  // Get rating from course data
  const getRating = () => {
    if (typeof courseData.averageRating === "number") {
      return courseData.averageRating;
    }
    if (typeof courseData.Teacher?.rating === "number") {
      return courseData.Teacher.rating;
    }
    return null;
  };

  // Get total students/enrollments
  const getTotalStudents = () => {
    if (typeof courseData.enrollCount === "number" && courseData.enrollCount > 0) {
      return courseData.enrollCount;
    }
    if (typeof courseData.Teacher?.totalStudents === "number") {
      return courseData.Teacher.totalStudents;
    }
    if (typeof courseData.totalStudents === "number") {
      return courseData.totalStudents;
    }
    return null;
  };

  // Format number for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const rating = getRating();
  const totalStudents = getTotalStudents();

  const handleCardClick = () => {
    router.push(`/courses/${course._id}`);
  };

  const handleRemoveFromWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(itemId, "course");
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(
        language === "ar"
          ? "يرجى تسجيل الدخول أولاً"
          : "Please login first"
      );
      router.push("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart({ courseId: course._id }, dispatch);
      toast.success(
        language === "ar"
          ? "تم إضافة الدورة إلى السلة"
          : "Course added to cart"
      );
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
      onClick={handleCardClick}
    >
      {/* Course Image */}
      <div className="relative w-full h-48">
        <Image
          src={course.thumbnail || "/images/courses/course-placeholder.jpg"}
          alt={courseTitle}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Favorite Button - Always Red for Liked Courses */}
        <motion.button
          onClick={handleRemoveFromWishlist}
          disabled={isRemoving}
          className="absolute top-3 left-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={
            language === "ar" ? "إزالة من المفضلة" : "Remove from wishlist"
          }
        >
          <Heart className="h-5 w-5 fill-current" />
        </motion.button>

        {/* Rating */}
        {rating !== null && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-semibold">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 space-y-3">
        {/* Course Title */}
        <h3
          className={`text-lg font-bold line-clamp-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {courseTitle}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center`}
          >
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              👤
            </span>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {getInstructorName()}
          </p>
        </div>

        {/* Description */}
        <p
          className={`text-sm line-clamp-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {courseDescription}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {course.totalLessons && (
            <div className="flex items-center gap-1">
              <BookOpen
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span
                className={theme === "dark" ? "text-white" : "text-gray-900"}
              >
                {course.totalLessons}{" "}
                {language === "ar" ? "درس" : "Lessons"}
              </span>
            </div>
          )}
          {totalStudents !== null && (
            <div className="flex items-center gap-1">
              <Users
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              />
              <span
                className={theme === "dark" ? "text-white" : "text-gray-900"}
              >
                {formatNumber(totalStudents)} {language === "ar" ? "مسجل" : "Enrolled"}
              </span>
            </div>
          )}
          {course.durationHours && (
            <div className="flex items-center gap-1">
              <Clock
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-orange-400" : "text-orange-600"
                }`}
              />
              <span
                className={theme === "dark" ? "text-white" : "text-gray-900"}
              >
                {course.durationHours}{" "}
                {language === "ar" ? "ساعة" : "h"}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div>
            <p
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {course.price}{" "}
              <span
                className={`text-sm font-normal ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {course.currency}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`flex-1 px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
              theme === "dark"
                ? "border-gray-700 bg-gray-900/50 text-white hover:bg-gray-800"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isAddingToCart
                ? language === "ar"
                  ? "جاري..."
                  : "Adding..."
                : language === "ar"
                ? "إضافة إلى السلة"
                : "Add to cart"}
            </span>
          </button>

          <button
            onClick={handleCardClick}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              theme === "dark"
                ? "bg-white text-gray-900 hover:bg-gray-100"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <span className="text-sm">
              {language === "ar" ? "التسجيل" : "Enroll"}
            </span>
            <ArrowRight
              className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Liked Private Lesson Card
interface LikedPrivateLessonCardProps {
  itemId: string;
  lesson: PrivateLesson;
  onRemove: (itemId: string, type: "course" | "privateLesson") => void;
  isRemoving: boolean;
}

function LikedPrivateLessonCard({ itemId, lesson, onRemove, isRemoving }: LikedPrivateLessonCardProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const lessonName = language === "ar" ? lesson.lessonName.ar : lesson.lessonName.en;
  const instructorName = language === "ar" ? lesson.instructorName.ar : lesson.instructorName.en;
  const imageUrl = lesson.instructorImage || "/home/privet_lessons.png";

  const handleCardClick = () => {
    router.push(`/private-lessons/${lesson._id}`);
  };

  const handleRemoveFromWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(itemId, "privateLesson");
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.push("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart({ privateLessonId: lesson._id }, dispatch);
      toast.success(language === "ar" ? "تم إضافة الدرس إلى السلة" : "Private lesson added to cart");
    } catch (error) {
      console.error("Failed to add private lesson to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const levelLabel =
    lesson.lessonLevel === "beginner"
      ? language === "ar"
        ? "مبتدئ"
        : "Beginner"
      : lesson.lessonLevel === "intermediate"
      ? language === "ar"
        ? "متوسط"
        : "Intermediate"
      : language === "ar"
      ? "متقدم"
      : "Advanced";

  const displayPrice =
    lesson.oneLessonPrice ?? lesson.packagePrice ?? lesson.price ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } border ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={lessonName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <motion.button
          onClick={handleRemoveFromWishlist}
          disabled={isRemoving}
          className="absolute top-3 left-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={language === "ar" ? "إزالة من المفضلة" : "Remove from wishlist"}
        >
          <Heart className="h-5 w-5 fill-current" />
        </motion.button>

        <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
          {language === "ar" ? "درس خصوصي" : "Private lesson"}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className={`text-lg font-bold line-clamp-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {lessonName}
        </h3>

        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 rounded-full ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center`}
          >
            <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>👤</span>
          </div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {instructorName}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <span className="px-2 py-1 rounded bg-blue-600/20 text-blue-300 text-xs font-semibold">
            {levelLabel}
          </span>
          <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {displayPrice}{" "}
            <span className={`text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {lesson.currency}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`flex-1 px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
              theme === "dark"
                ? "border-gray-700 bg-gray-900/50 text-white hover:bg-gray-800"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isAddingToCart
                ? language === "ar"
                  ? "جاري..."
                  : "Adding..."
                : language === "ar"
                ? "إضافة إلى السلة"
                : "Add to cart"}
            </span>
          </button>

          <button
            onClick={handleCardClick}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              theme === "dark"
                ? "bg-white text-gray-900 hover:bg-gray-100"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <span className="text-sm">
              {language === "ar" ? "عرض" : "View"}
            </span>
            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function LikedCoursesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [courseItems, setCourseItems] = useState<Array<{ itemId: string; course: Course }>>([]);
  const [privateLessonItems, setPrivateLessonItems] = useState<Array<{ itemId: string; lesson: PrivateLesson }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(
        language === "ar"
          ? "يرجى تسجيل الدخول أولاً"
          : "Please login first"
      );
      router.push("/login");
      return;
    }

    const loadLikedCourses = async () => {
      try {
        setIsLoading(true);
        const wishlist = await getWishlist(dispatch);

        const items = (wishlist.items || []) as WishlistItem[];
        const courses = items
          .filter((item) => item.course)
          // New DELETE expects courseId in the path, not wishlist record id
          .map((item) => ({ itemId: item.courseId, course: item.course as Course }));

        const lessons = items
          .filter((item) => item.privateLesson)
          // New DELETE expects privateLessonId in the path (stored in courseId for private lessons mapping)
          .map((item) => ({ itemId: item.courseId, lesson: item.privateLesson as PrivateLesson }));

        setCourseItems(courses);
        setPrivateLessonItems(lessons);
      } catch (error) {
        console.error("Failed to load liked courses:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الكورسات المفضلة"
            : "Failed to load liked courses"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedCourses();
  }, [dispatch, router, language, isAuthenticated]);

  // Handle removing item (course/private lesson) from wishlist
  const handleRemoveFromWishlist = async (itemId: string, type: "course" | "privateLesson") => {
    try {
      setRemovingItemId(itemId);
      await removeFromWishlist(itemId, type, dispatch);

      setCourseItems((prev) => prev.filter((x) => x.itemId !== itemId));
      setPrivateLessonItems((prev) => prev.filter((x) => x.itemId !== itemId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemovingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Heart
            className={`h-8 w-8 ${
              theme === "dark" ? "text-red-400" : "text-red-500"
            }`}
          />
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "المفضلة" : "Wishlist"}
          </h1>
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {language === "ar"
            ? "الكورسات والدروس الخصوصية التي قمت بإضافتها إلى المفضلة"
            : "Courses and private lessons you've added to your wishlist"}
        </p>
      </div>

      {/* Counts */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BookOpen
            className={`h-5 w-5 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <p
            className={`text-sm font-medium ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {courseItems.length + privateLessonItems.length}{" "}
            {language === "ar" ? "عنصر" : "items"}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {courseItems.length === 0 && privateLessonItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Heart
            className={`h-20 w-20 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "لا توجد عناصر في المفضلة" : "No wishlist items"}
          </h2>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لم تقم بإضافة أي عناصر إلى المفضلة بعد"
              : "You haven't added anything to your wishlist yet"}
          </p>
          <button
            onClick={() => router.push("/courses")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {language === "ar" ? "تصفح الكورسات" : "Browse Courses"}
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Courses */}
          {courseItems.length > 0 && (
            <section className="space-y-4">
              <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                {language === "ar" ? "الكورسات" : "Courses"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseItems.map(({ itemId, course }) => (
                  <LikedCourseCard
                    key={itemId}
                    itemId={itemId}
                    course={course}
                    onRemove={handleRemoveFromWishlist}
                    isRemoving={removingItemId === itemId}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Private Lessons */}
          {privateLessonItems.length > 0 && (
            <section className="space-y-4">
              <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                {language === "ar" ? "الدروس الخصوصية" : "Private Lessons"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {privateLessonItems.map(({ itemId, lesson }) => (
                  <LikedPrivateLessonCard
                    key={itemId}
                    itemId={itemId}
                    lesson={lesson}
                    onRemove={handleRemoveFromWishlist}
                    isRemoving={removingItemId === itemId}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
