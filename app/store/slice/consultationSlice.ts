import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Consultation } from "../interface/consultationInterface";

interface ConsultationState {
  consultations: Consultation[];
  currentConsultation: Consultation | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ConsultationState = {
  consultations: [],
  currentConsultation: null,
  isLoading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    setConsultationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setConsultationError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearConsultationError: (state) => {
      state.error = null;
    },
    setConsultations: (state, action: PayloadAction<Consultation[]>) => {
      state.consultations = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentConsultation: (state, action: PayloadAction<Consultation | null>) => {
      state.currentConsultation = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addConsultation: (state, action: PayloadAction<Consultation>) => {
      state.consultations.unshift(action.payload);
    },
    updateConsultationState: (state, action: PayloadAction<Consultation>) => {
      const index = state.consultations.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.consultations[index] = action.payload;
      }
      if (state.currentConsultation?._id === action.payload._id) {
        state.currentConsultation = action.payload;
      }
    },
    removeConsultation: (state, action: PayloadAction<string>) => {
      state.consultations = state.consultations.filter((c) => c._id !== action.payload);
      if (state.currentConsultation?._id === action.payload) {
        state.currentConsultation = null;
      }
    },
    resetConsultationState: (state) => {
      state.consultations = [];
      state.currentConsultation = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setConsultationLoading,
  setConsultationError,
  clearConsultationError,
  setConsultations,
  setCurrentConsultation,
  addConsultation,
  updateConsultationState,
  removeConsultation,
  resetConsultationState,
} = consultationSlice.actions;

export default consultationSlice.reducer;
