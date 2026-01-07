import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DepartmentState, Department } from "../interface/departmentInterface";

// Initial state
const initialState: DepartmentState = {
  departments: [],
  currentDepartment: null,
  isLoading: false,
  error: null,
};

// Department slice
const departmentSlice = createSlice({
  name: "department",
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

    // Set departments list
    setDepartments: (state, action: PayloadAction<Department[]>) => {
      state.departments = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current department
    setCurrentDepartment: (state, action: PayloadAction<Department | null>) => {
      state.currentDepartment = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add department to list
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.unshift(action.payload);
    },

    // Update department in list
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex((dept) => dept._id === action.payload._id);
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
      if (state.currentDepartment?._id === action.payload._id) {
        state.currentDepartment = action.payload;
      }
    },

    // Remove department from list
    removeDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((dept) => dept._id !== action.payload);
      if (state.currentDepartment?._id === action.payload) {
        state.currentDepartment = null;
      }
    },

    // Reset state
    resetDepartmentState: (state) => {
      state.departments = [];
      state.currentDepartment = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setDepartments,
  setCurrentDepartment,
  addDepartment,
  updateDepartment,
  removeDepartment,
  resetDepartmentState,
} = departmentSlice.actions;

export default departmentSlice.reducer;

