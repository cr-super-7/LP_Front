"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { getTeacherCourses, deleteCourse } from "../../store/api/courseApi";
import { getLessonsByCourse } from "../../store/api/lessonApi";
import { getLessonReviews, getCourseReviews } from "../../store/api/reviewApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Review } from "../../store/interface/reviewInterface";
import type { Lesson } from "../../store/interface/lessonInterface";
import CourseTypeModal from "../myCoursesTeacher/CourseTypeModal";
import UpdateCourseModal from "../myCoursesTeacher/UpdateCourseModal";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";
import {
  DollarSign,
  BookOpen,
  Star,
  Edit,
  Eye,
  Trash2,
  Grid3x3,
  ChevronRight,
  ChevronLeft,
  FileText,
} from "lucide-react";
import type { RootState } from "../../store/store";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CourseDashboardContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { courses: teacherCourses, isLoading: coursesLoading } = useAppSelector(
    (state: RootState) => state.course
  );
  const [mounted, setMounted] = useState(false);
  const [isCourseTypeModalOpen, setIsCourseTypeModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessonReviews, setLessonReviews] = useState<Review[]>([]);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Fix hydration mismatch by only showing user-dependent content after mount
  // This pattern is necessary in Next.js to prevent SSR/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch teacher courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await getTeacherCourses(dispatch);
      } catch (error) {
        console.error("Failed to fetch teacher courses:", error);
      }
    };
    fetchCourses();
  }, [dispatch]);

  // Fetch lessons, course reviews, and lesson reviews for all courses
  useEffect(() => {
    const fetchLessonsAndReviews = async () => {
      if (teacherCourses.length === 0) return;
      
      setReviewsLoading(true);
      try {
        const allLessonReviews: Review[] = [];
        const allCourseReviews: Review[] = [];
        const allLessonsList: Lesson[] = [];
        let totalLessonsCount = 0;
        
        // Get lessons and reviews for each course
        for (const course of teacherCourses) {
          try {
            // Get course reviews
            try {
              const reviews = await getCourseReviews(course._id, dispatch);
              allCourseReviews.push(...reviews);
            } catch (error) {
              console.error(`Failed to fetch reviews for course ${course._id}:`, error);
            }

            // Get lessons for course
            const courseLessons = await getLessonsByCourse(course._id, dispatch);
            allLessonsList.push(...courseLessons);
            totalLessonsCount += courseLessons.length;
            
            // Get reviews for each lesson
            for (const lesson of courseLessons) {
              try {
                const reviews = await getLessonReviews(lesson._id, dispatch);
                allLessonReviews.push(...reviews);
              } catch (error) {
                console.error(`Failed to fetch reviews for lesson ${lesson._id}:`, error);
              }
            }
          } catch (error) {
            console.error(`Failed to fetch lessons for course ${course._id}:`, error);
          }
        }
        
        // Sort by creation date (newest first) and limit to top 3
        const sortedLessonReviews = allLessonReviews
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        
        setLessonReviews(sortedLessonReviews);
        setCourseReviews(allCourseReviews);
        setAllLessons(allLessonsList);
        setTotalLessons(totalLessonsCount);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (teacherCourses.length > 0) {
      fetchLessonsAndReviews();
    }
  }, [teacherCourses, dispatch]);

  // Calculate overall rating from all reviews (course + lesson reviews)
  const calculateOverallRating = () => {
    const allReviews = [...courseReviews, ...lessonReviews];
    if (allReviews.length === 0) return 0;
    const totalRating = allReviews.reduce((sum, review) => sum + review.rate, 0);
    return (totalRating / allReviews.length).toFixed(1);
  };

  // Calculate summary cards data
  const summaryCards = [
    {
      id: 1,
      icon: DollarSign,
      title: language === "ar" ? "أرباحي" : "My Earnings",
      value: "$25,378", // Keep static - no API endpoint
      change: "+1.3%",
      changeType: "increase" as const,
      color: "green",
    },
    {
      id: 2,
      icon: BookOpen,
      title: language === "ar" ? "إجمالي الدورات" : "Total Courses",
      value: teacherCourses.length.toString(),
      change: "+1.3%",
      changeType: "increase" as const,
      color: "green",
    },
    {
      id: 3,
      icon: FileText,
      title: language === "ar" ? "إجمالي الدروس" : "Total Lessons",
      value: totalLessons.toString(),
      change: "+1.3%",
      changeType: "increase" as const,
      color: "green",
    },
    {
      id: 4,
      icon: Star,
      title: language === "ar" ? "التقييم العام" : "Overall Rating",
      value: calculateOverallRating(),
      change: courseReviews.length + lessonReviews.length > 0 ? "+0%" : "0%",
      changeType: courseReviews.length + lessonReviews.length > 0 ? ("increase" as const) : ("decrease" as const),
      color: courseReviews.length + lessonReviews.length > 0 ? "green" : "red",
    },
  ];

  // Transform Course data to table format
  const courses = teacherCourses.map((course: Course) => {
    // Format date
    const formatDate = (dateString?: string) => {
      if (!dateString) return language === "ar" ? "غير متاح" : "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Get course name based on language
    const courseName =
      typeof course.title === "string"
        ? course.title
        : language === "ar"
        ? course.title.ar
        : course.title.en;

    // Map isPublished to status
    const getStatus = (isPublished?: boolean) => {
      if (isPublished === true) {
        return {
          status: language === "ar" ? "منشور" : "Published",
          statusColor: "green",
        };
      } else if (isPublished === false) {
        return {
          status: language === "ar" ? "قيد المراجعة" : "Pending Review",
          statusColor: "orange",
        };
      }
      return {
        status: language === "ar" ? "مسودة" : "Draft",
        statusColor: "purple",
      };
    };

    const statusInfo = getStatus(course.isPublished);

    return {
      id: course._id,
      name: courseName,
      students: 0, // TODO: Replace with actual student count from API when available
      lastUpdate: formatDate(course.updatedAt || course.createdAt),
      status: statusInfo.status,
      statusColor: statusInfo.statusColor,
      course: course, // Keep reference to original course object
    };
  });

  // Format date for reviews
  const formatReviewDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Calculate data by month from actual data
  const calculateMonthlyData = () => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const months = [
      { num: 0, ar: "يناير", en: "Jan" },
      { num: 1, ar: "فبراير", en: "Feb" },
      { num: 2, ar: "مارس", en: "Mar" },
      { num: 3, ar: "أبريل", en: "Apr" },
      { num: 4, ar: "مايو", en: "May" },
      { num: 5, ar: "يونيو", en: "Jun" },
      { num: 6, ar: "يوليو", en: "Jul" },
      { num: 7, ar: "أغسطس", en: "Aug" },
      { num: 8, ar: "سبتمبر", en: "Sep" },
      { num: 9, ar: "أكتوبر", en: "Oct" },
      { num: 10, ar: "نوفمبر", en: "Nov" },
      { num: 11, ar: "ديسمبر", en: "Dec" },
    ];

    // Initialize monthly data
    const studentGrowthData = months.map((m) => ({
      month: language === "ar" ? m.ar : m.en,
      students: 0,
    }));

    const earningsData = months.slice(0, 6).map((m) => ({
      month: language === "ar" ? m.ar : m.en,
      thisYear: 0,
      lastYear: 0,
      courses: 0,
    }));

    // Calculate student growth from reviews (cumulative)
    const allReviews = [...courseReviews, ...lessonReviews];
    let cumulativeStudents = 0;
    
    months.forEach((m, index) => {
      // Count reviews in this month (as proxy for student activity)
      const monthStart = new Date(currentYear, m.num, 1);
      const monthEnd = new Date(currentYear, m.num + 1, 0, 23, 59, 59);

      // Use unique users from reviews as student count
      const uniqueUsersThisMonth = new Set(
        allReviews
          .filter((review) => {
            const reviewDate = new Date(review.createdAt);
            return reviewDate >= monthStart && reviewDate <= monthEnd;
          })
          .map((review) => review.user?._id || review.user?.email)
      ).size;

      cumulativeStudents += uniqueUsersThisMonth;
      studentGrowthData[index].students = cumulativeStudents || (index > 0 ? studentGrowthData[index - 1].students : 0);
    });

    // Calculate earnings data (courses and lessons per month)
    months.slice(0, 6).forEach((m, index) => {
      const monthStartThisYear = new Date(currentYear, m.num, 1);
      const monthEndThisYear = new Date(currentYear, m.num + 1, 0, 23, 59, 59);
      const monthStartLastYear = new Date(lastYear, m.num, 1);
      const monthEndLastYear = new Date(lastYear, m.num + 1, 0, 23, 59, 59);

      // Count courses created this month (this year)
      const coursesThisYear = teacherCourses.filter((course) => {
        const courseDate = new Date(course.createdAt);
        return courseDate >= monthStartThisYear && courseDate <= monthEndThisYear;
      }).length;

      // Count courses created this month (last year)
      const coursesLastYear = teacherCourses.filter((course) => {
        const courseDate = new Date(course.createdAt);
        return courseDate >= monthStartLastYear && courseDate <= monthEndLastYear;
      }).length;

      // Count lessons created this month (this year)
      const lessonsThisYear = allLessons.filter((lesson) => {
        const lessonDate = new Date(lesson.createdAt);
        return lessonDate >= monthStartThisYear && lessonDate <= monthEndThisYear;
      }).length;

      // Count lessons created this month (last year) - approximate from current data
      const lessonsLastYear = allLessons.filter((lesson) => {
        const lessonDate = new Date(lesson.createdAt);
        return lessonDate >= monthStartLastYear && lessonDate <= monthEndLastYear;
      }).length;

      // Use courses count as proxy for earnings (multiply by estimated value per course)
      earningsData[index].thisYear = coursesThisYear * 500 + lessonsThisYear * 50;
      earningsData[index].lastYear = coursesLastYear * 500 + lessonsLastYear * 50;
      earningsData[index].courses = coursesThisYear;
    });

    return { studentGrowthData, earningsData };
  };

  const { studentGrowthData, earningsData } = calculateMonthlyData();

  // Handle course actions
  const handleEdit = (courseId: string) => {
    const course = teacherCourses.find((c) => c._id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsUpdateModalOpen(true);
    }
  };

  const handleUpdateSuccess = async () => {
    await getTeacherCourses(dispatch);
    setIsUpdateModalOpen(false);
    setSelectedCourse(null);
  };

  const handleView = (courseId: string) => {
    router.push(`/myCoursesTeacher/lessons?courseId=${courseId}`);
  };

  const handleDelete = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      await deleteCourse(courseToDelete, dispatch);
      await getTeacherCourses(dispatch); // Reload courses after deletion
      setCourseToDelete(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const getStatusColor = (color: string) => {
    const colors: Record<string, string> = {
      purple: theme === "dark" ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700",
      green: theme === "dark" ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700",
      orange: theme === "dark" ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700",
      blue: theme === "dark" ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700",
      red: theme === "dark" ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-700",
    };
    return colors[color] || colors.green;
  };

  const userName = mounted && user?.email ? user.email.split("@")[0] : "User";
  const displayName = language === "ar" ? `د. ${userName}` : `Dr. ${userName}`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? `مرحباً، ${displayName} 👋` : `Hello, ${displayName} 👋`}
          </h1>
          <p
            className={`mt-2 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "نتمنى لك يوماً منتجاً!"
              : "We wish you a productive day!"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCourseTypeModalOpen(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <span>{language === "ar" ? "إنشاء دورة جديدة" : "Create new Course"}</span>
            {language === "ar" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`rounded-xl p-6 shadow-lg ${
                theme === "dark"
                  ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    theme === "dark" ? "bg-blue-800/50" : "bg-blue-50"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                </div>
              </div>
              <h3
                className={`text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {card.title}
              </h3>
              <p
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {card.value}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    card.changeType === "increase"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {card.changeType === "increase" ? "↑" : "↓"} {card.change}
                </span>
                {card.changeType === "increase" && (
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar" ? "زيادة" : "Increased"}
                  </span>
                )}
                {card.changeType === "decrease" && (
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar" ? "انخفاض" : "Decreased"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses Overview Table - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div
            className={`rounded-xl p-6 shadow-lg ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "نظرة عامة على الدورات" : "Courses Overview"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      theme === "dark" ? "border-blue-800" : "border-gray-200"
                    }`}
                  >
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "الدورة" : "Course"}
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "الطالب" : "Student"}
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "آخر تحديث" : "Last Update"}
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "الحالة" : "Status"}
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "الإجراء" : "Action"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coursesLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <p
                          className={`${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "جاري التحميل..." : "Loading..."}
                        </p>
                      </td>
                    </tr>
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <p
                          className={`${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar"
                            ? "لا توجد دورات متاحة"
                            : "No courses available"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr
                        key={course.id}
                        className={`border-b ${
                          theme === "dark" ? "border-blue-800/50" : "border-gray-100"
                        }`}
                      >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded ${
                              theme === "dark" ? "bg-blue-800/50" : "bg-gray-100"
                            }`}
                          >
                            <Grid3x3 className="h-4 w-4 text-blue-500" />
                          </div>
                          <span
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-blue-950"
                            }`}
                          >
                            {course.name}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-4 px-4 ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {course.students}
                      </td>
                      <td
                        className={`py-4 px-4 text-sm ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {course.lastUpdate}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            course.statusColor
                          )}`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(course.course._id)}
                            className={`p-1.5 rounded transition-colors ${
                              theme === "dark"
                                ? "hover:bg-blue-800/50 text-purple-400"
                                : "hover:bg-gray-100 text-purple-600"
                            }`}
                            aria-label="Edit"
                            title={language === "ar" ? "تعديل" : "Edit"}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleView(course.course._id)}
                            className={`p-1.5 rounded transition-colors ${
                              theme === "dark"
                                ? "hover:bg-blue-800/50 text-green-400"
                                : "hover:bg-gray-100 text-green-600"
                            }`}
                            aria-label="View"
                            title={language === "ar" ? "عرض" : "View"}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.course._id)}
                            className={`p-1.5 rounded transition-colors ${
                              theme === "dark"
                                ? "hover:bg-blue-800/50 text-red-400"
                                : "hover:bg-gray-100 text-red-600"
                            }`}
                            aria-label="Delete"
                            title={language === "ar" ? "حذف" : "Delete"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Top Courses */}
        <div className="space-y-6">
          {/* Top Courses */}
          <div
            className={`rounded-xl p-6 shadow-lg ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "تقييمات الدروس" : "Lesson Reviews"}
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />
                </div>
              ) : lessonReviews.length > 0 ? (
                lessonReviews.map((review) => {
                  const lessonTitle = review.lesson
                    ? typeof review.lesson.title === "string"
                      ? review.lesson.title
                      : language === "ar"
                      ? review.lesson.title.ar || review.lesson.title.en
                      : review.lesson.title.en || review.lesson.title.ar
                    : language === "ar"
                    ? "درس غير معروف"
                    : "Unknown Lesson";

                  return (
                    <div
                      key={review._id}
                      className={`p-4 rounded-lg ${
                        theme === "dark" ? "bg-blue-800/30" : "bg-gray-50"
                      }`}
                    >
                      <h3
                        className={`font-semibold mb-2 ${
                          theme === "dark" ? "text-white" : "text-blue-950"
                        }`}
                      >
                        {lessonTitle}
                      </h3>
                      <p
                        className={`text-sm mb-2 ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {review.user?.email || (language === "ar" ? "مستخدم" : "User")}
                      </p>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {formatReviewDate(review.createdAt)}
                        </p>
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-semibold ${
                              theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                            }`}
                          >
                            {review.rate}
                          </span>
                          <Star
                            className={`h-4 w-4 ${
                              theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                            } fill-current`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className={`p-8 rounded-lg text-center ${
                    theme === "dark"
                      ? "bg-blue-800/30 border border-blue-700/50"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Star
                    className={`h-12 w-12 mx-auto mb-4 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <p
                    className={`text-lg ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar"
                      ? "لا توجد تقييمات بعد"
                      : "No reviews yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Growth Chart */}
        <div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar"
              ? "نمو الطلاب | هذا العام"
              : "Student Growth | This year"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentGrowthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#1e3a8a" : "#e5e7eb"}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: theme === "dark" ? "#bfdbfe" : "#4b5563" }}
                stroke={theme === "dark" ? "#3b82f6" : "#6b7280"}
              />
              <YAxis
                tick={{ fill: theme === "dark" ? "#bfdbfe" : "#4b5563" }}
                stroke={theme === "dark" ? "#3b82f6" : "#6b7280"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e3a8a" : "#ffffff",
                  border: `1px solid ${theme === "dark" ? "#3b82f6" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  color: theme === "dark" ? "#ffffff" : "#1f2937",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: theme === "dark" ? "#bfdbfe" : "#4b5563",
                }}
              />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
                name={language === "ar" ? "عدد الطلاب" : "Students"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* My Earning Chart */}
        <div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar"
              ? "أرباحي | إجمالي الدورات | هذا العام | العام الماضي"
              : "My Earning | Total courses | This year | Last year"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#1e3a8a" : "#e5e7eb"}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: theme === "dark" ? "#bfdbfe" : "#4b5563" }}
                stroke={theme === "dark" ? "#3b82f6" : "#6b7280"}
              />
              <YAxis
                tick={{ fill: theme === "dark" ? "#bfdbfe" : "#4b5563" }}
                stroke={theme === "dark" ? "#3b82f6" : "#6b7280"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e3a8a" : "#ffffff",
                  border: `1px solid ${theme === "dark" ? "#3b82f6" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  color: theme === "dark" ? "#ffffff" : "#1f2937",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: theme === "dark" ? "#bfdbfe" : "#4b5563",
                }}
              />
              <Bar
                dataKey="thisYear"
                fill="#3b82f6"
                name={language === "ar" ? "هذا العام" : "This Year"}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="lastYear"
                fill="#60a5fa"
                name={language === "ar" ? "العام الماضي" : "Last Year"}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Type Modal */}
      <CourseTypeModal
        isOpen={isCourseTypeModalOpen}
        onClose={() => setIsCourseTypeModalOpen(false)}
      />

      {/* Update Course Modal */}
      {selectedCourse && (
        <UpdateCourseModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={confirmDelete}
        title={language === "ar" ? "تأكيد حذف الكورس" : "Confirm Delete Course"}
        message={language === "ar" ? "هل أنت متأكد من حذف هذا الكورس؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this course? This action cannot be undone."}
      />
    </div>
  );
}

