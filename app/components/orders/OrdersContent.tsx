"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Users,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyOrders } from "../../store/api/orderApi";
import type { Order, OrderCourse } from "../../store/interface/orderInterface";

// ============================================
// Types
// ============================================
type OrderStatus = "pending" | "completed" | "cancelled";
type FilterStatus = "all" | OrderStatus;

// ============================================
// Helper Functions
// ============================================

// Format number for display (e.g., 1500 -> 1.5K)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// Get order total
const getOrderTotal = (order: Order): number => {
  return order.totalPayment ?? order.total ?? 0;
};

// Get order courses (supports both new and legacy API format)
const getOrderCourses = (order: Order): OrderCourse[] => {
  // New API format uses courses array directly
  if (order.courses && order.courses.length > 0) {
    return order.courses;
  }
  // Legacy format uses items array with course object
  if (order.items && order.items.length > 0) {
    return order.items
      .filter((item) => item.course)
      .map((item) => item.course as OrderCourse);
  }
  return [];
};

// Get currency from order
const getCurrency = (order: Order): string => {
  if (order.courses && order.courses.length > 0) {
    return order.courses[0]?.currency || "SAR";
  }
  if (order.items && order.items.length > 0) {
    return order.items[0]?.course?.currency || "SAR";
  }
  return "SAR";
};

// ============================================
// Sub-Components
// ============================================

// Status Badge Component
interface StatusBadgeProps {
  status: OrderStatus;
  theme: "dark" | "light";
  language: "ar" | "en";
}

function StatusBadge({ status, theme, language }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: language === "ar" ? "مكتمل" : "Completed",
          colors:
            theme === "dark"
              ? "bg-green-500/20 text-green-300 border-green-500/30"
              : "bg-green-100 text-green-700 border-green-200",
        };
      case "cancelled":
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: language === "ar" ? "ملغي" : "Cancelled",
          colors:
            theme === "dark"
              ? "bg-red-500/20 text-red-300 border-red-500/30"
              : "bg-red-100 text-red-700 border-red-200",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: language === "ar" ? "قيد الانتظار" : "Pending",
          colors:
            theme === "dark"
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
              : "bg-yellow-100 text-yellow-700 border-yellow-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.colors}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  theme: "dark" | "light";
  iconBgColor: string;
}

