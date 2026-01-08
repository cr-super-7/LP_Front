import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CourseState, Course } from "../interface/courseInterface";

// Initial state
const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Course slice
const courseSlice = createSlice({
  name: "course",
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

    // Set courses list
    setCourses: (state, action: PayloadAction<{ courses: Course[]; pagination: CourseState["pagination"] }>) => {
      state.courses = action.payload.courses;
      state.pagination = action.payload.pagination;
      state.isLoading = false;
      state.error = null;
    },

    // Set current course
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add course to list
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.unshift(action.payload);
    },

    // Update course in list
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex((course) => course._id === action.payload._id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      if (state.currentCourse?._id === action.payload._id) {
        state.currentCourse = action.payload;
      }
    },

    // Remove course from list
    removeCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((course) => course._id !== action.payload);
      if (state.currentCourse?._id === action.payload) {
        state.currentCourse = null;
      }
    },

    // Reset state
    resetCourseState: (state) => {
      state.courses = [];
      state.currentCourse = null;
      state.error = null;
      state.isLoading = false;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCourses,
  setCurrentCourse,
  addCourse,
  updateCourse,
  removeCourse,
  resetCourseState,
} = courseSlice.actions;

export default courseSlice.reducer;

