import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CollegeState, College } from "../interface/collegeInterface";

// Initial state
const initialState: CollegeState = {
  colleges: [],
  currentCollege: null,
  isLoading: false,
  error: null,
};

// College slice
const collegeSlice = createSlice({
  name: "college",
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

    // Set colleges list
    setColleges: (state, action: PayloadAction<College[]>) => {
      state.colleges = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current college
    setCurrentCollege: (state, action: PayloadAction<College | null>) => {
      state.currentCollege = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add college to list
    addCollege: (state, action: PayloadAction<College>) => {
      state.colleges.unshift(action.payload);
    },

    // Update college in list
    updateCollege: (state, action: PayloadAction<College>) => {
      const index = state.colleges.findIndex((col) => col._id === action.payload._id);
      if (index !== -1) {
        state.colleges[index] = action.payload;
      }
      if (state.currentCollege?._id === action.payload._id) {
        state.currentCollege = action.payload;
      }
    },

    // Remove college from list
    removeCollege: (state, action: PayloadAction<string>) => {
      state.colleges = state.colleges.filter((col) => col._id !== action.payload);
      if (state.currentCollege?._id === action.payload) {
        state.currentCollege = null;
      }
    },

    // Reset state
    resetCollegeState: (state) => {
      state.colleges = [];
      state.currentCollege = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setColleges,
  setCurrentCollege,
  addCollege,
  updateCollege,
  removeCollege,
  resetCollegeState,
} = collegeSlice.actions;

export default collegeSlice.reducer;

