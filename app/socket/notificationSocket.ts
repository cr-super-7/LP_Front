"use client";

import { io, Socket } from "socket.io-client";
import type { Notification } from "../store/interface/notificationInterface";

// Get base URL from API config (remove /api suffix for socket)
const getSocketUrl = (): string => {
  if (typeof window !== "undefined") {
    // In browser, use the same base URL as API but without /api
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return apiBaseUrl.replace("/api", "");
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
};

// Event handler types
export type NotificationEventHandler = (notification: Notification) => void;
export type MarkedReadEventHandler = (data: { notificationId: string; isRead: boolean }) => void;
export type AllMarkedReadEventHandler = (data: { success: boolean }) => void;
export type ErrorEventHandler = (error: { message: string; error?: string }) => void;
export type ConnectionEventHandler = () => void;
export type DisconnectionEventHandler = (reason: string) => void;

export class NotificationSocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;

  // Event handlers
  private onNotificationHandlers: NotificationEventHandler[] = [];
  private onMarkedReadHandlers: MarkedReadEventHandler[] = [];
  private onAllMarkedReadHandlers: AllMarkedReadEventHandler[] = [];
  private onErrorHandlers: ErrorEventHandler[] = [];
  private onConnectHandlers: ConnectionEventHandler[] = [];
  private onDisconnectHandlers: DisconnectionEventHandler[] = [];

  /**
   * Connect to the notification socket
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.warn("Socket already connected");
      return;
    }

    this.token = token;

    // Create socket connection
    this.socket = io(getSocketUrl(), {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    this.setupEventListeners();
  }

  /**
   * Setup all socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Handle connection
    this.socket.on("connect", () => {
      console.log("Connected to notification socket:", this.socket?.id);
      this.onConnectHandlers.forEach((handler) => handler());
    });

    // Handle disconnection
    this.socket.on("disconnect", (reason: string) => {
      console.log("Disconnected from notification socket:", reason);
      this.onDisconnectHandlers.forEach((handler) => handler(reason));
      if (reason === "io server disconnect") {
        // Server disconnected, reconnect manually
        this.socket?.connect();
      }
    });

    // Handle connection errors
    this.socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error.message);
      this.onErrorHandlers.forEach((handler) =>
        handler({ message: error.message })
      );
    });

    // Handle new notification
    this.socket.on("new-notification", (notification: Notification) => {
      console.log("New notification received:", notification);
      this.onNotificationHandlers.forEach((handler) => handler(notification));
    });

    // Handle notification marked as read
    this.socket.on(
      "notification-marked-read",
      (data: { notificationId: string; isRead: boolean }) => {
        console.log("Notification marked as read:", data);
        this.onMarkedReadHandlers.forEach((handler) => handler(data));
      }
    );

    // Handle all notifications marked as read
    this.socket.on(
      "all-notifications-marked-read",
      (data: { success: boolean }) => {
        console.log("All notifications marked as read:", data);
        this.onAllMarkedReadHandlers.forEach((handler) => handler(data));
      }
    );

    // Handle errors
    this.socket.on("error", (error: { message: string; error?: string }) => {
      console.error("Socket error:", error);
      this.onErrorHandlers.forEach((handler) => handler(error));
    });
  }

  /**
   * Disconnect from the socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.clearAllHandlers();
  }

  /**
   * Mark a notification as read via socket
   */
  markAsRead(notificationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit("mark-notification-read", { notificationId });
    } else {
      console.warn("Socket not connected, cannot mark notification as read");
    }
  }

  /**
   * Mark all notifications as read via socket
   */
  markAllAsRead(): void {
    if (this.socket?.connected) {
      this.socket.emit("mark-all-notifications-read");
    } else {
      console.warn("Socket not connected, cannot mark all notifications as read");
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Register event handlers
   */
  onNotification(handler: NotificationEventHandler): () => void {
    this.onNotificationHandlers.push(handler);
    return () => {
      this.onNotificationHandlers = this.onNotificationHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onMarkedRead(handler: MarkedReadEventHandler): () => void {
    this.onMarkedReadHandlers.push(handler);
    return () => {
      this.onMarkedReadHandlers = this.onMarkedReadHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onAllMarkedRead(handler: AllMarkedReadEventHandler): () => void {
    this.onAllMarkedReadHandlers.push(handler);
    return () => {
      this.onAllMarkedReadHandlers = this.onAllMarkedReadHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onError(handler: ErrorEventHandler): () => void {
    this.onErrorHandlers.push(handler);
    return () => {
      this.onErrorHandlers = this.onErrorHandlers.filter((h) => h !== handler);
    };
  }

  onConnect(handler: ConnectionEventHandler): () => void {
    this.onConnectHandlers.push(handler);
    return () => {
      this.onConnectHandlers = this.onConnectHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onDisconnect(handler: DisconnectionEventHandler): () => void {
    this.onDisconnectHandlers.push(handler);
    return () => {
      this.onDisconnectHandlers = this.onDisconnectHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  /**
   * Clear all event handlers
   */
  private clearAllHandlers(): void {
    this.onNotificationHandlers = [];
    this.onMarkedReadHandlers = [];
    this.onAllMarkedReadHandlers = [];
    this.onErrorHandlers = [];
    this.onConnectHandlers = [];
    this.onDisconnectHandlers = [];
  }
}

// Singleton instance
let socketManagerInstance: NotificationSocketManager | null = null;

/**
 * Get or create the singleton socket manager instance
 */
export const getNotificationSocketManager = (): NotificationSocketManager => {
  if (!socketManagerInstance) {
    socketManagerInstance = new NotificationSocketManager();
  }
  return socketManagerInstance;
};
