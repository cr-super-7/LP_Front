import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Booking } from "../interface/bookingInterface";

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBookingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.unshift(action.payload);
    },
    updateBookingState: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      if (state.currentBooking?._id === action.payload._id) {
        state.currentBooking = action.payload;
      }
    },
    removeBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      if (state.currentBooking?._id === action.payload) {
        state.currentBooking = null;
      }
    },
    resetBookingState: (state) => {
      state.bookings = [];
      state.currentBooking = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setBookingLoading,
  setBookingError,
  clearBookingError,
  setBookings,
  setCurrentBooking,
  addBooking,
  updateBookingState,
  removeBooking,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
