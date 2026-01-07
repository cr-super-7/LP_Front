import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UniversityState, University } from "../interface/universityInterface";

// Initial state
const initialState: UniversityState = {
  universities: [],
  currentUniversity: null,
  isLoading: false,
  error: null,
};

// University slice
const universitySlice = createSlice({
  name: "university",
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

    // Set universities list
    setUniversities: (state, action: PayloadAction<University[]>) => {
      state.universities = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current university
    setCurrentUniversity: (state, action: PayloadAction<University | null>) => {
      state.currentUniversity = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add university to list
    addUniversity: (state, action: PayloadAction<University>) => {
      state.universities.unshift(action.payload);
    },

    // Update university in list
    updateUniversity: (state, action: PayloadAction<University>) => {
      const index = state.universities.findIndex((uni) => uni._id === action.payload._id);
      if (index !== -1) {
        state.universities[index] = action.payload;
      }
      if (state.currentUniversity?._id === action.payload._id) {
        state.currentUniversity = action.payload;
      }
    },

    // Remove university from list
    removeUniversity: (state, action: PayloadAction<string>) => {
      state.universities = state.universities.filter((uni) => uni._id !== action.payload);
      if (state.currentUniversity?._id === action.payload) {
        state.currentUniversity = null;
      }
    },

    // Reset state
    resetUniversityState: (state) => {
      state.universities = [];
      state.currentUniversity = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setUniversities,
  setCurrentUniversity,
  addUniversity,
  updateUniversity,
  removeUniversity,
  resetUniversityState,
} = universitySlice.actions;

export default universitySlice.reducer;

