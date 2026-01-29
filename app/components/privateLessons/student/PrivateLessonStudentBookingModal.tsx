"use client";

import { useMemo, useState } from "react";
import { X, Video, MapPin, CalendarDays, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createBookingBySchedule } from "../../../store/api/bookingApi";
import type { ScheduleItem } from "../../../store/interface/privateLessonInterface";

interface PrivateLessonStudentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherIds: string[];
  slot: ScheduleItem | null;
}

function buildScheduledAtISO(date: string, time: string) {
  const d = (date || "").slice(0, 10); // YYYY-MM-DD
  const t = (time || "").slice(0, 5); // HH:mm
  if (!d || !t) return null;
  // Follow swagger example with Z suffix.
  return `${d}T${t}:00.000Z`;
}

export default function PrivateLessonStudentBookingModal({
  isOpen,
  onClose,
  teacherIds,
  slot,
}: PrivateLessonStudentBookingModalProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const [type, setType] = useState<"online" | "offline">("online");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scheduledAt = useMemo(() => {
    if (!slot) return null;
    return buildScheduledAtISO(slot.date, slot.time);
  }, [slot]);

  const canBook = teacherIds.length > 0 && !!slot && !!scheduledAt;

  if (!isOpen) return null;

  const close = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    if (user?.role !== "student") {
      toast.error(language === "ar" ? "الحجز متاح للطلاب فقط" : "Booking is for students only");
      return;
    }
    if (!canBook) {
      toast.error(language === "ar" ? "بيانات الحجز غير مكتملة" : "Booking data is incomplete");
      return;
    }

    setIsSubmitting(true);
    try {
      let lastErr: string | null = null;
      for (const candidateTeacherId of teacherIds) {
        try {
          await createBookingBySchedule(
            {
              teacherId: candidateTeacherId,
              type,
              scheduledAt: scheduledAt!,
            },
            dispatch,
            { toast: false }
          );
          lastErr = null;
          break;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to create booking";
          lastErr = msg;
          const m = msg.toLowerCase();
          // Retry only when backend says teacher not found
          if (!(m.includes("teacher not found") || m.includes("teacher") && m.includes("not found"))) {
            break;
          }
        }
      }

      if (lastErr) {
        toast.error(lastErr);
        return;
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={close} />

      <div
        className={`relative w-full max-w-lg rounded-2xl border shadow-2xl ${
          theme === "dark" ? "bg-blue-950 border-blue-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-blue-800/30">
          <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
            {language === "ar" ? "حجز موعد" : "Book a slot"}
          </h3>
          <button
            onClick={close}
            className={`h-9 w-9 rounded-full inline-flex items-center justify-center ${
              theme === "dark" ? "hover:bg-blue-900/50 text-blue-200" : "hover:bg-gray-100 text-gray-700"
            }`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div
            className={`rounded-xl p-4 ${
              theme === "dark" ? "bg-blue-900/40 border border-blue-800/50" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              <span className={`${theme === "dark" ? "text-blue-100" : "text-gray-900"}`}>
                {slot ? slot.date : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              <span className={`${theme === "dark" ? "text-blue-100" : "text-gray-900"}`}>
                {slot ? `${slot.time} • ${slot.duration} ${language === "ar" ? "ساعة" : "hours"}` : "-"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-semibold ${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
              {language === "ar" ? "نوع الحجز" : "Booking type"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("online")}
                className={`rounded-xl px-3 py-3 border flex items-center justify-center gap-2 transition-colors ${
                  type === "online"
                    ? theme === "dark"
                      ? "bg-blue-600/30 border-blue-500 text-white"
                      : "bg-blue-50 border-blue-600 text-blue-700"
                    : theme === "dark"
                    ? "bg-blue-950 border-blue-800 text-blue-200 hover:bg-blue-900/30"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Video className="h-4 w-4" />
                {language === "ar" ? "أونلاين" : "Online"}
              </button>
              <button
                type="button"
                onClick={() => setType("offline")}
                className={`rounded-xl px-3 py-3 border flex items-center justify-center gap-2 transition-colors ${
                  type === "offline"
                    ? theme === "dark"
                      ? "bg-blue-600/30 border-blue-500 text-white"
                      : "bg-blue-50 border-blue-600 text-blue-700"
                    : theme === "dark"
                    ? "bg-blue-950 border-blue-800 text-blue-200 hover:bg-blue-900/30"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MapPin className="h-4 w-4" />
                {language === "ar" ? "حضوري" : "Offline"}
              </button>
            </div>
          </div>

          {!canBook && (
            <p className={`text-sm ${theme === "dark" ? "text-red-300" : "text-red-600"}`}>
              {language === "ar"
                ? "لا يمكن إتمام الحجز (بيانات المدرس/الموعد غير مكتملة)."
                : "Can't complete booking (missing teacher/slot data)."}
            </p>
          )}
          {isAuthenticated && user?.role === "student" && teacherIds.length === 0 && (
            <p className={`text-sm ${theme === "dark" ? "text-red-300" : "text-red-600"}`}>
              {language === "ar"
                ? "لم يتم العثور على معرف المدرس داخل بيانات الدرس."
                : "Couldn't resolve teacherId from lesson data."}
            </p>
          )}
        </div>

        <div className="p-5 border-t border-blue-800/30 flex gap-3 justify-end">
          <button
            onClick={close}
            className={`px-4 py-2 rounded-lg font-semibold ${
              theme === "dark" ? "bg-blue-950 border border-blue-800 text-blue-200" : "bg-white border border-gray-200"
            }`}
          >
            {language === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canBook || isSubmitting}
            className={`px-5 py-2 rounded-lg font-semibold text-white ${
              !canBook || isSubmitting ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (language === "ar" ? "جاري الحجز..." : "Booking...") : language === "ar" ? "تأكيد الحجز" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

