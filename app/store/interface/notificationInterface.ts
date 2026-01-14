// Notification Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export type NotificationType =
  | "course_approved"
  | "course_rejected"
  | "lesson_approved"
  | "lesson_rejected"
  | "private_lesson_approved"
  | "private_lesson_rejected"
  | "research_approved"
  | "research_rejected"
  | "advertisement_approved"
  | "advertisement_rejected"
  | "course_review_added"
  | "lesson_review_added"
  | "private_lesson_booking"
  | "course_enrollment"
  | "booking_approved"
  | "booking_rejected"
  | "order_created"
  | "order_completed"
  | "order_cancelled"
  | "consultation_request"
  | "consultation_accepted"
  | "consultation_rejected"
  | "consultation_started"
  | "consultation_completed"
  | "consultation_cancelled"
  | "message_received"
  | "general";

export type RelatedEntityType =
  | "course"
  | "lesson"
  | "privateLesson"
  | "research"
  | "advertisement"
  | "review"
  | "booking"
  | "enrollment"
  | "consultation"
  | "message"
  | "order";

export interface RelatedEntity {
  type: RelatedEntityType;
  id: string;
}

export interface Notification {
  _id: string;
  user: string; // User ID
  type: NotificationType;
  title: LocalizedText;
  message: LocalizedText;
  relatedEntity?: RelatedEntity;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
}
