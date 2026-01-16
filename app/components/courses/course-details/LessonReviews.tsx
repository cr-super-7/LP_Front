"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getLessonReviews, createLessonReview } from "../../../store/api/reviewApi";
import type { Review } from "../../../store/interface/reviewInterface";
import ReviewModal from "./ReviewModal";
import toast from "react-hot-toast";

interface LessonReviewsProps {
  lessonId: string;
}

export default function LessonReviews({ lessonId }: LessonReviewsProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (lessonId) {
      loadReviews();
    }
  }, [lessonId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const reviewsData = await getLessonReviews(lessonId, dispatch);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to load lesson reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
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

  const handleReviewAdded = async () => {
    await loadReviews();
  };

  const handleSubmitReview = async (rating: number) => {
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
      await createLessonReview(lessonId, { rate: rating }, dispatch);
      await loadReviews();
      setIsReviewModalOpen(false);
      toast.success(
        language === "ar"
          ? "تم إضافة التقييم بنجاح"
          : "Review added successfully"
      );
    } catch (error: unknown) {
      console.error("Failed to submit review:", error);
      
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      
      const apiErrorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      
      let errorMessage: string;
      
      if (apiErrorMessage?.toLowerCase().includes("already reviewed") || 
          apiErrorMessage?.includes("قيمت") ||
          apiErrorMessage?.includes("قيم")) {
        errorMessage = language === "ar"
          ? "لقد قيّمت هذا الدرس مسبقاً"
          : "You have already reviewed this lesson";
        setIsReviewModalOpen(false);
      } else if (!apiErrorMessage) {
        errorMessage = language === "ar"
          ? "فشل إضافة التقييم"
          : "Failed to add review";
      } else {
        errorMessage = apiErrorMessage;
      }
      
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <>
      <div
        className={`rounded-xl p-6 ${
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

        {isLoading ? (
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
                ? "كن أول من يقيّم هذا الدرس"
                : "Be the first to review this lesson"}
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

      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          courseId={lessonId}
          onSuccess={handleReviewAdded}
          onSubmitReview={handleSubmitReview}
          isLesson={true}
        />
      )}
    </>
  );
}
