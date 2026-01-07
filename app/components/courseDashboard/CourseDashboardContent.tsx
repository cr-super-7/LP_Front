"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector } from "../../store/hooks";
import {
  DollarSign,
  BookOpen,
  Users,
  Star,
  Plus,

  Edit,
  Eye,
  Trash2,
  Check,
  Grid3x3,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { RootState } from "../../store/store";

export default function CourseDashboardContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by only showing user-dependent content after mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data - سيتم استبدالها بالبيانات من API
  const summaryCards = [
    {
      id: 1,
      icon: DollarSign,
      title: language === "ar" ? "أرباحي" : "My Earnings",
      value: "$25,378",
      change: "+1.3%",
      changeType: "increase" as const,
      color: "green",
    },
    {
      id: 2,
      icon: BookOpen,
      title: language === "ar" ? "إجمالي الدورات" : "Total Courses",
      value: "10",
      change: "+1.3%",
      changeType: "increase" as const,
      color: "green",
    },
    {
      id: 3,
      icon: Users,
      title: language === "ar" ? "إجمالي الطلاب" : "Total Students",
      value: "1525",
      change: "+1.3%",
      changeType: "increase" as const,
      color: "green",
    },
    {
      id: 4,
      icon: Star,
      title: language === "ar" ? "التقييم العام" : "Overall Rating",
      value: "4.2",
      change: "-1.3%",
      changeType: "decrease" as const,
      color: "red",
    },
  ];

  const courses = [
    {
      id: 1,
      name: "UX/UI Design",
      students: 60,
      lastUpdate: "25 Apr 2025, 23:02 PM",
      status: "In Progress",
      statusColor: "purple",
    },
    {
      id: 2,
      name: "UX/UI Design",
      students: 10,
      lastUpdate: "25 Apr 2025, 23:02 PM",
      status: "Completed",
      statusColor: "green",
    },
    {
      id: 3,
      name: "UX/UI Design",
      students: 23,
      lastUpdate: "25 Apr 2025, 23:02 PM",
      status: "Pending",
      statusColor: "orange",
    },
    {
      id: 4,
      name: "UX/UI Design",
      students: 12,
      lastUpdate: "25 Apr 2025, 23:02 PM",
      status: "Approved",
      statusColor: "blue",
    },
    {
      id: 5,
      name: "UX/UI Design",
      students: 45,
      lastUpdate: "25 Apr 2025, 23:02 PM",
      status: "Rejected",
      statusColor: "red",
    },
  ];

  const todoItems = [
    { id: 1, text: "Human interaction Designs", completed: true },
    { id: 2, text: "Human interaction Designs", completed: true },
    { id: 3, text: "Human interaction Designs", completed: false },
    { id: 4, text: "Human interaction Designs", completed: false },
    { id: 5, text: "Human interaction Designs", completed: false },
  ];

  const topCourses = [
    {
      id: 1,
      name: "UX/UI Design",
      date: "21 Apr 2025",
      students: "2145 Students",
      rating: "4.5",
    },
    {
      id: 2,
      name: "UX/UI Design",
      date: "21 Apr 2025",
      students: "2145 Students",
      rating: "4.5",
    },
    {
      id: 3,
      name: "UX/UI Design",
      date: "21 Apr 2025",
      students: "2145 Students",
      rating: "4.5",
    },
  ];

  const [todos, setTodos] = useState(todoItems);

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
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
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-blue-900/50 text-blue-200"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === "ar" ? "3 مهام لإكمالها" : "3 tasks to complete"}
            </span>
          </div>
          <button
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
                  {courses.map((course) => (
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
                            className={`p-1.5 rounded ${
                              theme === "dark"
                                ? "hover:bg-blue-800/50 text-purple-400"
                                : "hover:bg-gray-100 text-purple-600"
                            }`}
                            aria-label="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className={`p-1.5 rounded ${
                              theme === "dark"
                                ? "hover:bg-blue-800/50 text-green-400"
                                : "hover:bg-gray-100 text-green-600"
                            }`}
                            aria-label="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className={`p-1.5 rounded ${
                              theme === "dark"
                                ? "hover:bg-blue-800/50 text-red-400"
                                : "hover:bg-gray-100 text-red-600"
                            }`}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - To Do List and Top Courses */}
        <div className="space-y-6">
          {/* To Do List */}
          <div
            className={`rounded-xl p-6 shadow-lg ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "قائمة المهام" : "To do List"}
              </h2>
              <button
                className={`p-2 rounded-lg ${
                  theme === "dark"
                    ? "hover:bg-blue-800/50 text-blue-300"
                    : "hover:bg-gray-100 text-blue-600"
                }`}
                aria-label="Add task"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleTodo(todo.id)}
                >
                  <div
                    className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? theme === "dark"
                          ? "bg-green-500 border-green-500"
                          : "bg-green-500 border-green-500"
                        : theme === "dark"
                        ? "border-blue-400"
                        : "border-gray-300"
                    }`}
                  >
                    {todo.completed && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? theme === "dark"
                          ? "text-blue-300 line-through"
                          : "text-gray-400 line-through"
                        : theme === "dark"
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

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
              {language === "ar" ? "أفضل دوراتك" : "Your Top Courses"}
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {topCourses.map((course) => (
                <div
                  key={course.id}
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-blue-800/30" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-blue-950"
                    }`}
                  >
                    {course.name}
                  </h3>
                  <p
                    className={`text-sm mb-1 ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {course.date}
                  </p>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {course.students}
                    </p>
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-semibold ${
                          theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                        }`}
                      >
                        {course.rating}
                      </span>
                      <Star
                        className={`h-4 w-4 ${
                          theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                        } fill-current`}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
          <div className="h-64 flex items-center justify-center">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "الرسم البياني سيتم إضافته قريباً"
                : "Chart will be added soon"}
            </p>
          </div>
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
          <div className="h-64 flex items-center justify-center">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "الرسم البياني سيتم إضافته قريباً"
                : "Chart will be added soon"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

