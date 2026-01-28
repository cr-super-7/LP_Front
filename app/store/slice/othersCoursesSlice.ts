import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { OthersCoursesState, OthersCourse } from "../interface/othersCoursesInterface";

// Initial state
const initialState: OthersCoursesState = {
  othersCourses: [],
  currentOthersCourse: null,
  isLoading: false,
  error: null,
};

// OthersCourses slice
const othersCoursesSlice = createSlice({
  name: "othersCourses",
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

    // Set othersCourses list
    setOthersCourses: (state, action: PayloadAction<OthersCourse[]>) => {
      state.othersCourses = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current othersCourse
    setCurrentOthersCourse: (state, action: PayloadAction<OthersCourse | null>) => {
      state.currentOthersCourse = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add othersCourse to list
    addOthersCourse: (state, action: PayloadAction<OthersCourse>) => {
      state.othersCourses.unshift(action.payload);
    },

    // Update othersCourse in list
    updateOthersCourse: (state, action: PayloadAction<OthersCourse>) => {
      const index = state.othersCourses.findIndex((place) => place._id === action.payload._id);
      if (index !== -1) {
        state.othersCourses[index] = action.payload;
      }
      if (state.currentOthersCourse?._id === action.payload._id) {
        state.currentOthersCourse = action.payload;
      }
    },

    // Remove othersCourse from list
    removeOthersCourse: (state, action: PayloadAction<string>) => {
      state.othersCourses = state.othersCourses.filter((place) => place._id !== action.payload);
      if (state.currentOthersCourse?._id === action.payload) {
        state.currentOthersCourse = null;
      }
    },

    // Reset state
    resetOthersCoursesState: (state) => {
      state.othersCourses = [];
      state.currentOthersCourse = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setOthersCourses,
  setCurrentOthersCourse,
  addOthersCourse,
  updateOthersCourse,
  removeOthersCourse,
  resetOthersCoursesState,
} = othersCoursesSlice.actions;

export default othersCoursesSlice.reducer;
