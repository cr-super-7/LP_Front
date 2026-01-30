"use client";

import { io, Socket } from "socket.io-client";
import type {
  ConsultationChatHistoryPayload,
  ConsultationChatMessage,
  ConsultationChatMessageType,
  ConsultationChatNewMessagePayload,
} from "../store/interface/consultationChatInterface";

const getSocketUrl = (): string => {
  if (typeof window !== "undefined") {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return apiBaseUrl.replace("/api", "");
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
};

export type ConsultationChatErrorHandler = (error: { message: string; error?: string }) => void;
export type ConsultationChatHistoryHandler = (payload: ConsultationChatHistoryPayload) => void;
export type ConsultationChatNewMessageHandler = (payload: ConsultationChatNewMessagePayload) => void;
export type ConsultationChatJoinedHandler = (payload: { consultationId: string; type?: string; status?: string }) => void;
export type ConsultationChatUserPresenceHandler = (payload: { userId: string; consultationId: string }) => void;
export type ConsultationChatMessageReadHandler = (payload: { messageId: string }) => void;
export type ConsultationChatConnectErrorHandler = (message: string) => void;

export class ConsultationChatSocketManager {
  private socket: Socket | null = null;

  private onErrorHandlers: ConsultationChatErrorHandler[] = [];
  private onConnectErrorHandlers: ConsultationChatConnectErrorHandler[] = [];
  private onHistoryHandlers: ConsultationChatHistoryHandler[] = [];
  private onNewMessageHandlers: ConsultationChatNewMessageHandler[] = [];
  private onJoinedHandlers: ConsultationChatJoinedHandler[] = [];
  private onUserJoinedHandlers: ConsultationChatUserPresenceHandler[] = [];
  private onUserLeftHandlers: ConsultationChatUserPresenceHandler[] = [];
  private onMessageReadHandlers: ConsultationChatMessageReadHandler[] = [];

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

  join(consultationId: string): void {
    if (!this.socket) return;
    this.socket.emit("join-consultation", { consultationId });
  }

  leave(consultationId: string): void {
    if (!this.socket) return;
    this.socket.emit("leave-consultation", { consultationId });
  }

  sendMessage(payload: {
    consultationId: string;
    message: string;
    messageType?: ConsultationChatMessageType;
    fileUrl?: string | null;
  }): void {
    if (!this.socket) return;
    this.socket.emit("send-message", {
      consultationId: payload.consultationId,
      message: payload.message,
      messageType: payload.messageType || "text",
      fileUrl: payload.fileUrl ?? null,
    });
  }

  markRead(messageId: string): void {
    if (!this.socket) return;
    this.socket.emit("mark-read", { messageId });
  }

  onError(handler: ConsultationChatErrorHandler): () => void {
    this.onErrorHandlers.push(handler);
    return () => (this.onErrorHandlers = this.onErrorHandlers.filter((h) => h !== handler));
  }

  onConnectError(handler: ConsultationChatConnectErrorHandler): () => void {
    this.onConnectErrorHandlers.push(handler);
    return () => (this.onConnectErrorHandlers = this.onConnectErrorHandlers.filter((h) => h !== handler));
  }

  onHistory(handler: ConsultationChatHistoryHandler): () => void {
    this.onHistoryHandlers.push(handler);
    return () => (this.onHistoryHandlers = this.onHistoryHandlers.filter((h) => h !== handler));
  }

  onNewMessage(handler: ConsultationChatNewMessageHandler): () => void {
    this.onNewMessageHandlers.push(handler);
    return () => (this.onNewMessageHandlers = this.onNewMessageHandlers.filter((h) => h !== handler));
  }

  onJoined(handler: ConsultationChatJoinedHandler): () => void {
    this.onJoinedHandlers.push(handler);
    return () => (this.onJoinedHandlers = this.onJoinedHandlers.filter((h) => h !== handler));
  }

  onUserJoined(handler: ConsultationChatUserPresenceHandler): () => void {
    this.onUserJoinedHandlers.push(handler);
    return () => (this.onUserJoinedHandlers = this.onUserJoinedHandlers.filter((h) => h !== handler));
  }

  onUserLeft(handler: ConsultationChatUserPresenceHandler): () => void {
    this.onUserLeftHandlers.push(handler);
    return () => (this.onUserLeftHandlers = this.onUserLeftHandlers.filter((h) => h !== handler));
  }

  onMessageRead(handler: ConsultationChatMessageReadHandler): () => void {
    this.onMessageReadHandlers.push(handler);
    return () => (this.onMessageReadHandlers = this.onMessageReadHandlers.filter((h) => h !== handler));
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect_error", (err: Error) => {
      this.onConnectErrorHandlers.forEach((h) => h(err.message));
    });

    this.socket.on("error", (error: { message: string; error?: string }) => {
      this.onErrorHandlers.forEach((h) => h(error));
    });

    this.socket.on("joined-consultation", (payload: { consultationId: string; type?: string; status?: string }) => {
      this.onJoinedHandlers.forEach((h) => h(payload));
    });

    this.socket.on("chat-history", (payload: ConsultationChatHistoryPayload) => {
      this.onHistoryHandlers.forEach((h) => h(payload));
    });

    this.socket.on("new-message", (payload: ConsultationChatNewMessagePayload) => {
      this.onNewMessageHandlers.forEach((h) => h(payload));
    });

    this.socket.on("user-joined", (payload: { userId: string; consultationId: string }) => {
      this.onUserJoinedHandlers.forEach((h) => h(payload));
    });

    this.socket.on("user-left", (payload: { userId: string; consultationId: string }) => {
      this.onUserLeftHandlers.forEach((h) => h(payload));
    });

    this.socket.on("message-read", (payload: { messageId: string }) => {
      this.onMessageReadHandlers.forEach((h) => h(payload));
    });
  }

  private clearAllHandlers(): void {
    this.onErrorHandlers = [];
    this.onConnectErrorHandlers = [];
    this.onHistoryHandlers = [];
    this.onNewMessageHandlers = [];
    this.onJoinedHandlers = [];
    this.onUserJoinedHandlers = [];
    this.onUserLeftHandlers = [];
    this.onMessageReadHandlers = [];
  }
}

let consultationChatSocketInstance: ConsultationChatSocketManager | null = null;

export const getConsultationChatSocketManager = (): ConsultationChatSocketManager => {
  if (!consultationChatSocketInstance) consultationChatSocketInstance = new ConsultationChatSocketManager();
  return consultationChatSocketInstance;
};

