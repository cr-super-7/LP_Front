"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, User, Clock, MapPin, BadgeCheck, BadgeX, Clock3, Ban, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAppSelector } from "../../../store/hooks";
import type { Booking } from "../../../store/interface/bookingInterface";
import type { BookingChatMessage } from "../../../store/interface/bookingChatInterface";
import { getBookingChatMessages, sendBookingChatMessageRest } from "../../../store/api/bookingChatApi";
import { getBookingChatSocketManager } from "../../../socket/bookingChatSocket";
import toast from "react-hot-toast";

interface BookingDetailsContentProps {
  booking: Booking;
}

export default function BookingDetailsContent({ booking }: BookingDetailsContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAppSelector((s) => s.auth);

  const currentUserId = (authUser as { _id?: string; id?: string } | null)?._id || (authUser as { _id?: string; id?: string } | null)?.id || null;

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

  // --- Booking Chat ---
  const bookingId = booking._id;
  const [messages, setMessages] = useState<BookingChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const mergeByIdAsc = (incoming: BookingChatMessage[]) => {
    const map = new Map<string, BookingChatMessage>();
    for (const m of incoming) map.set(m._id, m);
    setMessages((prev) => {
      for (const m of prev) map.set(m._id, m);
      return Array.from(map.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const socket = getBookingChatSocketManager();
    socket.connect(token);

    const cleanupFns: Array<() => void> = [];
    cleanupFns.push(
      socket.onError((err) => {
        // Don't spam; show minimal
        if (err?.message) toast.error(err.message);
      })
    );
    cleanupFns.push(
      socket.onHistory((payload) => {
        if (payload.bookingId !== bookingId) return;
        mergeByIdAsc(payload.messages || []);
      })
    );
    cleanupFns.push(
      socket.onNewMessage((payload) => {
        if (payload.bookingId !== bookingId) return;
        if (payload.message) mergeByIdAsc([payload.message]);
      })
    );

    socket.join(bookingId);

    return () => {
      socket.leave(bookingId);
      cleanupFns.forEach((fn) => fn());
      // keep socket connected globally (like notifications)
    };
  }, [bookingId, isAuthenticated]);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) return;
      setIsChatLoading(true);
      try {
        const msgs = await getBookingChatMessages(bookingId, 100);
        setMessages(msgs);
      } catch (e: unknown) {
        // REST can fail if unauthorized
        const msg = e instanceof Error ? e.message : "Failed to load chat";
        toast.error(msg);
      } finally {
        setIsChatLoading(false);
      }
    };
    load();
  }, [bookingId, isAuthenticated]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }

    setIsSending(true);
    try {
      const msg = await sendBookingChatMessageRest(bookingId, { message: text });
      mergeByIdAsc([msg]);
      setInput("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send message";
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  const chatHeader = useMemo(() => {
    return language === "ar" ? "الشات مع الطالب" : "Chat with student";
  }, [language]);

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

      {/* Chat Section */}
      <div
        className={`rounded-2xl p-6 shadow-xl ${
          theme === "dark"
            ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
            {chatHeader}
          </h2>
          <span className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-500"}`}>
            Booking: {bookingId}
          </span>
        </div>

        <div
          className={`mt-4 h-[420px] overflow-y-auto rounded-xl p-4 ${
            theme === "dark" ? "bg-blue-950/40 border border-blue-800/50" : "bg-gray-50 border border-gray-200"
          }`}
        >
          {isChatLoading ? (
            <div className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
              {language === "ar" ? "جاري تحميل الرسائل..." : "Loading messages..."}
            </div>
          ) : messages.length === 0 ? (
            <div className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
              {language === "ar" ? "لا توجد رسائل بعد" : "No messages yet"}
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => {
                const isMine = !!currentUserId && m.sender?._id === currentUserId;
                const time = new Date(m.createdAt);
                const timeText = isNaN(time.getTime())
                  ? m.createdAt
                  : time.toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                return (
                  <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        isMine
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-600 text-white"
                          : theme === "dark"
                          ? "bg-blue-900/70 text-blue-100 border border-blue-800/60"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className={`text-xs ${isMine ? "text-white/80" : theme === "dark" ? "text-blue-300" : "text-gray-500"}`}>
                          {isMine ? (language === "ar" ? "أنت" : "You") : m.sender?.email || (language === "ar" ? "الطالب" : "Student")}
                        </span>
                        <span className={`text-[11px] ${isMine ? "text-white/80" : theme === "dark" ? "text-blue-300" : "text-gray-500"}`}>
                          {timeText}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap wrap-break-word">{m.message}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder={language === "ar" ? "اكتب رسالة..." : "Type a message..."}
            className={`flex-1 rounded-xl px-4 py-3 border outline-none ${
              theme === "dark"
                ? "bg-blue-950/40 border-blue-800 text-white placeholder:text-blue-300/70"
                : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            }`}
          />
          <button
            onClick={() => void handleSend()}
            disabled={isSending || !input.trim()}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white ${
              isSending || !input.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Send className="h-4 w-4" />
            {language === "ar" ? "إرسال" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

