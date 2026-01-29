// Booking Interfaces

export interface TimeSlot {
  _id: string;
  teacher: string | {
    _id: string;
    email: string;
    [key: string]: any;
  };
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
  [key: string]: any;
}

export interface Booking {
  _id: string;
  student:
    | string
    | {
        _id: string;
        email: string;
        phone?: string;
        profilePicture?: string | null;
        location?: string | null;
        [key: string]: any;
      };
  teacher:
    | string
    | {
        _id: string;
        user?:
          | string
          | {
              _id: string;
              email: string;
              phone?: string;
              profilePicture?: string | null;
              [key: string]: any;
            };
        [key: string]: any;
      };
  timeSlot: string | TimeSlot | null;
  // For private lessons bookings (created with scheduledAt)
  scheduledAt?: string;
  bookingType: "online" | "offline";
  type?: "individual" | "group";
  meetLink?: string; // for online bookings
  location?: string; // for offline bookings
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  rejectionReason?: string | null;
  cancelledBy?: string | null;
  cancellationReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  teacherId: string;
  timeSlotId: string;
  bookingType: "online" | "offline";
  type: "individual" | "group";
  location?: string; // required if bookingType is offline
}

// Create booking using a scheduled datetime (used by private lessons schedule UI)
// Swagger: { teacherId: string, type: "online" | "offline", scheduledAt: ISOString }
export interface CreateBookingByScheduleRequest {
  teacherId: string;
  type: "online" | "offline";
  scheduledAt: string; // ISO string
}

export interface UpdateBookingLocationRequest {
  location: string;
}

export interface CancelBookingRequest {
  cancellationReason?: string;
}

export interface BookingResponse {
  message?: string;
  booking: Booking;
}

export interface BookingsResponse {
  bookings: Booking[];
}

export interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}
