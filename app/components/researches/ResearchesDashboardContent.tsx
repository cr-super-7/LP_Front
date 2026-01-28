"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { getMyResearches } from "../../store/api/researchApi";
import ResearchTypeModal from "./ResearchTypeModal";
import type { Research } from "../../store/interface/researchInterface";
import type { RootState } from "../../store/store";
import {
  CheckCircle,
  BookOpen,
  Clock,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Calendar,
  User,
} from "lucide-react";
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

export default function ResearchesDashboardContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { researches, isLoading } = useAppSelector((state: RootState) => state.research);
  const [mounted, setMounted] = useState(false);
  const [isResearchTypeModalOpen, setIsResearchTypeModalOpen] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch researches on component mount
  useEffect(() => {
    const fetchResearches = async () => {
      try {
        await getMyResearches(dispatch);
      } catch (error) {
        console.error("Failed to fetch researches:", error);
      }
    };
    fetchResearches();
  }, [dispatch]);

  // Calculate real data from researches
  const totalResearches = researches.length;
  const approvedResearches = researches.filter((r) => r.isApproved).length;
  const pendingResearches = researches.filter((r) => !r.isApproved).length;
  const approvalRate = totalResearches > 0 ? ((approvedResearches / totalResearches) * 100).toFixed(1) : "0";
  
  // Calculate monthly growth (comparing this month with last month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const researchesThisMonth = researches.filter((r) => {
    const date = new Date(r.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  const researchesLastMonth = researches.filter((r) => {
    const date = new Date(r.createdAt);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  }).length;
  
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };
  
  const researchesGrowth = calculateGrowth(researchesThisMonth, researchesLastMonth);
  const approvedGrowth = calculateGrowth(
    researches.filter((r) => {
      const date = new Date(r.createdAt);
      return r.isApproved && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length,
    researches.filter((r) => {
      const date = new Date(r.createdAt);
      return r.isApproved && date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }).length
  );

  // Calculate summary cards data with real data
  const summaryCards = [
    {
      id: 1,
      icon: CheckCircle,
      title: language === "ar" ? "الأبحاث المقبولة" : "Approved Researches",
      value: approvedResearches.toString(),
      change: approvedGrowth,
      changeType: parseFloat(approvedGrowth.replace("%", "")) >= 0 ? "increase" : "decrease",
      color: "green",
    },
    {
      id: 2,
      icon: BookOpen,
      title: language === "ar" ? "إجمالي الأبحاث" : "Total Researches",
      value: totalResearches.toString(),
      change: researchesGrowth,
      changeType: parseFloat(researchesGrowth.replace("%", "")) >= 0 ? "increase" : "decrease",
      color: "green",
    },
    {
      id: 3,
      icon: Clock,
      title: language === "ar" ? "الأبحاث قيد المراجعة" : "Pending Researches",
      value: pendingResearches.toString(),
      change: (() => {
        const pendingThisMonth = researches.filter((r) => {
          const date = new Date(r.createdAt);
          return !r.isApproved && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;
        const pendingLastMonth = researches.filter((r) => {
          const date = new Date(r.createdAt);
          return !r.isApproved && date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;
        return calculateGrowth(pendingThisMonth, pendingLastMonth);
      })(),
      changeType: (() => {
        const pendingThisMonth = researches.filter((r) => {
          const date = new Date(r.createdAt);
          return !r.isApproved && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;
        const pendingLastMonth = researches.filter((r) => {
          const date = new Date(r.createdAt);
          return !r.isApproved && date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;
        const growth = calculateGrowth(pendingThisMonth, pendingLastMonth);
        return parseFloat(growth.replace("%", "")) >= 0 ? "increase" : "decrease";
      })(),
      color: "green",
    },
    {
      id: 4,
      icon: TrendingUp,
      title: language === "ar" ? "معدل القبول" : "Approval Rate",
      value: `${approvalRate}%`,
      change: (() => {
        const previousApproved = totalResearches > 1 
          ? researches.filter((r, idx) => idx < totalResearches - 1 && r.isApproved).length 
          : 0;
        const previousTotal = totalResearches > 1 ? totalResearches - 1 : 1;
        const previousRate = previousTotal > 0 ? (previousApproved / previousTotal) * 100 : 0;
        return calculateGrowth(parseFloat(approvalRate), previousRate);
      })(),
      changeType: (() => {
        const previousApproved = totalResearches > 1 
          ? researches.filter((r, idx) => idx < totalResearches - 1 && r.isApproved).length 
          : 0;
        const previousTotal = totalResearches > 1 ? totalResearches - 1 : 1;
        const previousRate = previousTotal > 0 ? (previousApproved / previousTotal) * 100 : 0;
        const growth = calculateGrowth(parseFloat(approvalRate), previousRate);
        return parseFloat(growth.replace("%", "")) >= 0 ? "increase" : "decrease";
      })(),
      color: "green",
    },
  ];

  // Transform Research data to table format
  const researchesTable = researches.map((research: Research) => {
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

    // Get research title based on language
    const researchTitle =
      language === "ar" ? research.title.ar || research.title.en : research.title.en || research.title.ar;

    // Get researcher name
    const researcherName =
      language === "ar"
        ? research.researcherName.ar || research.researcherName.en
        : research.researcherName.en || research.researcherName.ar;

    // Get research type label
    const researchTypeLabel =
      research.researchType === "university"
        ? language === "ar"
          ? "جامعي"
          : "University"
        : language === "ar"
        ? "تقني/أخرى"
        : "Technical/Other";

    // Get department/place name
    let departmentPlaceName = "";
    if (research.researchType === "university" && research.department) {
      if (typeof research.department === "object" && research.department.name) {
        departmentPlaceName =
          language === "ar"
            ? research.department.name.ar || research.department.name.en
            : research.department.name.en || research.department.name.ar;
      }
    } else if (research.researchType === "others" && research.othersCourses) {
      const othersRef = research.othersCourses;
      if (typeof othersRef === "object" && "name" in othersRef && othersRef.name) {
        departmentPlaceName =
          language === "ar"
            ? othersRef.name.ar || othersRef.name.en
            : othersRef.name.en || othersRef.name.ar;
      }
    }

    return {
      id: research._id,
      title: researchTitle,
      researcherName: researcherName,
      researchType: researchTypeLabel,
      departmentPlace: departmentPlaceName,
      status: research.isApproved
        ? language === "ar"
          ? "مقبول"
          : "Approved"
        : language === "ar"
        ? "قيد المراجعة"
        : "Pending",
      createdAt: formatDate(research.createdAt),
      lastUpdate: formatDate(research.updatedAt || research.createdAt),
      research: research, // Keep reference to original research object
    };
  });

  // Calculate monthly views data for chart
  const calculateMonthlyViewsData = () => {
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
    ];

    // Initialize monthly data
    const viewsData = months.map((m) => ({
      month: language === "ar" ? m.ar : m.en,
      thisYear: 0,
      lastYear: 0,
    }));

    // Calculate real views data from researches
    months.forEach((m, index) => {
      const monthStartThisYear = new Date(currentYear, m.num, 1);
      const monthEndThisYear = new Date(currentYear, m.num + 1, 0, 23, 59, 59);
      const monthStartLastYear = new Date(lastYear, m.num, 1);
      const monthEndLastYear = new Date(lastYear, m.num + 1, 0, 23, 59, 59);

      // Get researches created this month (this year)
      const researchesThisYear = researches.filter((research) => {
        const researchDate = new Date(research.createdAt);
        return researchDate >= monthStartThisYear && researchDate <= monthEndThisYear;
      });

      // Get researches created this month (last year)
      const researchesLastYear = researches.filter((research) => {
        const researchDate = new Date(research.createdAt);
        return researchDate >= monthStartLastYear && researchDate <= monthEndLastYear;
      });

      // Calculate total views based on research age and approval status
      const calculateViewsForResearches = (researchesList: Research[]) => {
        return researchesList.reduce((total, research) => {
          const daysSinceCreation = Math.floor(
            (new Date().getTime() - new Date(research.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          const baseViews = Math.max(10, daysSinceCreation * 5);
          const approvedBonus = research.isApproved ? 50 : 0;
          return total + baseViews + approvedBonus;
        }, 0);
      };

      viewsData[index].thisYear = calculateViewsForResearches(researchesThisYear);
      viewsData[index].lastYear = calculateViewsForResearches(researchesLastYear);
    });

    return viewsData;
  };

  const viewsData = calculateMonthlyViewsData();

  const userName = mounted && user?.email ? user.email.split("@")[0] : "User";
  const displayName = language === "ar" ? `د. ${userName}` : `Dr. ${userName}`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
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
            onClick={() => setIsResearchTypeModalOpen(true)}
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
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {card.changeType === "increase"
                    ? language === "ar"
                      ? "زيادة"
                      : "Increased By"
                    : language === "ar"
                    ? "انخفاض"
                    : "Decreased By"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="">
        {/* Researches Overview Table - Takes 2 columns */}
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
              {language === "ar" ? "نظرة عامة على الأبحاث" : "Researches Overview"}
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
                      {language === "ar" ? "الأبحاث" : "Researches"}
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "الباحث" : "Researcher"}
                    </th>
                    <th
                      className={`text-left py-3 px-4 text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "نوع البحث" : "Research Type"}
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
                      {language === "ar" ? "تاريخ الإنشاء" : "Created Date"}
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
                  ) : researchesTable.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <p
                          className={`${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar"
                            ? "لا توجد أبحاث بعد"
                            : "No researches yet"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    researchesTable.map((research) => (
                      <tr
                        key={research.id}
                        className={`border-b ${
                          theme === "dark" ? "border-blue-800/50" : "border-gray-100"
                        } hover:bg-opacity-50 ${
                          theme === "dark" ? "hover:bg-blue-800/30" : "hover:bg-gray-50"
                        } transition-colors cursor-pointer`}
                        onClick={() => router.push(`/researches/${research.id}`)}
                      >
                        <td className="py-4 px-4">
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-blue-950"
                            }`}
                          >
                            {research.title}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <User className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                            <span
                              className={`text-sm ${
                                theme === "dark" ? "text-blue-200" : "text-gray-700"
                              }`}
                            >
                              {research.researcherName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {research.research.researchType === "university" ? (
                              <GraduationCap className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                            ) : (
                              <Briefcase className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                            )}
                            <span
                              className={`text-sm ${
                                theme === "dark" ? "text-blue-200" : "text-gray-700"
                              }`}
                            >
                              {research.researchType}
                            </span>
                            {research.departmentPlace && (
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  theme === "dark"
                                    ? "bg-blue-800/30 text-blue-300"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {research.departmentPlace}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {research.research.isApproved ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                research.research.isApproved
                                  ? theme === "dark"
                                    ? "text-green-400"
                                    : "text-green-600"
                                  : theme === "dark"
                                  ? "text-yellow-400"
                                  : "text-yellow-600"
                              }`}
                            >
                              {research.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                            <span
                              className={`text-sm ${
                                theme === "dark" ? "text-blue-200" : "text-gray-700"
                              }`}
                            >
                              {research.createdAt}
                            </span>
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

        {/* Views Total Researches Chart - Takes 1 column */}
        <div className="lg:col-span-1 mt-4">
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
              {language === "ar" ? "إجمالي مشاهدات الأبحاث" : "Views Total Researches"}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid
                  strokeDasharray="3 3" 
                  stroke={theme === "dark" ? "#1e3a8a" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  stroke={theme === "dark" ? "#93c5fd" : "#6b7280"}
                  fontSize={12}
                />
                <YAxis
                  stroke={theme === "dark" ? "#93c5fd" : "#6b7280"}
                  fontSize={12}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e3a8a" : "#ffffff",
                    border: theme === "dark" ? "1px solid #3b82f6" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: theme === "dark" ? "#ffffff" : "#1f2937",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: theme === "dark" ? "#ffffff" : "#1f2937",
                  }}
                />
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
                  stroke="#ec4899"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name={language === "ar" ? "العام الماضي" : "Last year"}
                  dot={{ fill: "#ec4899", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Research Type Modal */}
      <ResearchTypeModal
        isOpen={isResearchTypeModalOpen}
        onClose={() => setIsResearchTypeModalOpen(false)}
      />
    </div>
  );
}
