import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LessonState, Lesson } from "../interface/lessonInterface";

// Initial state
const initialState: LessonState = {
  lessons: [],
  currentLesson: null,
  isLoading: false,
  error: null,
};

// Lesson slice
const lessonSlice = createSlice({
  name: "lesson",
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

    // Set lessons list
    setLessons: (state, action: PayloadAction<Lesson[]>) => {
      state.lessons = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current lesson
    setCurrentLesson: (state, action: PayloadAction<Lesson | null>) => {
      state.currentLesson = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add lesson to list
    addLesson: (state, action: PayloadAction<Lesson>) => {
      state.lessons.unshift(action.payload);
    },

    // Update lesson in list
    updateLesson: (state, action: PayloadAction<Lesson>) => {
      const index = state.lessons.findIndex((lesson) => lesson._id === action.payload._id);
      if (index !== -1) {
        state.lessons[index] = action.payload;
      }
      if (state.currentLesson?._id === action.payload._id) {
        state.currentLesson = action.payload;
      }
    },

    // Remove lesson from list
    removeLesson: (state, action: PayloadAction<string>) => {
      state.lessons = state.lessons.filter((lesson) => lesson._id !== action.payload);
      if (state.currentLesson?._id === action.payload) {
        state.currentLesson = null;
      }
    },

    // Reset state
    resetLessonState: (state) => {
      state.lessons = [];
      state.currentLesson = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setLessons,
  setCurrentLesson,
  addLesson,
  updateLesson,
  removeLesson,
  resetLessonState,
} = lessonSlice.actions;

export default lessonSlice.reducer;
