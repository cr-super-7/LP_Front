"use client";

import { ExternalLink, User, Clock, MapPin, BadgeCheck, BadgeX, Clock3, Ban, CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import type { Booking } from "../../../store/interface/bookingInterface";

interface BookingDetailsContentProps {
  booking: Booking;
}

export default function BookingDetailsContent({ booking }: BookingDetailsContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const studentEmail = typeof booking.student === "string" ? booking.student : booking.student.email;
  const studentPhone = typeof booking.student === "string" ? undefined : booking.student.phone;

  const scheduledAt = booking.scheduledAt || booking.createdAt;
  const scheduledAtDate = new Date(scheduledAt);
  const scheduledAtText = isNaN(scheduledAtDate.getTime())
    ? scheduledAt
    : scheduledAtDate.toLocaleString(language === "ar" ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const statusInfo = (() => {
    const clsBase = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold";
    switch (booking.status) {
      case "approved":
        return {
          label: language === "ar" ? "مقبول" : "Approved",
          Icon: BadgeCheck,
          cls: `${clsBase} ${theme === "dark" ? "bg-green-500/20 text-green-200 border-green-400/30" : "bg-green-50 text-green-700 border-green-200"}`,
        };
      case "rejected":
        return {
          label: language === "ar" ? "مرفوض" : "Rejected",
          Icon: BadgeX,
          cls: `${clsBase} ${theme === "dark" ? "bg-red-500/20 text-red-200 border-red-400/30" : "bg-red-50 text-red-700 border-red-200"}`,
        };
      case "cancelled":
        return {
          label: language === "ar" ? "ملغي" : "Cancelled",
          Icon: Ban,
          cls: `${clsBase} ${theme === "dark" ? "bg-gray-500/20 text-gray-200 border-gray-400/30" : "bg-gray-50 text-gray-700 border-gray-200"}`,
        };
      case "completed":
        return {
          label: language === "ar" ? "مكتمل" : "Completed",
          Icon: CheckCircle2,
          cls: `${clsBase} ${theme === "dark" ? "bg-blue-500/20 text-blue-200 border-blue-400/30" : "bg-blue-50 text-blue-700 border-blue-200"}`,
        };
      default:
        return {
          label: language === "ar" ? "قيد الانتظار" : "Pending",
          Icon: Clock3,
          cls: `${clsBase} ${theme === "dark" ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`,
        };
    }
  })();

  const primaryLink = booking.bookingType === "online" ? booking.meetLink : booking.location;
  const canOpenLink = typeof primaryLink === "string" && primaryLink.startsWith("http");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => router.back()}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-blue-900/50 text-blue-200"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{language === "ar" ? "رجوع" : "Back"}</span>
        </button>

        <div className={statusInfo.cls}>
          <statusInfo.Icon className="h-4 w-4" />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div
        className={`rounded-2xl p-6 shadow-xl ${
          theme === "dark"
            ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
          {language === "ar" ? "تفاصيل الحجز" : "Booking details"}
        </h1>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              <div>
                <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                  {language === "ar" ? "الطالب" : "Student"}
                </p>
                <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{studentEmail}</p>
                {studentPhone && (
                  <p className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>{studentPhone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              <div>
                <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                  {language === "ar" ? "موعد الحجز" : "Scheduled at"}
                </p>
                <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{scheduledAtText}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              <div>
                <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                  {language === "ar" ? "نوع الحجز" : "Booking type"}
                </p>
                <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {booking.bookingType === "online" ? (language === "ar" ? "أونلاين" : "Online") : (language === "ar" ? "حضوري" : "Offline")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {booking.bookingType === "online" && booking.meetLink && (
              <div className="flex items-start gap-2">
                <ExternalLink className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                    {language === "ar" ? "رابط الاجتماع" : "Meeting link"}
                  </p>
                  <a
                    href={booking.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm underline break-all ${theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"}`}
                  >
                    {booking.meetLink}
                  </a>
                </div>
              </div>
            )}

            {booking.bookingType === "offline" && booking.location && (
              <div className="flex items-start gap-2">
                <MapPin className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <div>
                  <p className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                    {language === "ar" ? "الموقع" : "Location"}
                  </p>
                  {canOpenLink ? (
                    <a
                      href={booking.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm underline break-all ${theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"}`}
                    >
                      {booking.location}
                    </a>
                  ) : (
                    <p className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{booking.location}</p>
                  )}
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
}

