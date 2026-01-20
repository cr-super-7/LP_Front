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
  Eye,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getWishlist, removeFromWishlist } from "../../store/api/wishlistApi";
import { addToCart } from "../../store/api/cartApi";
import type { Course } from "../../store/interface/courseInterface";
import toast from "react-hot-toast";

// Liked Course Card Component with remove functionality
interface LikedCourseCardProps {
  course: Course;
  onRemove: (courseId: string) => void;
  isRemoving: boolean;
}

function LikedCourseCard({ course, onRemove, isRemoving }: LikedCourseCardProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const courseData = course as any;
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
    if (courseData.averageRating !== undefined) {
      return courseData.averageRating;
    }
    if (courseData.Teacher?.rating !== undefined) {
      return courseData.Teacher.rating;
    }
    return null;
  };

  // Get total students/enrollments
  const getTotalStudents = () => {
    if (courseData.enrollCount !== undefined && courseData.enrollCount > 0) {
      return courseData.enrollCount;
    }
    if (courseData.Teacher?.totalStudents !== undefined) {
      return courseData.Teacher.totalStudents;
    }
    if (courseData.totalStudents !== undefined) {
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
    onRemove(course._id);
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

export default function LikedCoursesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingCourseId, setRemovingCourseId] = useState<string | null>(null);

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
        
        // Extract courses from wishlist items
        const likedCourses = wishlist.items
          .filter((item) => item.course)
          .map((item) => item.course as Course);
        
        setCourses(likedCourses);
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

  // Handle removing course from wishlist
  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      setRemovingCourseId(courseId);
      await removeFromWishlist(courseId, dispatch);
      
      // Remove course from local state (optimistic UI update)
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemovingCourseId(null);
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
            {language === "ar" ? "الكورسات المفضلة" : "Liked Courses"}
          </h1>
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {language === "ar"
            ? "جميع الكورسات التي قمت بإضافتها إلى قائمة المفضلة"
            : "All courses you've added to your wishlist"}
        </p>
      </div>

      {/* Courses Count */}
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
            {courses.length}{" "}
            {language === "ar" ? "دورة مفضلة" : "liked courses"}
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
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
            {language === "ar" ? "لا توجد كورسات مفضلة" : "No liked courses"}
          </h2>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لم تقم بإضافة أي كورسات إلى قائمة المفضلة بعد"
              : "You haven't added any courses to your wishlist yet"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <LikedCourseCard
              key={course._id}
              course={course}
              onRemove={handleRemoveFromWishlist}
              isRemoving={removingCourseId === course._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
