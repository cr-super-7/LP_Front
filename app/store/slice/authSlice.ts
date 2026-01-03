import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse } from "../interface/auth.interface";

// Initial state
const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null,
  isAuthenticated: typeof window !== "undefined" 
    ? !!localStorage.getItem("token")
    : false,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set loading state (alias for setLoading)
    setIsLoading: (state, action: PayloadAction<boolean>) => {
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
    
    // Set credentials (login/register success)
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    
    // Set auth (alternative to setCredentials, accepts user and token separately)
    setAuth: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    
    // Logout
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setLoading, setIsLoading, setError, clearError, setCredentials, setAuth, logout } = authSlice.actions;
export default authSlice.reducer;

