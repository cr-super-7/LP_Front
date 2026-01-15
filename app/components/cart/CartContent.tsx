"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, ArrowLeft, Ticket, FileText } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCart, removeFromCart } from "../../store/api/cartApi";
import { createOrder } from "../../store/api/orderApi";
import type { Cart } from "../../store/interface/cartInterface";
import toast from "react-hot-toast";

export default function CartContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Load cart data
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const loadCart = async () => {
      try {
        setIsLoading(true);
        const cartData = await getCart(dispatch);
        setCart(cartData);
        // Select all items by default
        if (cartData && cartData.items && Array.isArray(cartData.items)) {
          const allItemIds = new Set(cartData.items.map((item) => item.courseId));
          setSelectedItems(allItemIds);
        } else {
          setSelectedItems(new Set());
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        setCart(null);
        setSelectedItems(new Set());
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [dispatch, isAuthenticated, router]);

  // Calculate totals
  const selectedCartItems = (cart?.items && Array.isArray(cart.items))
    ? cart.items.filter((item) => selectedItems.has(item.courseId))
    : [];

  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked && cart && cart.items && Array.isArray(cart.items)) {
      const allItemIds = new Set(cart.items.map((item) => item.courseId));
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  // Handle item selection
  const handleItemSelect = (courseId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(courseId);
    } else {
      newSelected.delete(courseId);
    }
    setSelectedItems(newSelected);
  };

  // Handle delete item
  const handleDeleteItem = async (courseId: string) => {
    try {
      await removeFromCart(courseId, dispatch);
      // Reload cart
      const cartData = await getCart(dispatch);
      setCart(cartData);
      // Remove from selected items
      const newSelected = new Set(selectedItems);
      newSelected.delete(courseId);
      setSelectedItems(newSelected);
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
  };

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error(language === "ar" ? "لم يتم اختيار أي عناصر" : "No items selected");
      return;
    }

    try {
      for (const courseId of selectedItems) {
        await removeFromCart(courseId, dispatch);
      }
      // Reload cart
      const cartData = await getCart(dispatch);
      setCart(cartData);
      setSelectedItems(new Set());
      toast.success(
        language === "ar"
          ? "تم حذف العناصر المحددة"
          : "Selected items deleted successfully"
      );
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  };

  // Handle apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(
        language === "ar" ? "يرجى إدخال كود الخصم" : "Please enter coupon code"
      );
      return;
    }

    setIsApplyingCoupon(true);
    try {
      // TODO: Implement coupon API when available
      // For now, simulate a discount
      const discountAmount = subtotal * 0.2; // 20% discount
      setDiscount(discountAmount);
      toast.success(
        language === "ar"
          ? "تم تطبيق كود الخصم بنجاح"
          : "Coupon applied successfully"
      );
    } catch {
      toast.error(
        language === "ar"
          ? "كود الخصم غير صحيح"
          : "Invalid coupon code"
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار دورة واحدة على الأقل"
          : "Please select at least one course"
      );
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderItems = selectedCartItems.map((item) => ({
        courseId: item.courseId,
        price: item.price,
      }));

      await createOrder({ items: orderItems }, dispatch);

      // Clear selected items from cart
      for (const courseId of selectedItems) {
        await removeFromCart(courseId, dispatch);
      }

      // Reload cart
      const cartData = await getCart(dispatch);
      setCart(cartData);
      setSelectedItems(new Set());
      setDiscount(0);
      setCouponCode("");

      // Redirect to orders page or show success
      toast.success(
        language === "ar"
          ? "تم إنشاء الطلب بنجاح"
          : "Order created successfully"
      );
      router.push("/orders");
    } catch (error) {
      console.error("Failed to checkout:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShoppingCart
          className={`h-20 w-20 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        />
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {language === "ar" ? "السلة فارغة" : "Your cart is empty"}
        </h2>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {language === "ar"
            ? "ابدأ بإضافة الدورات إلى السلة"
            : "Start adding courses to your cart"}
        </p>
        <button
          onClick={() => router.push("/courses")}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          {language === "ar" ? "تصفح الدورات" : "Browse Courses"}
        </button>
      </div>
    );
  }

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
          <span
            className={theme === "dark" ? "text-white" : "text-gray-900"}
          >
            {language === "ar" ? "سلة التسوق" : "Cart Courses"}
          </span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Header */}
          <div
            className={`rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShoppingCart
                  className={`h-6 w-6 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
                <h1
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "سلة التسوق" : "My Cart"}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    theme === "dark"
                      ? "bg-blue-700 text-blue-200"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {cart.items?.length || 0}{" "}
                  {language === "ar" ? "عنصر" : "items"}
                </span>
              </div>
            </div>

            {/* Select All & Delete */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-blue-800/30">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    cart.items &&
                    Array.isArray(cart.items) &&
                    cart.items.length > 0 &&
                    selectedItems.size === cart.items.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar" ? "تحديد الكل" : "Select all"}
                </span>
              </label>
              <button
                onClick={handleDeleteSelected}
                disabled={selectedItems.size === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {language === "ar" ? "حذف" : "Delete"}
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.items && Array.isArray(cart.items) && cart.items.map((item) => {
                const course = item.course;
                if (!course) return null;

                const courseTitle =
                  language === "ar" ? course.title.ar : course.title.en;
                const isSelected = selectedItems.has(item.courseId);

                return (
                  <div
                    key={item.courseId}
                    className={`flex gap-4 p-4 rounded-xl border ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700/50"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleItemSelect(item.courseId, e.target.checked)
                      }
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    {/* Course Image */}
                    <div className="relative h-24 w-32 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={course.thumbnail || "/images/courses/course-placeholder.jpg"}
                        alt={courseTitle}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-semibold mb-1 line-clamp-1 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {courseTitle}
                      </h3>
                      {typeof course.teacher === "object" && course.teacher?.email && (
                        <p
                          className={`text-sm mb-2 ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {course.teacher.email}
                        </p>
                      )}
                      <div
                        className={`flex flex-wrap items-center gap-3 text-xs ${
                          theme === "dark" ? "text-blue-300" : "text-gray-500"
                        }`}
                      >
                        {course.totalLessons && (
                          <span>
                            {course.totalLessons}{" "}
                            {language === "ar" ? "درس" : "Lessons"}
                          </span>
                        )}
                        {course.durationHours && (
                          <span>
                            {course.durationHours}{" "}
                            {language === "ar" ? "ساعة" : "h"}
                          </span>
                        )}
                        {course.level && (
                          <span className="px-2 py-1 rounded bg-blue-600/20 text-blue-300">
                            {course.level === "beginner"
                              ? language === "ar"
                                ? "مبتدئ"
                                : "Beginner"
                              : course.level === "intermediate"
                              ? language === "ar"
                                ? "متوسط"
                                : "Intermediate"
                              : language === "ar"
                              ? "متقدم"
                              : "Advanced"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Delete */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleDeleteItem(item.courseId)}
                        className="p-2 rounded-lg hover:bg-red-600/20 transition-colors"
                      >
                        <Trash2
                          className={`h-5 w-5 ${
                            theme === "dark" ? "text-red-400" : "text-red-600"
                          }`}
                        />
                      </button>
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.price} {course.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div
            className={`sticky top-24 rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "ملخص الطلب" : "Order Summary"}
            </h2>

            {/* Coupon Code */}
            <div className="mb-6 space-y-2">
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                }`}
              >
                {language === "ar" ? "كود الخصم" : "Coupon Code"}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      theme === "dark" ? "text-blue-300" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={language === "ar" ? "أدخل الكود" : "Enter code"}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isApplyingCoupon
                    ? language === "ar"
                      ? "جاري..."
                      : "Applying..."
                    : language === "ar"
                    ? "تطبيق"
                    : "Apply"}
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-blue-800/30">
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
                </span>
                <span
                  className={`font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {subtotal.toFixed(2)}{" "}
                  {cart.items[0]?.course?.currency || "SAR"}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {language === "ar" ? "الخصم (-20%)" : "Discount (-20%)"}
                  </span>
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    -{discount.toFixed(2)}{" "}
                    {cart.items[0]?.course?.currency || "SAR"}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar" ? "المجموع الكلي" : "Total Paid"}
                </span>
                <FileText
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
              </div>
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {total.toFixed(2)} {cart.items[0]?.course?.currency || "SAR"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/courses")}
                className={`w-full px-4 py-3 rounded-lg border-2 font-semibold transition-colors ${
                  theme === "dark"
                    ? "border-blue-600 text-blue-300 hover:bg-blue-600/20"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <ArrowLeft
                  className={`inline-block h-4 w-4 mr-2 ${
                    isRTL ? "rotate-180" : ""
                  }`}
                />
                {language === "ar" ? "متابعة التسوق" : "Continue Shopping"}
              </button>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || selectedItems.size === 0}
                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isCheckingOut
                  ? language === "ar"
                    ? "جاري المعالجة..."
                    : "Processing..."
                  : language === "ar"
                  ? "إتمام الطلب"
                  : "Check out"}
                {!isCheckingOut && (
                  <ArrowLeft
                    className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
