"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  Star,
  BookOpen,
  Users,
  Clock,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addToCart } from "../../../store/api/cartApi";
import { addToWishlist } from "../../../store/api/wishlistApi";
import type { Course } from "../../../store/interface/courseInterface";
import toast from "react-hot-toast";

interface CourseCardGridProps {
  course: Course;
}

export default function CourseCardGrid({ course }: CourseCardGridProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const courseData = course as any;
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const courseDescription =
    language === "ar" ? course.description.ar : course.description.en;

  // Get instructor name
  const getInstructorName = () => {
    if (courseData.Teacher?.user) {
      // If Teacher has user object, get email or name
      if (typeof courseData.Teacher.user === "object") {
        return courseData.Teacher.user.email || "Instructor";
      }
    }
    return "Instructor";
  };

  const handleCardClick = () => {
    router.push(`/courses/${course._id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
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
      setIsAddingToWishlist(true);
      await addToWishlist({ courseId: course._id }, dispatch);
      setIsFavorite(true);
      toast.success(
        language === "ar"
          ? "تم إضافة الدورة إلى المفضلة"
          : "Course added to wishlist"
      );
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
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
    <div
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isAddingToWishlist}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all ${
            isFavorite
              ? "bg-red-500 text-white"
              : theme === "dark"
              ? "bg-gray-900/80 text-white hover:bg-gray-800"
              : "bg-white/90 text-gray-700 hover:bg-white"
          } disabled:opacity-50`}
          aria-label={
            language === "ar" ? "إضافة إلى المفضلة" : "Add to wishlist"
          }
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
          />
        </button>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-semibold">4.3</span>
        </div>

        {/* Installments Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-medium">
            {language === "ar" ? "تقسيط متاح" : "Installments Available"}
          </div>
        </div>
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
        <div className="flex items-center gap-4 text-xs">
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
          <div className="flex items-center gap-1">
            <Users
              className={`h-4 w-4 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            />
            <span
              className={theme === "dark" ? "text-white" : "text-gray-900"}
            >
              500 {language === "ar" ? "طالب" : "Std"}
            </span>
          </div>
          {course.durationHours && (
            <div className="flex items-center gap-1">
              <Clock
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
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

        {/* Price and Actions */}
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
    </div>
  );
}
