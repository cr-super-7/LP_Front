import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { OthersPlaceState, OthersPlace } from "../interface/othersPlaceInterface";

// Initial state
const initialState: OthersPlaceState = {
  othersPlaces: [],
  currentOthersPlace: null,
  isLoading: false,
  error: null,
};

// OthersPlace slice
const othersPlaceSlice = createSlice({
  name: "othersPlace",
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

    // Set othersPlaces list
    setOthersPlaces: (state, action: PayloadAction<OthersPlace[]>) => {
      state.othersPlaces = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current othersPlace
    setCurrentOthersPlace: (state, action: PayloadAction<OthersPlace | null>) => {
      state.currentOthersPlace = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add othersPlace to list
    addOthersPlace: (state, action: PayloadAction<OthersPlace>) => {
      state.othersPlaces.unshift(action.payload);
    },

    // Update othersPlace in list
    updateOthersPlace: (state, action: PayloadAction<OthersPlace>) => {
      const index = state.othersPlaces.findIndex((place) => place._id === action.payload._id);
      if (index !== -1) {
        state.othersPlaces[index] = action.payload;
      }
      if (state.currentOthersPlace?._id === action.payload._id) {
        state.currentOthersPlace = action.payload;
      }
    },

    // Remove othersPlace from list
    removeOthersPlace: (state, action: PayloadAction<string>) => {
      state.othersPlaces = state.othersPlaces.filter((place) => place._id !== action.payload);
      if (state.currentOthersPlace?._id === action.payload) {
        state.currentOthersPlace = null;
      }
    },

    // Reset state
    resetOthersPlaceState: (state) => {
      state.othersPlaces = [];
      state.currentOthersPlace = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setOthersPlaces,
  setCurrentOthersPlace,
  addOthersPlace,
  updateOthersPlace,
  removeOthersPlace,
  resetOthersPlaceState,
} = othersPlaceSlice.actions;

export default othersPlaceSlice.reducer;
