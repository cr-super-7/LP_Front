import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  ProgressState,
  LessonProgress,
  CourseProgress,
  OverallProgressSummary,
  OverallCourseProgress,
} from "../interface/progressInterface";

// Initial state
const initialState: ProgressState & {
  overallSummary: OverallProgressSummary | null;
  coursesProgress: OverallCourseProgress[];
} = {
  progress: [],
  currentCourseProgress: null,
  isLoading: false,
  error: null,
  overallSummary: null,
  coursesProgress: [],
};

// Progress slice
const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    // Set loading state
    setProgressLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setProgressError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearProgressError: (state) => {
      state.error = null;
    },

    // Set all progress records
    setProgress: (state, action: PayloadAction<LessonProgress[]>) => {
      state.progress = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current course progress
    setCourseProgress: (state, action: PayloadAction<CourseProgress | null>) => {
      state.currentCourseProgress = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Update single lesson progress
    updateLessonProgressState: (state, action: PayloadAction<LessonProgress>) => {
      const lessonId = typeof action.payload.lesson === "string" 
        ? action.payload.lesson 
        : action.payload.lesson?._id;
      
      // Update in progress array
      const index = state.progress.findIndex((p) => {
        const pLessonId = typeof p.lesson === "string" ? p.lesson : p.lesson?._id;
        return pLessonId === lessonId;
      });
      
      if (index !== -1) {
        state.progress[index] = action.payload;
      } else {
        state.progress.push(action.payload);
      }

      // Update in currentCourseProgress if exists
      if (state.currentCourseProgress?.lessons) {
        const lessonIndex = state.currentCourseProgress.lessons.findIndex(
          (l) => l.lesson._id === lessonId
        );
        if (lessonIndex !== -1 && state.currentCourseProgress.lessons[lessonIndex]) {
          state.currentCourseProgress.lessons[lessonIndex].progress = {
            progress: action.payload.progress,
            completed: action.payload.completed || false,
            completedAt: action.payload.completedAt || null,
            lastWatchedAt: action.payload.lastWatchedAt,
            watchTime: action.payload.watchTime,
          };
          
          // Recalculate overall progress
          const completedLessons = state.currentCourseProgress.lessons.filter(
            (l) => l.progress?.completed
          ).length;
          const totalLessons = state.currentCourseProgress.lessons.length;
          
          state.currentCourseProgress.completedLessons = completedLessons;
          state.currentCourseProgress.overallProgress = totalLessons > 0 
            ? Math.round((completedLessons / totalLessons) * 100) 
            : 0;
        }
      }
    },

    // Set overall progress summary
    setOverallProgress: (
      state,
      action: PayloadAction<{
        summary: OverallProgressSummary;
        courses: OverallCourseProgress[];
      }>
    ) => {
      state.overallSummary = action.payload.summary;
      state.coursesProgress = action.payload.courses;
      state.isLoading = false;
      state.error = null;
    },

    // Reset state
    resetProgressState: (state) => {
      state.progress = [];
      state.currentCourseProgress = null;
      state.error = null;
      state.isLoading = false;
      state.overallSummary = null;
      state.coursesProgress = [];
    },
  },
});

export const {
  setProgressLoading,
  setProgressError,
  clearProgressError,
  setProgress,
  setCourseProgress,
  updateLessonProgressState,
  setOverallProgress,
  resetProgressState,
} = progressSlice.actions;

export default progressSlice.reducer;
