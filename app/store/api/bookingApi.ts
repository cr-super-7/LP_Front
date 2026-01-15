import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Booking,
  BookingResponse,
  BookingsResponse,
  CreateBookingRequest,
  UpdateBookingLocationRequest,
  CancelBookingRequest,
} from "../interface/bookingInterface";
import toast from "react-hot-toast";

// Define error response interface
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

const createBooking = async (
  bookingData: CreateBookingRequest,
  dispatch: AppDispatch
): Promise<Booking> => {
  try {
    const { data } = await api.post<BookingResponse>("/bookings", bookingData);

    const booking = (data.booking || data) as Booking;
    toast.success(data.message || "Booking created and approved successfully");
    return booking;
  } catch (error: unknown) {
    let errorMessage = "Failed to create booking";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getMyBookings = async (
  status?: string,
  dispatch?: AppDispatch
): Promise<Booking[]> => {
  try {
    const queryParams = status ? `?status=${status}` : "";
    const { data } = await api.get<BookingsResponse>(`/bookings/my/bookings${queryParams}`);

    const bookings = data.bookings || [];
    return bookings;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch bookings";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getBookingById = async (
  bookingId: string,
  dispatch: AppDispatch
): Promise<Booking> => {
  try {
    const { data } = await api.get<BookingResponse>(`/bookings/${bookingId}`);

    const booking = (data.booking || data) as Booking;
    return booking;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch booking";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const cancelBooking = async (
  bookingId: string,
  cancelData?: CancelBookingRequest,
  dispatch?: AppDispatch
): Promise<void> => {
  try {
    const { data } = await api.put<{ message: string }>(
      `/bookings/${bookingId}/cancel`,
      cancelData || {}
    );

    toast.success(data.message || "Booking cancelled successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to cancel booking";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const updateBookingLocation = async (
  bookingId: string,
  locationData: UpdateBookingLocationRequest,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const { data } = await api.put<{ message: string }>(
      `/bookings/${bookingId}/location`,
      locationData
    );

    toast.success(data.message || "Booking location updated successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to update booking location";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingLocation,
};
