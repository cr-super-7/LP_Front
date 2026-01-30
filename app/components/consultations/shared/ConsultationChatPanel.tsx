"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAppSelector } from "../../../store/hooks";
import type { ConsultationChatMessage } from "../../../store/interface/consultationChatInterface";
import { getConsultationChatSocketManager } from "../../../socket/consultationChatSocket";

type ConsultationChatPanelProps = {
  consultationId: string;
  title?: { ar: string; en: string };
  emptyText?: { ar: string; en: string };
};

export default function ConsultationChatPanel({
  consultationId,
  title = { ar: "الشات", en: "Chat" },
  emptyText = { ar: "لا توجد رسائل بعد", en: "No messages yet" },
}: ConsultationChatPanelProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { user: authUser, isAuthenticated, token: storeToken } = useAppSelector((s) => s.auth);

  const currentUserId =
    (authUser as { _id?: string; id?: string } | null)?._id ||
    (authUser as { _id?: string; id?: string } | null)?.id ||
    null;

  const [messages, setMessages] = useState<ConsultationChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const markedReadRef = useRef<Set<string>>(new Set());

  const mergeByIdAsc = (incoming: ConsultationChatMessage[]) => {
    const map = new Map<string, ConsultationChatMessage>();
    for (const m of incoming) map.set(m._id, m);
    setMessages((prev) => {
      for (const m of prev) map.set(m._id, m);
      return Array.from(map.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Socket: connect + join room + receive history/messages
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!consultationId) return;

    const token =
      storeToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!token) return;

    const socket = getConsultationChatSocketManager();
    socket.connect(token);

    setIsChatLoading(true);

    const cleanupFns: Array<() => void> = [];
    cleanupFns.push(
      socket.onConnectError(() => {
        // no toast
      })
    );
    cleanupFns.push(
      socket.onError((err) => {
        void err;
        // no toast
      })
    );
    cleanupFns.push(
      socket.onHistory((payload) => {
        // Some servers may send consultationId; if not, we accept it for the current room.
        if (payload?.consultationId && payload.consultationId !== consultationId) return;
        const onlyThis = (payload.messages || []).filter((m) => m.consultation === consultationId);
        mergeByIdAsc(onlyThis);
        setIsChatLoading(false);
      })
    );
    cleanupFns.push(
      socket.onNewMessage((payload) => {
        const msg = payload?.message;
        if (!msg) return;
        if (msg.consultation !== consultationId) return;
        mergeByIdAsc([msg]);
      })
    );
    cleanupFns.push(
      socket.onMessageRead(() => {
        // Backend only responds to same client; UI can ignore for now
      })
    );

    socket.join(consultationId);

    return () => {
      socket.leave(consultationId);
      cleanupFns.forEach((fn) => fn());
      // keep socket connected globally
    };
  }, [consultationId, isAuthenticated, storeToken]);

  // Mark latest incoming messages as read (best-effort)
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!consultationId) return;
    if (!currentUserId) return;
    if (messages.length === 0) return;

    const socket = getConsultationChatSocketManager();
    if (!socket.isConnected()) return;

    const unread = messages.filter((m) => m.consultation === consultationId && m.sender?._id !== currentUserId && !m.readAt);
    for (const m of unread) {
      if (markedReadRef.current.has(m._id)) continue;
      markedReadRef.current.add(m._id);
      socket.markRead(m._id);
    }
  }, [consultationId, currentUserId, isAuthenticated, messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    if (!isAuthenticated) {
      return;
    }

    const socket = getConsultationChatSocketManager();
    if (!socket.isConnected()) {
      return;
    }

    socket.sendMessage({ consultationId, message: text, messageType: "text", fileUrl: null });
    setInput("");
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
          Consultation: {consultationId}
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
              const timeText = Number.isNaN(time.getTime())
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
              handleSend();
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
          onClick={handleSend}
          disabled={!input.trim()}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white ${
            !input.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <Send className="h-4 w-4" />
          {language === "ar" ? "إرسال" : "Send"}
        </button>
      </div>
    </div>
  );
}

