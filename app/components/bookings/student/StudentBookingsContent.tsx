"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ExternalLink, MapPin, BadgeCheck, BadgeX, Clock3, Ban, CheckCircle2, CalendarDays, User } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { Booking } from "../../../store/interface/bookingInterface";
import { getMyBookings } from "../../../store/api/bookingApi";

type StatusFilter = "" | "pending" | "approved" | "rejected" | "cancelled" | "completed";

function resolveTeacherContact(teacher: Booking["teacher"]): { email?: string; phone?: string } {
  if (!teacher || typeof teacher === "string") return {};
  const user = teacher.user;
  if (!user || typeof user === "string") return {};
  return { email: user.email, phone: user.phone };
}

function formatDateTime(value: string, language: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString(language === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudentBookingsContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { bookings, isLoading } = useAppSelector((s) => s.booking);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const isStudent = user?.role === "student";

  const [status, setStatus] = useState<StatusFilter>("");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isStudent) return;
    getMyBookings(status || undefined, dispatch).catch((e) => {
      console.error("Failed to load my bookings:", e);
    });
  }, [dispatch, isAuthenticated, isStudent, status]);

  const statusOptions = useMemo(
    () =>
      [
        { value: "", label: language === "ar" ? "الكل" : "All" },
        { value: "pending", label: language === "ar" ? "قيد الانتظار" : "Pending" },
        { value: "approved", label: language === "ar" ? "مقبول" : "Approved" },
        { value: "rejected", label: language === "ar" ? "مرفوض" : "Rejected" },
        { value: "cancelled", label: language === "ar" ? "ملغي" : "Cancelled" },
        { value: "completed", label: language === "ar" ? "مكتمل" : "Completed" },
      ] as const,
    [language]
  );

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <div
          className={`rounded-2xl p-6 border ${
            theme === "dark" ? "bg-blue-900/40 border-blue-800/60" : "bg-white border-gray-200"
          }`}
        >
          <p className={`${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
            {language === "ar" ? "يرجى تسجيل الدخول لعرض حجوزاتك" : "Please login to view your bookings"}
          </p>
        </div>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className="p-6">
        <div
          className={`rounded-2xl p-6 border ${
            theme === "dark" ? "bg-blue-900/40 border-blue-800/60" : "bg-white border-gray-200"
          }`}
        >
          <p className={`${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
            {language === "ar" ? "هذه الصفحة للطلاب فقط" : "This page is for students only"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
          {language === "ar" ? "حجوزاتي" : "My bookings"}
        </h1>

        <div className="flex items-center gap-2">
          <label className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
            {language === "ar" ? "الحالة" : "Status"}
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className={`rounded-xl px-3 py-2 border outline-none ${
              theme === "dark"
                ? "bg-blue-950/40 border-blue-800 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : bookings.length === 0 ? (
        <div
          className={`rounded-2xl p-8 border text-center ${
            theme === "dark" ? "bg-blue-900/40 border-blue-800/60" : "bg-white border-gray-200"
          }`}
        >
          <p className={`${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
            {language === "ar" ? "لا توجد حجوزات" : "No bookings"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bookings.map((b) => {
            const teacher = resolveTeacherContact(b.teacher);
            const scheduledAt = b.scheduledAt || b.createdAt;
            const scheduledText = formatDateTime(scheduledAt, language);
            const link = b.bookingType === "online" ? b.meetLink : b.location;
            const canOpenLink = typeof link === "string" && link.startsWith("http");

            const statusInfo = (() => {
              const clsBase =
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold";
              switch (b.status) {
                case "approved":
                  return {
                    label: language === "ar" ? "مقبول" : "Approved",
                    Icon: BadgeCheck,
                    cls: `${clsBase} ${
                      theme === "dark"
                        ? "bg-green-500/20 text-green-200 border-green-400/30"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`,
                  };
                case "rejected":
                  return {
                    label: language === "ar" ? "مرفوض" : "Rejected",
                    Icon: BadgeX,
                    cls: `${clsBase} ${
                      theme === "dark"
                        ? "bg-red-500/20 text-red-200 border-red-400/30"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`,
                  };
                case "cancelled":
                  return {
                    label: language === "ar" ? "ملغي" : "Cancelled",
                    Icon: Ban,
                    cls: `${clsBase} ${
                      theme === "dark"
                        ? "bg-gray-500/20 text-gray-200 border-gray-400/30"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`,
                  };
                case "completed":
                  return {
                    label: language === "ar" ? "مكتمل" : "Completed",
                    Icon: CheckCircle2,
                    cls: `${clsBase} ${
                      theme === "dark"
                        ? "bg-blue-500/20 text-blue-200 border-blue-400/30"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`,
                  };
                default:
                  return {
                    label: language === "ar" ? "قيد الانتظار" : "Pending",
                    Icon: Clock3,
                    cls: `${clsBase} ${
                      theme === "dark"
                        ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`,
                  };
              }
            })();

            return (
              <button
                key={b._id}
                type="button"
                onClick={() => router.push(`/bookings_student/${b._id}`)}
                className={`text-left rounded-2xl p-5 border shadow-sm transition hover:shadow-md ${
                  theme === "dark"
                    ? "bg-blue-900/40 border-blue-800/60 hover:bg-blue-900/55"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CalendarDays className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {language === "ar" ? "حجز" : "Booking"}
                      </p>
                    </div>
                    <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-500"}`}>{b._id}</p>
                  </div>

                  <div className={statusInfo.cls}>
                    <statusInfo.Icon className="h-4 w-4" />
                    <span>{statusInfo.label}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-2">
                    <User className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                    <div>
                      <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                        {language === "ar" ? "المدرس" : "Teacher"}
                      </p>
                      <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {teacher.email || (language === "ar" ? "غير متاح" : "N/A")}
                      </p>
                      {teacher.phone && (
                        <p className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                          {teacher.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                    <div>
                      <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                        {language === "ar" ? "الموعد" : "Scheduled at"}
                      </p>
                      <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{scheduledText}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                    <div>
                      <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                        {language === "ar" ? "النوع" : "Type"}
                      </p>
                      <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {b.bookingType === "online"
                          ? language === "ar"
                            ? "أونلاين"
                            : "Online"
                          : language === "ar"
                            ? "حضوري"
                            : "Offline"}
                      </p>
                    </div>
                  </div>

                  {link && (
                    <div className="flex items-start gap-2">
                      <ExternalLink className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                      <div className="min-w-0">
                        <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                          {b.bookingType === "online"
                            ? language === "ar"
                              ? "رابط"
                              : "Link"
                            : language === "ar"
                              ? "الموقع"
                              : "Location"}
                        </p>
                        {canOpenLink ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`text-sm underline break-all ${
                              theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"
                            }`}
                          >
                            {link}
                          </a>
                        ) : (
                          <p className={`${theme === "dark" ? "text-white" : "text-gray-900"} break-all`}>{link}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

