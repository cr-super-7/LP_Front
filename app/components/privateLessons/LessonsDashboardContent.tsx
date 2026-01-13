"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { getMyPrivateLessons } from "../../store/api/privateLessonApi";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";
import PrivateLessonTypeModal from "./PrivateLessonTypeModal";
import {
  DollarSign,
  GraduationCap,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { RootState } from "../../store/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LessonsDashboardContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { privateLessons, isLoading } = useAppSelector((state: RootState) => state.privateLesson);
  const [mounted, setMounted] = useState(false);
  const [isLessonTypeModalOpen, setIsLessonTypeModalOpen] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch private lessons on component mount
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        await getMyPrivateLessons(dispatch);
      } catch (error) {
        console.error("Failed to fetch private lessons:", error);
      }
    };
    fetchLessons();
  }, [dispatch]);

  // Calculate total earnings
  const calculateTotalEarnings = () => {
    return privateLessons.reduce((sum, lesson) => sum + (lesson.price || 0), 0);
  };

  // Calculate summary cards data
  const totalEarnings = calculateTotalEarnings();
  const totalLessons = privateLessons.length;
  const publishedLessons = privateLessons.filter((lesson) => lesson.isPublished === true).length;
  const pendingLessons = privateLessons.filter(
    (lesson) => 
      lesson.isPublished === false && 
      lesson.status !== "approved" && 
      lesson.status !== "rejected"
  ).length;

  // Calculate growth percentages (comparing current month vs previous month)
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = new Date().getFullYear();
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthLessons = privateLessons.filter((lesson) => {
    const lessonDate = new Date(lesson.createdAt);
    return lessonDate.getMonth() === currentMonth && lessonDate.getFullYear() === currentYear;
  }).length;

  const previousMonthLessons = privateLessons.filter((lesson) => {
    const lessonDate = new Date(lesson.createdAt);
    return lessonDate.getMonth() === previousMonth && lessonDate.getFullYear() === previousYear;
  }).length;

  const currentMonthEarnings = privateLessons
    .filter((lesson) => {
      const lessonDate = new Date(lesson.createdAt);
      return lessonDate.getMonth() === currentMonth && lessonDate.getFullYear() === currentYear;
    })
    .reduce((sum, lesson) => sum + (lesson.price || 0), 0);

  const previousMonthEarnings = privateLessons
    .filter((lesson) => {
      const lessonDate = new Date(lesson.createdAt);
      return lessonDate.getMonth() === previousMonth && lessonDate.getFullYear() === previousYear;
    })
    .reduce((sum, lesson) => sum + (lesson.price || 0), 0);

  const summaryCards = [
    {
      id: 1,
      icon: DollarSign,
      title: language === "ar" ? "أرباحي" : "My Earnings",
      value: `${totalEarnings.toLocaleString()} ${privateLessons[0]?.currency || "SAR"}`,
      change: calculateGrowth(currentMonthEarnings, previousMonthEarnings),
      changeType: currentMonthEarnings >= previousMonthEarnings ? ("increase" as const) : ("decrease" as const),
      color: "green",
    },
    {
      id: 2,
      icon: GraduationCap,
      title: language === "ar" ? "إجمالي الدروس" : "Total Lessons",
      value: totalLessons.toString(),
      change: calculateGrowth(currentMonthLessons, previousMonthLessons),
      changeType: currentMonthLessons >= previousMonthLessons ? ("increase" as const) : ("decrease" as const),
      color: "green",
    },
    {
      id: 3,
      icon: CheckCircle,
      title: language === "ar" ? "الدروس المنشورة" : "Published Lessons",
      value: publishedLessons.toString(),
      change: calculateGrowth(
        privateLessons.filter(
          (l) =>
            l.isPublished === true &&
            new Date(l.createdAt).getMonth() === currentMonth &&
            new Date(l.createdAt).getFullYear() === currentYear
        ).length,
        privateLessons.filter(
          (l) =>
            l.isPublished === true &&
            new Date(l.createdAt).getMonth() === previousMonth &&
            new Date(l.createdAt).getFullYear() === previousYear
        ).length
      ),
      changeType: "increase" as const,
      color: "green",
    },
    {
      id: 4,
      icon: Clock,
      title: language === "ar" ? "الدروس قيد المراجعة" : "Pending Lessons",
      value: pendingLessons.toString(),
      change: calculateGrowth(
        privateLessons.filter(
          (l) =>
            l.isPublished === false &&
            l.status !== "approved" &&
            l.status !== "rejected" &&
            new Date(l.createdAt).getMonth() === currentMonth &&
            new Date(l.createdAt).getFullYear() === currentYear
        ).length,
        privateLessons.filter(
          (l) =>
            l.isPublished === false &&
            l.status !== "approved" &&
            l.status !== "rejected" &&
            new Date(l.createdAt).getMonth() === previousMonth &&
            new Date(l.createdAt).getFullYear() === previousYear
        ).length
      ),
      changeType: "increase" as const,
      color: "yellow",
    },
  ];

  // Transform PrivateLesson data to table format
  const lessonsTable = privateLessons.map((lesson: PrivateLesson) => {
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

    // Get lesson name based on language
    const lessonName =
      typeof lesson.lessonName === "string"
        ? lesson.lessonName
        : language === "ar"
        ? lesson.lessonName.ar
        : lesson.lessonName.en;

    // Map status
    const getStatus = () => {
      if (lesson.isPublished === true) {
        return {
          status: language === "ar" ? "منشور" : "Published",
          statusColor: "green",
        };
      } else if (lesson.status === "approved") {
        return {
          status: language === "ar" ? "مقبول" : "Approved",
          statusColor: "green",
        };
      } else if (lesson.status === "rejected") {
        return {
          status: language === "ar" ? "مرفوض" : "Rejected",
          statusColor: "red",
        };
      } else {
        return {
          status: language === "ar" ? "قيد المراجعة" : "Pending",
          statusColor: "yellow",
        };
      }
    };

    const statusInfo = getStatus();

    return {
      id: lesson._id,
      name: lessonName,
      price: `${lesson.price} ${lesson.currency}`,
      lastUpdate: formatDate(lesson.updatedAt || lesson.createdAt),
      status: statusInfo.status,
      statusColor: statusInfo.statusColor,
      lesson: lesson,
    };
  });

  // Calculate monthly data for charts
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
    const lessonsGrowthData = months.map((m) => ({
      month: language === "ar" ? m.ar : m.en,
      lessons: 0,
    }));

    const earningsData = months.slice(0, 6).map((m) => ({
      month: language === "ar" ? m.ar : m.en,
      thisYear: 0,
      lastYear: 0,
    }));

    // Calculate lessons growth
    months.forEach((m, index) => {
      const monthStart = new Date(currentYear, m.num, 1);
      const monthEnd = new Date(currentYear, m.num + 1, 0, 23, 59, 59);

      const lessonsThisMonth = privateLessons.filter((lesson) => {
        const lessonDate = new Date(lesson.createdAt);
        return lessonDate >= monthStart && lessonDate <= monthEnd;
      }).length;

      lessonsGrowthData[index].lessons = lessonsThisMonth || (index > 0 ? lessonsGrowthData[index - 1].lessons : 0);
    });

    // Calculate earnings data
    months.slice(0, 6).forEach((m, index) => {
      const monthStartThisYear = new Date(currentYear, m.num, 1);
      const monthEndThisYear = new Date(currentYear, m.num + 1, 0, 23, 59, 59);
      const monthStartLastYear = new Date(lastYear, m.num, 1);
      const monthEndLastYear = new Date(lastYear, m.num + 1, 0, 23, 59, 59);

      const earningsThisYear = privateLessons
        .filter((lesson) => {
          const lessonDate = new Date(lesson.createdAt);
          return lessonDate >= monthStartThisYear && lessonDate <= monthEndThisYear;
        })
        .reduce((sum, lesson) => sum + (lesson.price || 0), 0);

      const earningsLastYear = privateLessons
        .filter((lesson) => {
          const lessonDate = new Date(lesson.createdAt);
          return lessonDate >= monthStartLastYear && lessonDate <= monthEndLastYear;
        })
        .reduce((sum, lesson) => sum + (lesson.price || 0), 0);

      earningsData[index].thisYear = earningsThisYear;
      earningsData[index].lastYear = earningsLastYear;
    });

    return { lessonsGrowthData, earningsData };
  };

  const { lessonsGrowthData, earningsData } = calculateMonthlyData();

  const getStatusColor = (color: string) => {
    const colors: Record<string, string> = {
      green: theme === "dark" ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700",
      yellow: theme === "dark" ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-700",
      orange: theme === "dark" ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700",
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
            onClick={() => setIsLessonTypeModalOpen(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <span>{language === "ar" ? "إنشاء درس خاص جديد" : "Create new Private Lesson"}</span>
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
        {/* Lessons Overview Table - Takes 2 columns */}
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
              {language === "ar" ? "نظرة عامة على الدروس" : "Lessons Overview"}
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
                      {language === "ar" ? "الدرس" : "Lesson"}
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "السعر" : "Price"}
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
                  {isLoading ? (
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
                  ) : lessonsTable.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <p
                          className={`${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "لا توجد دروس حتى الآن" : "No lessons yet"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    lessonsTable.map((lesson) => (
                      <tr
                        key={lesson.id}
                        className={`border-b cursor-pointer transition-colors ${
                          theme === "dark"
                            ? "border-blue-800 hover:bg-blue-800/30"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => router.push(`/private-lessons/${lesson.id}`)}
                      >
                        <td className="py-4 px-4">
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-blue-950"
                            }`}
                          >
                            {lesson.name}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-sm ${
                              theme === "dark" ? "text-blue-200" : "text-gray-700"
                            }`}
                          >
                            {lesson.price}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-sm ${
                              theme === "dark" ? "text-blue-200" : "text-gray-700"
                            }`}
                          >
                            {lesson.lastUpdate}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              lesson.statusColor
                            )}`}
                          >
                            {lesson.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/private-lessons/${lesson.id}`);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === "dark"
                                  ? "hover:bg-blue-800/50 text-blue-300"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Eye className="h-4 w-4" />
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

        {/* Charts - Right Column */}
        <div className="space-y-6">
          {/* Lessons Growth Chart */}
          <div
            className={`rounded-xl p-6 shadow-lg ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "نمو الدروس" : "Lessons Growth"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lessonsGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#1e3a8a" : "#e5e7eb"} />
                <XAxis
                  dataKey="month"
                  stroke={theme === "dark" ? "#93c5fd" : "#6b7280"}
                  fontSize={12}
                />
                <YAxis stroke={theme === "dark" ? "#93c5fd" : "#6b7280"} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e3a8a" : "#ffffff",
                    border: theme === "dark" ? "1px solid #3b82f6" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lessons"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* My Earnings Chart */}
          <div
            className={`rounded-xl p-6 shadow-lg ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "أرباحي" : "My Earnings"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#1e3a8a" : "#e5e7eb"} />
                <XAxis
                  dataKey="month"
                  stroke={theme === "dark" ? "#93c5fd" : "#6b7280"}
                  fontSize={12}
                />
                <YAxis stroke={theme === "dark" ? "#93c5fd" : "#6b7280"} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e3a8a" : "#ffffff",
                    border: theme === "dark" ? "1px solid #3b82f6" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="thisYear"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name={language === "ar" ? "هذا العام" : "This year"}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name={language === "ar" ? "العام الماضي" : "Last year"}
                  dot={{ fill: "#ef4444", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Private Lesson Type Modal */}
      <PrivateLessonTypeModal
        isOpen={isLessonTypeModalOpen}
        onClose={() => setIsLessonTypeModalOpen(false)}
      />
    </div>
  );
}