function StatsCard({ icon, value, label, theme, iconBgColor }: StatsCardProps) {
  return (
    <div
      className={`rounded-xl p-4 ${
        theme === "dark"
          ? "bg-blue-900/50 border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>{icon}</div>
        <div>
          <p
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {value}
          </p>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

// Course Item in Order
interface OrderCourseItemProps {
  course: OrderCourse;
  theme: "dark" | "light";
  language: "ar" | "en";
  onClick: () => void;
}

function OrderCourseItem({
  course,
  theme,
  language,
  onClick,
}: OrderCourseItemProps) {
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;

  return (
    <div
      onClick={onClick}
      className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
        theme === "dark"
          ? "bg-blue-800/20 hover:bg-blue-800/40"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div className="relative h-20 w-28 rounded-lg overflow-hidden shrink-0">
        <Image
          src={course.thumbnail || "/images/courses/course-placeholder.jpg"}
          alt={courseTitle}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`text-lg font-semibold mb-2 line-clamp-1 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {courseTitle}
        </h3>
        {/* Course Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Enroll Count */}
          {course.enrollCount !== undefined && course.enrollCount > 0 && (
            <div className="flex items-center gap-1">
              <Users
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-green-300" : "text-green-600"
                }`}
              />
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {formatNumber(course.enrollCount)}{" "}
                {language === "ar" ? "مسجل" : "enrolled"}
              </span>
            </div>
          )}
          {/* Play Count */}
          {course.playCount !== undefined && course.playCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-purple-300" : "text-purple-600"
                }`}
              />
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {formatNumber(course.playCount)}{" "}
                {language === "ar" ? "مشاهدة" : "views"}
              </span>
            </div>
          )}
          {/* Popularity Score */}
          {course.popularityScore !== undefined &&
            course.popularityScore > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp
                  className={`h-4 w-4 ${
                    theme === "dark" ? "text-yellow-300" : "text-yellow-600"
                  }`}
                />
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {course.popularityScore.toFixed(0)}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

// Single Order Card
interface OrderCardProps {
  order: Order;
  theme: "dark" | "light";
  language: "ar" | "en";
  onCourseClick: (courseId: string) => void;
}

function OrderCard({ order, theme, language, onCourseClick }: OrderCardProps) {
  const courses = getOrderCourses(order);
  const total = getOrderTotal(order);
  const currency = getCurrency(order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl overflow-hidden ${
        theme === "dark"
          ? "bg-blue-900/50 border border-blue-800/50"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      {/* Order Header */}
      <div
        className={`p-4 border-b ${
          theme === "dark" ? "border-blue-800/50" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge
              status={order.status}
              theme={theme}
              language={language}
            />
            <div className="flex items-center gap-1.5">
              <Calendar
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {new Date(order.createdAt).toLocaleDateString(
                  language === "ar" ? "ar-SA" : "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>

          <div className="text-right">
            {/* Discount */}
            {order.discount && order.discount > 0 && (
              <p
                className={`text-sm line-through ${
                  theme === "dark" ? "text-blue-300" : "text-gray-400"
                }`}
              >
                {(order.subtotal ?? total + order.discount).toFixed(2)}{" "}
                {currency}
              </p>
            )}
            <div className="flex items-center gap-2">
              <CreditCard
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-green-300" : "text-green-600"
                }`}
              />
              <p
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {total.toFixed(2)} {currency}
              </p>
            </div>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-blue-300" : "text-gray-500"
              }`}
            >
              {language === "ar" ? "الطلب #" : "Order #"}
              {order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Order Courses */}
      <div className="p-4 space-y-3">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <OrderCourseItem
              key={course._id || index}
              course={course}
              theme={theme}
              language={language}
              onClick={() => onCourseClick(course._id)}
            />
          ))
        ) : (
          <p
            className={`text-sm text-center py-4 ${
              theme === "dark" ? "text-blue-300" : "text-gray-500"
            }`}
          >
            {language === "ar" ? "لا توجد دورات" : "No courses"}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// Main Component
// ============================================
export default function OrdersContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const hasLoadedRef = useRef(false);

  // Load orders
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      setError(
        language === "ar"
          ? "يرجى تسجيل الدخول لعرض طلباتك"
          : "Please login to view your orders"
      );
      return;
    }

    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const ordersData = await getMyOrders(dispatch);
        setOrders(ordersData);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError(
          language === "ar"
            ? "فشل في تحميل الطلبات. يرجى المحاولة مرة أخرى."
            : "Failed to load orders. Please try again."
        );
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [dispatch, isAuthenticated, language]);

  // Filter orders
  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Stats
  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.status === "completed").length,
    pending: orders.filter((o) => o.status === "pending").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // Handlers
  const handleRetry = () => {
    hasLoadedRef.current = false;
    setError(null);
    setIsLoading(true);

    const reload = async () => {
      try {
        const ordersData = await getMyOrders(dispatch);
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        setError(
          language === "ar"
            ? "فشل في تحميل الطلبات. يرجى المحاولة مرة أخرى."
            : "Failed to load orders. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    reload();
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <AlertCircle
            className={`h-20 w-20 ${
              theme === "dark" ? "text-red-400" : "text-red-500"
            }`}
          />
          <h2
            className={`text-2xl font-bold text-center ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {error}
          </h2>
          <div className="flex gap-3">
            {!isAuthenticated ? (
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </button>
            ) : (
              <button
                onClick={handleRetry}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </button>
            )}
            <button
              onClick={() => router.push("/courses")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                theme === "dark"
                  ? "bg-blue-900/50 text-white hover:bg-blue-900"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? "تصفح الدورات" : "Browse Courses"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package
            className={`h-8 w-8 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "طلباتي" : "My Orders"}
          </h1>
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {language === "ar"
            ? "عرض وتتبع جميع طلباتك"
            : "View and track all your orders"}
        </p>
      </div>

      {/* Stats Cards */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={
              <ShoppingBag
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              />
            }
            value={stats.total}
            label={language === "ar" ? "إجمالي" : "Total"}
            theme={theme}
            iconBgColor={theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"}
          />
          <StatsCard
            icon={
              <CheckCircle
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-green-300" : "text-green-600"
                }`}
              />
            }
            value={stats.completed}
            label={language === "ar" ? "مكتملة" : "Completed"}
            theme={theme}
            iconBgColor={theme === "dark" ? "bg-green-800/50" : "bg-green-100"}
          />
          <StatsCard
            icon={
              <Clock
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-yellow-300" : "text-yellow-600"
                }`}
              />
            }
            value={stats.pending}
            label={language === "ar" ? "قيد الانتظار" : "Pending"}
            theme={theme}
            iconBgColor={
              theme === "dark" ? "bg-yellow-800/50" : "bg-yellow-100"
            }
          />
          <StatsCard
            icon={
              <XCircle
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-red-300" : "text-red-600"
                }`}
              />
            }
            value={stats.cancelled}
            label={language === "ar" ? "ملغية" : "Cancelled"}
            theme={theme}
            iconBgColor={theme === "dark" ? "bg-red-800/50" : "bg-red-100"}
          />
        </div>
      )}

      {/* Filter Tabs */}
      {orders.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "completed", "cancelled"] as FilterStatus[]).map(
            (filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "bg-blue-900/50 text-blue-200 hover:bg-blue-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filterOption === "all"
                  ? language === "ar"
                    ? "الكل"
                    : "All"
                  : filterOption === "pending"
                  ? language === "ar"
                    ? "قيد الانتظار"
                    : "Pending"
                  : filterOption === "completed"
                  ? language === "ar"
                    ? "مكتملة"
                    : "Completed"
                  : language === "ar"
                  ? "ملغية"
                  : "Cancelled"}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-black/20">
                  {filterOption === "all"
                    ? stats.total
                    : filterOption === "pending"
                    ? stats.pending
                    : filterOption === "completed"
                    ? stats.completed
                    : stats.cancelled}
                </span>
              </button>
            )
          )}
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <Package
            className={`h-20 w-20 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "لا توجد طلبات" : "No orders yet"}
          </h2>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "ابدأ بشراء الدورات لرؤية طلباتك هنا"
              : "Start purchasing courses to see your orders here"}
          </p>
          <button
            onClick={() => router.push("/courses")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {language === "ar" ? "تصفح الدورات" : "Browse Courses"}
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-4">
          <Package
            className={`h-16 w-16 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <p
            className={`text-lg ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لا توجد طلبات في هذا القسم"
              : "No orders in this section"}
          </p>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              theme={theme}
              language={language}
              onCourseClick={handleCourseClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
