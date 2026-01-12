"use client";

import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Clock, MapPin, BookOpen, MessageSquare, ExternalLink, User } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock appointment data - replace with actual API data later
interface Appointment {
  _id: string;
  studentName: string;
  studentImage?: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  type: "Individual" | "Group";
  location: string;
  locationUrl?: string;
  lessonTitle: string;
  commentsCount?: number;
}

export default function AppointmentsContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  // Mock data - replace with actual API call later
  const appointments: Appointment[] = [
    {
      _id: "1",
      studentName: "tia samy",
      studentImage: "/home/privet_lessons.png",
      date: "2025-01-18",
      time: "18:30",
      type: "Individual",
      location: "offline 'click to open location'",
      locationUrl: "https://maps.google.com/...",
      lessonTitle: "intro to UI Private Lesson",
      commentsCount: 3,
    },
    {
      _id: "2",
      studentName: "tia samy",
      studentImage: "/home/privet_lessons.png",
      date: "2025-01-19",
      time: "14:00",
      type: "Individual",
      location: "offline 'click to open location'",
      locationUrl: "https://maps.google.com/...",
      lessonTitle: "intro to UI Private Lesson",
      commentsCount: 3,
    },
    {
      _id: "3",
      studentName: "tia samy",
      studentImage: "/home/privet_lessons.png",
      date: "2025-01-20",
      time: "10:00",
      type: "Individual",
      location: "offline 'click to open location'",
      locationUrl: "https://maps.google.com/...",
      lessonTitle: "intro to UI Private Lesson",
      commentsCount: 3,
    },
    {
      _id: "4",
      studentName: "tia samy",
      studentImage: "/home/privet_lessons.png",
      date: "2025-01-21",
      time: "16:00",
      type: "Individual",
      location: "offline 'click to open location'",
      locationUrl: "https://maps.google.com/...",
      lessonTitle: "intro to UI Private Lesson",
      commentsCount: 3,
    },
    {
      _id: "5",
      studentName: "tia samy",
      studentImage: "/home/privet_lessons.png",
      date: "2025-01-22",
      time: "12:00",
      type: "Individual",
      location: "offline 'click to open location'",
      locationUrl: "https://maps.google.com/...",
      lessonTitle: "intro to UI Private Lesson",
      commentsCount: 3,
    },
  ];

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

  const handleView = (appointmentId: string) => {
    // TODO: Navigate to appointment details page when available
    console.log("View appointment:", appointmentId);
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

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            theme={theme}
            language={language}
            formatDateTime={formatDateTime}
            onView={handleView}
          />
        ))}
      </div>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  theme: "dark" | "light";
  language: "ar" | "en";
  formatDateTime: (date: string, time: string) => string;
  onView: (id: string) => void;
}

function AppointmentCard({
  appointment,
  theme,
  language,
  formatDateTime,
  onView,
}: AppointmentCardProps) {
  const dateTime = formatDateTime(appointment.date, appointment.time);

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Student Image */}
      <div className="relative w-full h-48">
        <Image
          src={appointment.studentImage || "/home/privet_lessons.png"}
          alt={appointment.studentName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Student Name */}
        <h3
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {appointment.studentName}
        </h3>

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

          {/* Type */}
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
              {appointment.type}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            {appointment.locationUrl ? (
              <a
                href={appointment.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm underline ${
                  theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"
                }`}
              >
                {appointment.location}
              </a>
            ) : (
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {appointment.location}
              </span>
            )}
          </div>

          {/* Lesson Title */}
          <div className="flex items-center gap-2">
            <BookOpen
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {appointment.lessonTitle}
            </span>
          </div>

          {/* Comments Count */}
          {appointment.commentsCount !== undefined && (
            <div className="flex items-center gap-2">
              <MessageSquare
                className={`h-4 w-4 ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              />
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {appointment.commentsCount}
              </span>
            </div>
          )}
        </div>

        {/* View Button */}
        <button
          onClick={() => onView(appointment._id)}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <span>{language === "ar" ? "عرض" : "View"}</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
