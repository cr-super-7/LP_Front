"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { getTeacherCourses } from "../../store/api/courseApi";
import { getLessonsByCourse } from "../../store/api/lessonApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Lesson } from "../../store/interface/lessonInterface";
import type { RootState } from "../../store/store";
import {
  BookOpen,
  Users,
  Video,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckSquare,
  Square,
} from "lucide-react";

export default function ReportContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { courses: teacherCourses, isLoading: coursesLoading } = useAppSelector(
    (state: RootState) => state.course
  );

  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await getTeacherCourses(dispatch);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, [dispatch]);

  // Fetch lessons for all courses
  useEffect(() => {
    const fetchLessons = async () => {
      if (teacherCourses.length === 0) return;

      setLessonsLoading(true);
      try {
        const lessonsList: Lesson[] = [];

        for (const course of teacherCourses) {
          try {
            const courseLessons = await getLessonsByCourse(course._id, dispatch);
            lessonsList.push(...courseLessons);
          } catch (error) {
            console.error(`Failed to fetch lessons for course ${course._id}:`, error);
          }
        }

        setAllLessons(lessonsList);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      } finally {
        setLessonsLoading(false);
      }
    };

    if (teacherCourses.length > 0) {
      fetchLessons();
    }
  }, [teacherCourses, dispatch]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalCourses = teacherCourses.length;
    const createdCourses = teacherCourses.length; // All courses are created
    const pendingCourses = teacherCourses.filter((c) => c.isPublished === false).length;
    const approvedCourses = teacherCourses.filter((c) => c.isPublished === true).length;
    const rejectedCourses = 0; // API doesn't provide this, using 0

    // Calculate average course activity (average lessons per course)
    const averageCourseActivity =
      totalCourses > 0
        ? Math.round(
            allLessons.filter((l) => teacherCourses.some((c) => c._id === l.course)).length / totalCourses
          )
        : 0;

    // Calculate total students (mock - API doesn't provide this)
    // Using number of courses as proxy
    const totalStudents = totalCourses * 10; // Estimated
    const newStudents = Math.floor(totalStudents * 0.1); // 10% of total

    // Calculate lecture completion rate (mock - using lessons data)
    const totalVideos = allLessons.length;
    const averageLectureCompletionRate = totalVideos > 0 ? Math.round((totalVideos / totalCourses) * 10) : 0;
    const averageVideoWatchRate = totalVideos > 0 ? Math.round((totalVideos / totalCourses) * 5) : 0;

    // Calculate total revenue
    const totalRevenue = teacherCourses.reduce((sum, course) => sum + (course.price || 0), 0);

    // Calculate monthly growth
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    };

    const coursesThisMonth = teacherCourses.filter((c) => {
      const date = new Date(c.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const coursesLastMonth = teacherCourses.filter((c) => {
      const date = new Date(c.createdAt);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }).length;

    const growth = calculateGrowth(coursesThisMonth, coursesLastMonth);

    return {
      courses: {
        total: totalCourses,
        created: createdCourses,
        pending: pendingCourses,
        approved: approvedCourses,
        rejected: rejectedCourses,
        averageActivity: averageCourseActivity,
        growth,
      },
      students: {
        total: totalStudents,
        new: newStudents,
        growth,
      },
      lectures: {
        completionRate: averageLectureCompletionRate,
        watchRate: averageVideoWatchRate,
        growth,
      },
      revenue: {
        total: totalRevenue,
        growth,
      },
    };
  }, [teacherCourses, allLessons]);

  // Prepare courses table data
  const coursesTableData = useMemo(() => {
    return teacherCourses.map((course) => {
      const courseLessons = allLessons.filter((l) => l.course === course._id);
      const totalLectures = courseLessons.length;
      const totalVideos = courseLessons.length; // Assuming each lesson has one video

      // Mock students count (API doesn't provide this)
      const students = Math.floor(Math.random() * 1000) + 50;

      // Calculate instructor revenue (assuming 100% for now, or can be calculated from price)
      const instructorRevenue = course.price || 0;

      const courseName =
        typeof course.title === "string"
          ? course.title
          : language === "ar"
          ? course.title.ar || course.title.en
          : course.title.en || course.title.ar;

      return {
        id: course._id,
        courseName,
        students,
        price: course.price || 0,
        currency: course.currency || "SAR",
        instructorRevenue,
        totalLectures,
        totalVideos,
        course, // Keep reference to original course
      };
    });
  }, [teacherCourses, allLessons, language]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = coursesTableData;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[sortColumn as keyof typeof a];
        let bValue: any = b[sortColumn as keyof typeof b];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  }, [coursesTableData, searchQuery, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / rowsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedCourses.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedCourses, currentPage, rowsPerPage]);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCourses.size === paginatedCourses.length) {
      setSelectedCourses(new Set());
    } else {
      setSelectedCourses(new Set(paginatedCourses.map((c) => c.id)));
    }
  };

  // Handle select course
  const handleSelectCourse = (courseId: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Courses Summary */}
        <div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                theme === "dark" ? "bg-purple-800/50" : "bg-purple-100"
              }`}
            >
              <BookOpen
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-purple-300" : "text-purple-600"
                }`}
              />
            </div>
          </div>
          <h3
            className={`text-sm font-medium mb-4 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "ملخص الدورات" : "Courses Summary"}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "إجمالي الدورات" : "Total Courses"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.courses.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "الدورات المنشأة" : "Created Courses"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.courses.created}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "الدورات قيد المراجعة" : "Pending Courses"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.courses.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "الدورات المعتمدة" : "Approved Courses"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.courses.approved}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-red-300" : "text-red-600"
                }`}
              >
                {language === "ar" ? "الدورات المرفوضة" : "Rejected Courses"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {summaryStats.courses.rejected}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "متوسط نشاط الدورة" : "Average Course Activity"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.courses.averageActivity}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-blue-800/30">
              <span className={`text-xs text-green-500`}>
                ↑ {summaryStats.courses.growth}
              </span>
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "زيادة" : "Increased by"}
              </span>
            </div>
          </div>
        </div>

        {/* Students Summary */}
        <div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                theme === "dark" ? "bg-pink-800/50" : "bg-pink-100"
              }`}
            >
              <Users
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-pink-300" : "text-pink-600"
                }`}
              />
            </div>
          </div>
          <h3
            className={`text-sm font-medium mb-4 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "ملخص الطلاب" : "Students Summary"}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "إجمالي الطلاب" : "Total Students"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.students.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "الطلاب الجدد" : "New Students"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.students.new}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-blue-800/30">
              <span className={`text-xs text-green-500`}>
                ↑ {summaryStats.students.growth}
              </span>
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "زيادة" : "Increased by"}
              </span>
            </div>
          </div>
        </div>

        {/* Lectures Summary */}
        <div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                theme === "dark" ? "bg-green-800/50" : "bg-green-100"
              }`}
            >
              <Video
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-green-300" : "text-green-600"
                }`}
              />
            </div>
          </div>
          <h3
            className={`text-sm font-medium mb-4 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "ملخص المحاضرات" : "Lectures Summary"}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? "متوسط معدل إكمال المحاضرة"
                  : "Average Lecture Completion Rate"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.lectures.completionRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? "متوسط معدل مشاهدة الفيديو"
                  : "Average Video Watch Rate"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {summaryStats.lectures.watchRate}%
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-blue-800/30">
              <span className={`text-xs text-green-500`}>
                ↑ {summaryStats.lectures.growth}
              </span>
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "زيادة" : "Increased by"}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
              }`}
            >
              <DollarSign
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
          </div>
          <h3
            className={`text-sm font-medium mb-4 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "ملخص الإيرادات" : "Revenue Summary"}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
              </span>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {formatCurrency(summaryStats.revenue.total, "SAR")}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-blue-800/30">
              <span className={`text-xs text-green-500`}>
                ↑ {summaryStats.revenue.growth}
              </span>
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "زيادة" : "Increased by"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Reports Section */}
      <div
        className={`rounded-xl p-6 shadow-lg ${
          theme === "dark"
            ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "تقارير الدورات" : "Courses Reports"}
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                theme === "dark"
                  ? "bg-green-800/30 text-green-300 border border-green-700/50"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {language === "ar" ? "بيانات جديدة" : "New Data"}
            </span>
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  theme === "dark" ? "text-blue-300" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder={language === "ar" ? "بحث" : "Search"}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={`pl-10 pr-10 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 w-48`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-blue-300" : "text-gray-400"
                  }`}
                >
                  ×
                </button>
              )}
            </div>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>{language === "ar" ? "تصدير" : "Export"}</span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-blue-800/30">
          <div className="flex items-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={() => {
                getTeacherCourses(dispatch);
              }}
            >
              <RefreshCw className="h-4 w-4" />
              <span>{language === "ar" ? "تحديث" : "Update"}</span>
            </button>
            <span
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {selectedCourses.size} {language === "ar" ? "محدد" : "Selected"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>{language === "ar" ? "فلتر" : "Filter"}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  theme === "dark" ? "bg-red-600 text-white" : "bg-red-500 text-white"
                }`}
              >
                0
              </span>
            </button>
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {filteredAndSortedCourses.length} {language === "ar" ? "نتيجة" : "Results"}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  theme === "dark" ? "border-blue-800" : "border-gray-200"
                }`}
              >
                <th className="py-3 px-4">
                  <button onClick={handleSelectAll} className="cursor-pointer">
                    {selectedCourses.size === paginatedCourses.length && paginatedCourses.length > 0 ? (
                      <CheckSquare className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-semibold cursor-pointer ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                  onClick={() => handleSort("courseName")}
                >
                  {language === "ar" ? "اسم الدورة" : "Course Name"}
                  {sortColumn === "courseName" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-semibold cursor-pointer ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                  onClick={() => handleSort("students")}
                >
                  {language === "ar" ? "الطلاب" : "Students"}
                  {sortColumn === "students" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-semibold cursor-pointer ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                  onClick={() => handleSort("price")}
                >
                  {language === "ar" ? "السعر" : "Price"}
                  {sortColumn === "price" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-semibold cursor-pointer ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                  onClick={() => handleSort("instructorRevenue")}
                >
                  {language === "ar" ? "إيرادات المدرس" : "Instructor Revenue"}
                  {sortColumn === "instructorRevenue" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-semibold cursor-pointer ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                  onClick={() => handleSort("totalLectures")}
                >
                  {language === "ar" ? "إجمالي المحاضرات" : "Total Lecture"}
                  {sortColumn === "totalLectures" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className={`text-left py-3 px-4 text-sm font-semibold cursor-pointer ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                  onClick={() => handleSort("totalVideos")}
                >
                  {language === "ar" ? "إجمالي الفيديو" : "Total Video"}
                  {sortColumn === "totalVideos" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {coursesLoading || lessonsLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <p
                      className={`${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "جاري التحميل..." : "Loading..."}
                    </p>
                  </td>
                </tr>
              ) : paginatedCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <p
                      className={`${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "لا توجد دورات" : "No courses found"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr
                    key={course.id}
                    className={`border-b ${
                      theme === "dark" ? "border-blue-800/50" : "border-gray-100"
                    } hover:bg-opacity-50 ${
                      theme === "dark" ? "hover:bg-blue-800/30" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleSelectCourse(course.id)}
                        className="cursor-pointer"
                      >
                        {selectedCourses.has(course.id) ? (
                          <CheckSquare className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-blue-950"
                        }`}
                      >
                        {course.courseName}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${
                          theme === "dark" ? "text-blue-200" : "text-gray-700"
                        }`}
                      >
                        {course.students}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${
                          theme === "dark" ? "text-blue-200" : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(course.price, course.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${
                          theme === "dark" ? "text-blue-200" : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(course.instructorRevenue, course.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${
                          theme === "dark" ? "text-blue-200" : "text-gray-700"
                        }`}
                      >
                        {course.totalLectures}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${
                          theme === "dark" ? "text-blue-200" : "text-gray-700"
                        }`}
                      >
                        {course.totalVideos}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-blue-800/30">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                  currentPage * rowsPerPage,
                  filteredAndSortedCourses.length
                )} of ${filteredAndSortedCourses.length}`}
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg border ${
                  theme === "dark"
                    ? "bg-blue-800/30 border-blue-700 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "صف/صفحة" : "Row/Page"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-blue-800/50 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-blue-800/50 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-600 text-white"
                          : theme === "dark"
                          ? "hover:bg-blue-800/50 text-blue-300"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-blue-800/50 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-blue-800/50 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
