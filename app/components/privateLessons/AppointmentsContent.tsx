"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Clock, MapPin, ExternalLink, User, BadgeCheck, BadgeX, Clock3, Ban, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getTeacherBookings } from "../../store/api/bookingApi";
import type { Booking, TimeSlot } from "../../store/interface/bookingInterface";
import toast from "react-hot-toast";

interface Appointment {
  _id: string;
  studentEmail: string;
  studentPhone?: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  bookingType: "online" | "offline";
  meetLink?: string | null;
  location?: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
}

export default function AppointmentsContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const isInstructor = user?.role === "instructor" || user?.role === "teacher";
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Page is for teacher only
    if (!isAuthenticated || !isInstructor) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getTeacherBookings(statusFilter || undefined, dispatch);
        setBookings(data || []);
      } catch (e: unknown) {
        // bookingApi already toasts; keep a minimal fallback
        const msg = e instanceof Error ? e.message : "Failed to load bookings";
        toast.error(msg);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [dispatch, isAuthenticated, isInstructor, statusFilter]);

  const appointments: Appointment[] = useMemo(() => {
    const resolveDateTime = (b: Booking): { date: string; time: string } => {
      const scheduledAt = b.scheduledAt;
      if (scheduledAt) {
        const d = new Date(scheduledAt);
        const date = d.toISOString().slice(0, 10);
        const time = d.toISOString().slice(11, 16);
        return { date, time };
      }
      if (b.timeSlot && typeof b.timeSlot !== "string") {
        const ts: TimeSlot = b.timeSlot;
        return { date: ts.date || b.createdAt.slice(0, 10), time: ts.startTime || "00:00" };
      }
      return { date: b.createdAt.slice(0, 10), time: b.createdAt.slice(11, 16) };
    };

    const resolveStudent = (b: Booking) => {
      if (typeof b.student === "string") {
        return { email: b.student, phone: undefined as string | undefined };
      }
      const studentObj = b.student;
      return {
        email: studentObj.email,
        phone: studentObj.phone,
      };
    };

    return (bookings || []).map((b) => {
      const { date, time } = resolveDateTime(b);
      const student = resolveStudent(b);

      return {
        _id: b._id,
        studentEmail: student.email,
        studentPhone: student.phone,
        date,
        time,
        bookingType: b.bookingType,
        meetLink: b.meetLink || null,
        location: b.location || null,
        status: b.status,
      };
    });
  }, [bookings]);

  // Format date and time
  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      const date = new Date(dateString);
      const dayNames = [
        { ar: "الأحد", en: "Sunday" },
        { ar: "الإثنين", en: "Monday" },
        { ar: "الثلاثاء", en: "Tuesday" },
        { ar: "الأربعاء", en: "Wednesday" },
        { ar: "الخميس", en: "Thursday" },
        { ar: "الجمعة", en: "Friday" },
        { ar: "السبت", en: "Saturday" },
      ];
      const dayName = dayNames[date.getDay()];
      const day = dayName[language];
      
      // Format time
      const [hours, minutes] = timeString.split(":");
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? (language === "ar" ? "م" : "PM") : (language === "ar" ? "ص" : "AM");
      
      return `${day} ${hour12}:${minutes} ${ampm}`;
    } catch {
      return `${dateString} ${timeString}`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
            }`}
          >
            <Clock
              className={`h-6 w-6 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
          </div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "المواعيد" : "Appointments"}
          </h1>
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {appointments.length}{" "}
          {language === "ar" ? "موعد حتى الآن" : "Appointments till now"}
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
            {language === "ar" ? "الحالة" : "Status"}
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === "dark"
                ? "bg-blue-950/40 border-blue-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">{language === "ar" ? "الكل" : "All"}</option>
            <option value="pending">{language === "ar" ? "قيد الانتظار" : "Pending"}</option>
            <option value="approved">{language === "ar" ? "مقبول" : "Approved"}</option>
            <option value="rejected">{language === "ar" ? "مرفوض" : "Rejected"}</option>
            <option value="cancelled">{language === "ar" ? "ملغي" : "Cancelled"}</option>
            <option value="completed">{language === "ar" ? "مكتمل" : "Completed"}</option>
          </select>
        </div>
        {isLoading && (
          <div className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        )}
      </div>

      {/* Appointments Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : appointments.length === 0 ? (
        <div className={`text-center py-16 ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
          {language === "ar" ? "لا توجد مواعيد حالياً" : "No appointments yet"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              theme={theme}
              language={language}
              formatDateTime={formatDateTime}
              onOpenDetails={() => router.push(`/private-lessons/appointments/${appointment._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  theme: "dark" | "light";
  language: "ar" | "en";
  formatDateTime: (date: string, time: string) => string;
  onOpenDetails: () => void;
}

function AppointmentCard({
  appointment,
  theme,
  language,
  formatDateTime,
  onOpenDetails,
}: AppointmentCardProps) {
  const dateTime = formatDateTime(appointment.date, appointment.time);

  const statusInfo = (() => {
    const statusLabels: Record<
      Appointment["status"],
      { ar: string; en: string; cls: string; Icon: typeof BadgeCheck }
    > = {
      pending: {
        ar: "قيد الانتظار",
        en: "Pending",
        cls: theme === "dark" ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/30" : "bg-yellow-50 text-yellow-700 border-yellow-200",
        Icon: Clock3,
      },
      approved: {
        ar: "مقبول",
        en: "Approved",
        cls: theme === "dark" ? "bg-green-500/20 text-green-200 border-green-400/30" : "bg-green-50 text-green-700 border-green-200",
        Icon: BadgeCheck,
      },
      rejected: {
        ar: "مرفوض",
        en: "Rejected",
        cls: theme === "dark" ? "bg-red-500/20 text-red-200 border-red-400/30" : "bg-red-50 text-red-700 border-red-200",
        Icon: BadgeX,
      },
      cancelled: {
        ar: "ملغي",
        en: "Cancelled",
        cls: theme === "dark" ? "bg-gray-500/20 text-gray-200 border-gray-400/30" : "bg-gray-50 text-gray-700 border-gray-200",
        Icon: Ban,
      },
      completed: {
        ar: "مكتمل",
        en: "Completed",
        cls: theme === "dark" ? "bg-blue-500/20 text-blue-200 border-blue-400/30" : "bg-blue-50 text-blue-700 border-blue-200",
        Icon: CheckCircle2,
      },
    };
    return statusLabels[appointment.status];
  })();

  const primaryLink = appointment.bookingType === "online" ? appointment.meetLink : appointment.location;
  const canOpenLink = typeof primaryLink === "string" && primaryLink.startsWith("http");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenDetails();
      }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      } cursor-pointer`}
    >
      {/* Card Content */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
              {appointment.studentEmail}
            </h3>
            {appointment.studentPhone && (
              <p className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {appointment.studentPhone}
              </p>
            )}
          </div>

          <div className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusInfo.cls}`}>
            <statusInfo.Icon className="h-4 w-4" />
            <span>{language === "ar" ? statusInfo.ar : statusInfo.en}</span>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-2">
          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {dateTime}
            </span>
          </div>

          {/* Booking type */}
          <div className="flex items-center gap-2">
            <User
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {appointment.bookingType === "online"
                ? (language === "ar" ? "أونلاين" : "Online")
                : (language === "ar" ? "حضوري" : "Offline")}
            </span>
          </div>

          {/* Meet link / Location (only if provided) */}
          {appointment.bookingType === "online" && appointment.meetLink && (
            <div className="flex items-center gap-2">
              <ExternalLink className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              <a
                href={appointment.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`text-sm underline break-all ${
                  theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"
                }`}
              >
                {appointment.meetLink}
              </a>
            </div>
          )}

          {appointment.bookingType === "offline" && appointment.location && (
            <div className="flex items-center gap-2">
              <MapPin className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              {canOpenLink ? (
                <a
                  href={appointment.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`text-sm underline break-all ${
                    theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {appointment.location}
                </a>
              ) : (
                <span className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                  {appointment.location}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
