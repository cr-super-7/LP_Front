"use client";

export type BookingChatMessageType = "text" | "image" | "file";

export type BookingChatSender = {
  _id: string;
  email: string;
  role: "student" | "instructor" | "admin" | "super_admin" | string;
  [key: string]: unknown;
};

export type BookingChatMessage = {
  _id: string;
  booking: string;
  sender: BookingChatSender;
  message: string;
  messageType: BookingChatMessageType;
  fileUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
};

export type BookingChatHistoryPayload = {
  bookingId: string;
  messages: BookingChatMessage[];
};

