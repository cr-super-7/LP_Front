"use client";

export type ConsultationChatMessageType = "text" | "image" | "file";

export type ConsultationChatSender = {
  _id: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

export type ConsultationChatMessage = {
  _id: string;
  consultation: string;
  sender: ConsultationChatSender;
  message: string;
  messageType: ConsultationChatMessageType;
  fileUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
};

// Backend doc: chat-history returns { messages: ChatMessage[] }
// Some implementations may include consultationId; we accept it optionally.
export type ConsultationChatHistoryPayload = {
  messages: ConsultationChatMessage[];
  consultationId?: string;
};

// Backend doc: new-message returns { message: ChatMessage }
export type ConsultationChatNewMessagePayload = {
  message: ConsultationChatMessage;
  consultationId?: string;
};

