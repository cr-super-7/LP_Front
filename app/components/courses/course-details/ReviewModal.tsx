"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, X } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createCourseReview } from "../../../store/api/reviewApi";
import { getCourseReviews } from "../../../store/api/reviewApi";
import toast from "react-hot-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onSuccess: () => void;
  onSubmitReview?: (rating: number) => Promise<void>;
  isLesson?: boolean;
  target?: "course" | "lesson" | "privateLesson";
}

export default function ReviewModal({
  isOpen,
  onClose,
  courseId,
  onSuccess,
  onSubmitReview,
  isLesson = false,
  target,
}: ReviewModalProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const effectiveTarget: "course" | "lesson" | "privateLesson" =
    target ?? (isLesson ? "lesson" : "course");

  const getAlreadyReviewedMessage = () => {
    if (language === "ar") {
      if (effectiveTarget === "lesson") return "لقد قيّمت هذا الدرس مسبقاً";
      if (effectiveTarget === "privateLesson") return "لقد قيّمت هذا الدرس الخصوصي مسبقاً";
      return "لقد قيّمت هذه الدورة مسبقاً";
    }
    if (effectiveTarget === "lesson") return "You have already reviewed this lesson";
    if (effectiveTarget === "privateLesson") return "You have already reviewed this private lesson";
    return "You have already reviewed this course";
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

    try {
      setIsSubmittingReview(true);
      
      // If custom submit handler is provided (for lessons), use it
      if (onSubmitReview) {
        await onSubmitReview(selectedRating);
      } else {
        // Default behavior for courses
        await createCourseReview(courseId, { rate: selectedRating }, dispatch);
        await getCourseReviews(courseId, dispatch);
      }
      
      onClose();
      setSelectedRating(0);
      onSuccess();
      
      if (!onSubmitReview) {
        toast.success(
          language === "ar"
            ? "تم إضافة التقييم بنجاح"
            : "Review added successfully"
        );
      }
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
        errorMessage = getAlreadyReviewedMessage();
        onClose();
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => {
          onClose();
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
              onClose();
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
              onClose();
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
  );
}
