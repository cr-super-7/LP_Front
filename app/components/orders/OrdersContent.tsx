"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyOrders } from "../../store/api/orderApi";
import type { Order } from "../../store/interface/orderInterface";
import toast from "react-hot-toast";

export default function OrdersContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const ordersData = await getMyOrders(dispatch);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [dispatch, isAuthenticated, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === "ar") {
      switch (status) {
        case "completed":
          return "مكتمل";
        case "cancelled":
          return "ملغي";
        case "pending":
          return "قيد الانتظار";
        default:
          return status;
      }
    } else {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
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
            ? "عرض جميع الطلبات السابقة والحالية"
            : "View all your previous and current orders"}
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
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
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`rounded-2xl p-6 ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-blue-800/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-blue-200" : "text-gray-700"
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  >
                    {new Date(order.createdAt).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-blue-950"
                    }`}
                  >
                    {order.total.toFixed(2)}{" "}
                    {order.items[0]?.course?.currency || "SAR"}
                  </p>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  >
                    {language === "ar" ? "الطلب رقم" : "Order #"}
                    {order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const course = item.course;
                  if (!course) return null;

                  const courseTitle =
                    language === "ar" ? course.title.ar : course.title.en;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl bg-blue-800/20"
                    >
                      <div className="relative h-20 w-28 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={
                            course.thumbnail ||
                            "/images/courses/course-placeholder.jpg"
                          }
                          alt={courseTitle}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-semibold mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {courseTitle}
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {item.price.toFixed(2)}{" "}
                          {course.currency || "SAR"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
