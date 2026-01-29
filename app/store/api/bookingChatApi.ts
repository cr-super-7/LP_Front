import api from "../utils/api";
import type { BookingChatMessage, BookingChatMessageType } from "../interface/bookingChatInterface";

export async function getBookingChatMessages(bookingId: string, limit = 100): Promise<BookingChatMessage[]> {
  const capped = Math.min(Math.max(limit, 1), 200);
  const { data } = await api.get<{ messages: BookingChatMessage[] }>(`/bookings/${bookingId}/chat/messages`, {
    params: { limit: capped },
  });
  return data.messages || [];
}

export async function sendBookingChatMessageRest(
  bookingId: string,
  payload: { message: string; messageType?: BookingChatMessageType; fileUrl?: string | null }
): Promise<BookingChatMessage> {
  const { data } = await api.post<{ message: string; chatMessage: BookingChatMessage }>(
    `/bookings/${bookingId}/chat/messages`,
    payload
  );
  return data.chatMessage;
}

