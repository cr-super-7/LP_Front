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
import {
  setBookingLoading,
  setBookingError,
  setBookings,
  setCurrentBooking,
  addBooking,
  updateBookingState,
  removeBooking,
} from "../slice/bookingSlice";
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

/**
 * Create a new booking
 * 
 * @param bookingData - Booking creation data
 * @param dispatch - Redux dispatch
 * @returns Created booking
 */
const createBooking = async (
  bookingData: CreateBookingRequest,
  dispatch: AppDispatch
): Promise<Booking> => {
  try {
    dispatch(setBookingLoading(true));
    
    const { data } = await api.post<BookingResponse>("/bookings", bookingData);

    const booking = (data.booking || data) as Booking;
    
    // Update Redux store
    dispatch(addBooking(booking));
    dispatch(setBookingLoading(false));
    
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
    
    dispatch(setBookingError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get my bookings with optional status filter
 * 
 * @param status - Optional status filter
 * @param dispatch - Redux dispatch
 * @returns Array of bookings
 */
const getMyBookings = async (
  status?: string,
  dispatch?: AppDispatch
): Promise<Booking[]> => {
  try {
    if (dispatch) dispatch(setBookingLoading(true));
    
    const queryParams = status ? `?status=${status}` : "";
    const { data } = await api.get<BookingsResponse>(`/bookings/my/bookings${queryParams}`);

    const bookings = data.bookings || [];
    
    // Update Redux store
    if (dispatch) {
      dispatch(setBookings(bookings));
    }
    
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
    
    if (dispatch) dispatch(setBookingError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get booking by ID
 * 
 * @param bookingId - Booking ID
 * @param dispatch - Redux dispatch
 * @returns Booking details
 */
const getBookingById = async (
  bookingId: string,
  dispatch: AppDispatch
): Promise<Booking> => {
  try {
    dispatch(setBookingLoading(true));
    
    const { data } = await api.get<BookingResponse>(`/bookings/${bookingId}`);

    const booking = (data.booking || data) as Booking;
    
    // Update Redux store
    dispatch(setCurrentBooking(booking));
    
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
    
    dispatch(setBookingError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Cancel a booking
 * 
 * @param bookingId - Booking ID
 * @param cancelData - Optional cancellation data
 * @param dispatch - Redux dispatch
 */
const cancelBooking = async (
  bookingId: string,
  cancelData?: CancelBookingRequest,
  dispatch?: AppDispatch
): Promise<void> => {
  try {
    if (dispatch) dispatch(setBookingLoading(true));
    
    const { data } = await api.put<{ message: string }>(
      `/bookings/${bookingId}/cancel`,
      cancelData || {}
    );

    // Update Redux store - remove cancelled booking
    if (dispatch) {
      dispatch(removeBooking(bookingId));
      dispatch(setBookingLoading(false));
    }
    
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
    
    if (dispatch) dispatch(setBookingError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Update booking location
 * 
 * @param bookingId - Booking ID
 * @param locationData - Location update data
 * @param dispatch - Redux dispatch
 */
const updateBookingLocation = async (
  bookingId: string,
  locationData: UpdateBookingLocationRequest,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setBookingLoading(true));
    
    const { data } = await api.put<{ message: string }>(
      `/bookings/${bookingId}/location`,
      locationData
    );

    dispatch(setBookingLoading(false));
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
    
    dispatch(setBookingError(errorMessage));
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
