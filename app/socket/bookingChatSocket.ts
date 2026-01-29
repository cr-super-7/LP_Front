"use client";

import { io, Socket } from "socket.io-client";
import type { BookingChatHistoryPayload, BookingChatMessage, BookingChatMessageType } from "../store/interface/bookingChatInterface";

const getSocketUrl = (): string => {
  if (typeof window !== "undefined") {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return apiBaseUrl.replace("/api", "");
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
};

export type BookingChatErrorHandler = (error: { message: string; error?: string }) => void;
export type BookingChatHistoryHandler = (payload: BookingChatHistoryPayload) => void;
export type BookingChatNewMessageHandler = (payload: { bookingId: string; message: BookingChatMessage }) => void;
export type BookingChatJoinedHandler = (payload: { bookingId: string }) => void;
export type BookingChatUserPresenceHandler = (payload: { userId: string; bookingId: string }) => void;

export class BookingChatSocketManager {
  private socket: Socket | null = null;

  private onErrorHandlers: BookingChatErrorHandler[] = [];
  private onHistoryHandlers: BookingChatHistoryHandler[] = [];
  private onNewMessageHandlers: BookingChatNewMessageHandler[] = [];
  private onJoinedHandlers: BookingChatJoinedHandler[] = [];
  private onUserJoinedHandlers: BookingChatUserPresenceHandler[] = [];
  private onUserLeftHandlers: BookingChatUserPresenceHandler[] = [];

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(getSocketUrl(), {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    this.setupListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.clearAllHandlers();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  join(bookingId: string): void {
    if (!this.socket) return;
    this.socket.emit("join-booking-chat", { bookingId });
  }

  leave(bookingId?: string): void {
    if (!this.socket) return;
    this.socket.emit("leave-booking-chat", bookingId ? { bookingId } : {});
  }

  sendMessage(payload: { bookingId: string; message: string; messageType?: BookingChatMessageType; fileUrl?: string | null }): void {
    if (!this.socket) return;
    this.socket.emit("booking-send-message", {
      bookingId: payload.bookingId,
      message: payload.message,
      messageType: payload.messageType || "text",
      fileUrl: payload.fileUrl ?? null,
    });
  }

  markRead(messageId: string): void {
    if (!this.socket) return;
    this.socket.emit("booking-mark-read", { messageId });
  }

  onError(handler: BookingChatErrorHandler): () => void {
    this.onErrorHandlers.push(handler);
    return () => (this.onErrorHandlers = this.onErrorHandlers.filter((h) => h !== handler));
  }

  onHistory(handler: BookingChatHistoryHandler): () => void {
    this.onHistoryHandlers.push(handler);
    return () => (this.onHistoryHandlers = this.onHistoryHandlers.filter((h) => h !== handler));
  }

  onNewMessage(handler: BookingChatNewMessageHandler): () => void {
    this.onNewMessageHandlers.push(handler);
    return () => (this.onNewMessageHandlers = this.onNewMessageHandlers.filter((h) => h !== handler));
  }

  onJoined(handler: BookingChatJoinedHandler): () => void {
    this.onJoinedHandlers.push(handler);
    return () => (this.onJoinedHandlers = this.onJoinedHandlers.filter((h) => h !== handler));
  }

  onUserJoined(handler: BookingChatUserPresenceHandler): () => void {
    this.onUserJoinedHandlers.push(handler);
    return () => (this.onUserJoinedHandlers = this.onUserJoinedHandlers.filter((h) => h !== handler));
  }

  onUserLeft(handler: BookingChatUserPresenceHandler): () => void {
    this.onUserLeftHandlers.push(handler);
    return () => (this.onUserLeftHandlers = this.onUserLeftHandlers.filter((h) => h !== handler));
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("error", (error: { message: string; error?: string }) => {
      this.onErrorHandlers.forEach((h) => h(error));
    });

    this.socket.on("joined-booking-chat", (payload: { bookingId: string }) => {
      this.onJoinedHandlers.forEach((h) => h(payload));
    });

    this.socket.on("booking-chat-history", (payload: BookingChatHistoryPayload) => {
      this.onHistoryHandlers.forEach((h) => h(payload));
    });

    this.socket.on("booking-new-message", (payload: { bookingId: string; message: BookingChatMessage }) => {
      this.onNewMessageHandlers.forEach((h) => h(payload));
    });

    this.socket.on("booking-user-joined", (payload: { userId: string; bookingId: string }) => {
      this.onUserJoinedHandlers.forEach((h) => h(payload));
    });

    this.socket.on("booking-user-left", (payload: { userId: string; bookingId: string }) => {
      this.onUserLeftHandlers.forEach((h) => h(payload));
    });
  }

  private clearAllHandlers(): void {
    this.onErrorHandlers = [];
    this.onHistoryHandlers = [];
    this.onNewMessageHandlers = [];
    this.onJoinedHandlers = [];
    this.onUserJoinedHandlers = [];
    this.onUserLeftHandlers = [];
  }
}

let bookingChatSocketInstance: BookingChatSocketManager | null = null;

export const getBookingChatSocketManager = (): BookingChatSocketManager => {
  if (!bookingChatSocketInstance) bookingChatSocketInstance = new BookingChatSocketManager();
  return bookingChatSocketInstance;
};

