import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Enrollment } from "../interface/enrollmentInterface";

interface EnrollmentState {
  enrollments: Enrollment[];
  currentEnrollment: Enrollment | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  currentEnrollment: null,
  isLoading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    setEnrollmentLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setEnrollmentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearEnrollmentError: (state) => {
      state.error = null;
    },
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentEnrollment: (state, action: PayloadAction<Enrollment | null>) => {
      state.currentEnrollment = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addEnrollment: (state, action: PayloadAction<Enrollment>) => {
      state.enrollments.unshift(action.payload);
    },
    updateEnrollmentState: (state, action: PayloadAction<Enrollment>) => {
      const index = state.enrollments.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        state.enrollments[index] = action.payload;
      }
      if (state.currentEnrollment?._id === action.payload._id) {
        state.currentEnrollment = action.payload;
      }
    },
    removeEnrollment: (state, action: PayloadAction<string>) => {
      state.enrollments = state.enrollments.filter((e) => e._id !== action.payload);
      if (state.currentEnrollment?._id === action.payload) {
        state.currentEnrollment = null;
      }
    },
    resetEnrollmentState: (state) => {
      state.enrollments = [];
      state.currentEnrollment = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setEnrollmentLoading,
  setEnrollmentError,
  clearEnrollmentError,
  setEnrollments,
  setCurrentEnrollment,
  addEnrollment,
  updateEnrollmentState,
  removeEnrollment,
  resetEnrollmentState,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
