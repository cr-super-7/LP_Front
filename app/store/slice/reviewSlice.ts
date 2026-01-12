import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ReviewState, Review } from "../interface/reviewInterface";

// Initial state
const initialState: ReviewState = {
  reviews: [],
  isLoading: false,
  error: null,
};

// Review slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set reviews list
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Reset state
    resetReviewState: (state) => {
      state.reviews = [];
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setReviews,
  resetReviewState,
} = reviewSlice.actions;

export default reviewSlice.reducer;
