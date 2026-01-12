import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PrivateLessonState, PrivateLesson } from "../interface/privateLessonInterface";

// Initial state
const initialState: PrivateLessonState = {
  privateLessons: [],
  currentPrivateLesson: null,
  isLoading: false,
  error: null,
};

// Private Lesson slice
const privateLessonSlice = createSlice({
  name: "privateLesson",
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

    // Set private lessons list
    setPrivateLessons: (state, action: PayloadAction<PrivateLesson[]>) => {
      state.privateLessons = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current private lesson
    setCurrentPrivateLesson: (state, action: PayloadAction<PrivateLesson | null>) => {
      state.currentPrivateLesson = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add private lesson to list
    addPrivateLesson: (state, action: PayloadAction<PrivateLesson>) => {
      state.privateLessons.unshift(action.payload);
    },

    // Update private lesson in list
    updatePrivateLesson: (state, action: PayloadAction<PrivateLesson>) => {
      const index = state.privateLessons.findIndex((lesson) => lesson._id === action.payload._id);
      if (index !== -1) {
        state.privateLessons[index] = action.payload;
      }
      if (state.currentPrivateLesson?._id === action.payload._id) {
        state.currentPrivateLesson = action.payload;
      }
    },

    // Remove private lesson from list
    removePrivateLesson: (state, action: PayloadAction<string>) => {
      state.privateLessons = state.privateLessons.filter((lesson) => lesson._id !== action.payload);
      if (state.currentPrivateLesson?._id === action.payload) {
        state.currentPrivateLesson = null;
      }
    },

    // Reset state
    resetPrivateLessonState: (state) => {
      state.privateLessons = [];
      state.currentPrivateLesson = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setPrivateLessons,
  setCurrentPrivateLesson,
  addPrivateLesson,
  updatePrivateLesson,
  removePrivateLesson,
  resetPrivateLessonState,
} = privateLessonSlice.actions;

export default privateLessonSlice.reducer;
