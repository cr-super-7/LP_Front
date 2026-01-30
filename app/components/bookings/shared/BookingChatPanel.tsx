"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAppSelector } from "../../../store/hooks";
import type { BookingChatMessage } from "../../../store/interface/bookingChatInterface";
import { getBookingChatMessages, sendBookingChatMessageRest } from "../../../store/api/bookingChatApi";
import { getBookingChatSocketManager } from "../../../socket/bookingChatSocket";

type BookingChatPanelProps = {
  bookingId: string;
  title?: { ar: string; en: string };
  emptyText?: { ar: string; en: string };
};

export default function BookingChatPanel({
  bookingId,
  title = { ar: "الشات", en: "Chat" },
  emptyText = { ar: "لا توجد رسائل بعد", en: "No messages yet" },
}: BookingChatPanelProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { user: authUser, isAuthenticated } = useAppSelector((s) => s.auth);

  const currentUserId =
    (authUser as { _id?: string; id?: string } | null)?._id ||
    (authUser as { _id?: string; id?: string } | null)?.id ||
    null;

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

  // Socket: connect + join room
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!bookingId) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const socket = getBookingChatSocketManager();
    socket.connect(token);

    const cleanupFns: Array<() => void> = [];
    cleanupFns.push(
      socket.onError((err) => {
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
      // keep socket connected globally
    };
  }, [bookingId, isAuthenticated]);

  // REST: initial load (fallback)
  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) return;
      if (!bookingId) return;
      setIsChatLoading(true);
      try {
        const msgs = await getBookingChatMessages(bookingId, 100);
        setMessages(msgs);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load chat";
        toast.error(msg);
      } finally {
        setIsChatLoading(false);
      }
    };
    void load();
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
      // Send via REST only to avoid duplicate messages (socket will broadcast the same message).
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

  const headerText = useMemo(() => {
    return language === "ar" ? title.ar : title.en;
  }, [language, title.ar, title.en]);

  return (
    <div
      className={`rounded-2xl p-6 shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
          {headerText}
        </h2>
        <span className={`text-xs ${theme === "dark" ? "text-blue-300" : "text-gray-500"}`}>
          Booking: {bookingId}
        </span>
      </div>

      <div
        className={`mt-4 h-[420px] overflow-y-auto rounded-xl p-4 ${
          theme === "dark"
            ? "bg-blue-950/40 border border-blue-800/50"
            : "bg-gray-50 border border-gray-200"
        }`}
      >
        {isChatLoading ? (
          <div className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
            {language === "ar" ? "جاري تحميل الرسائل..." : "Loading messages..."}
          </div>
        ) : messages.length === 0 ? (
          <div className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
            {language === "ar" ? emptyText.ar : emptyText.en}
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
                        ? "bg-blue-600 text-white"
                        : theme === "dark"
                          ? "bg-blue-900/70 text-blue-100 border border-blue-800/60"
                          : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span
                        className={`text-xs ${
                          isMine ? "text-white/80" : theme === "dark" ? "text-blue-300" : "text-gray-500"
                        }`}
                      >
                        {isMine
                          ? language === "ar"
                            ? "أنت"
                            : "You"
                          : m.sender?.email || (language === "ar" ? "مستخدم" : "User")}
                      </span>
                      <span
                        className={`text-[11px] ${
                          isMine ? "text-white/80" : theme === "dark" ? "text-blue-300" : "text-gray-500"
                        }`}
                      >
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
  );
}

