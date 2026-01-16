"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getCourseById } from "../../store/api/courseApi";
import { getLessonsByCourse } from "../../store/api/lessonApi";
import { getCourseReviews } from "../../store/api/reviewApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Lesson } from "../../store/interface/lessonInterface";
import type { Review } from "../../store/interface/reviewInterface";
import toast from "react-hot-toast";
import CourseHeader from "./course-details/CourseHeader";
import CourseImageWithRating from "./course-details/CourseImageWithRating";
import CourseLessonsList from "./course-details/CourseLessonsList";
import CourseInformation from "./course-details/CourseInformation";
import InstitutionInformation from "./course-details/InstitutionInformation";
import ProfessionalSpecialty from "./course-details/ProfessionalSpecialty";
import CourseReviews from "./course-details/CourseReviews";

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

  const getCategoryName = () => {
    if (!course) return "";
    const courseData = course as any;
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
    if (!course) return "";
    if (course.level === "beginner") {
      return language === "ar" ? "مبتدئ" : "Beginner";
    } else if (course.level === "intermediate") {
      return language === "ar" ? "متوسط" : "Intermediate";
    } else {
      return language === "ar" ? "متقدم" : "Advanced";
    }
  };

  const handleReviewAdded = async () => {
    // Reload reviews after adding a new one
    try {
      const reviewsData = await getCourseReviews(courseId, dispatch);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to reload reviews:", error);
    }
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
        <div
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

  const courseData = course as any;
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const courseDescription =
    language === "ar" ? course.description.ar : course.description.en;

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
          <CourseImageWithRating
            thumbnail={course.thumbnail || "/images/courses/course-placeholder.jpg"}
            title={courseTitle}
            rating={rating}
          />

          <CourseLessonsList
            lessons={lessons}
            courseId={courseId}
            isLoading={isLessonsLoading}
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <CourseHeader title={courseTitle} description={courseDescription} />

          <CourseInformation
            course={course}
            categoryName={getCategoryName()}
            levelLabel={getLevelLabel()}
          />

          {/* University/Institution Information */}
          {course.courseType === "university" && courseData.department && (
            <InstitutionInformation department={courseData.department} />
          )}

          {/* Professional Specialty Information */}
          {course.courseType === "others" && courseData.othersPlace && (
            <ProfessionalSpecialty othersPlace={courseData.othersPlace} />
          )}

          <CourseReviews
            reviews={reviews}
            isLoading={isReviewsLoading}
            courseId={courseId}
            onReviewAdded={handleReviewAdded}
          />
        </div>
      </div>
    </div>
  );
}
