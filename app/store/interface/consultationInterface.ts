// Consultation Interfaces

export interface Consultation {
  _id: string;
  student: string | {
    _id: string;
    email: string;
    [key: string]: any;
  };
  professor: string | {
    _id: string;
    email: string;
    [key: string]: any;
  };
  type: "call" | "chat";
  status: "pending" | "active" | "completed" | "cancelled";
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateConsultationRequest {
  professorId: string;
  type: "call" | "chat";
  scheduledAt?: string; // ISO date string
}

export interface CancelConsultationRequest {
  cancellationReason?: string;
}

export interface ConsultationResponse {
  message?: string;
  consultation: Consultation;
}

export interface ConsultationsResponse {
  consultations: Consultation[];
}

export interface ConsultationState {
  consultations: Consultation[];
  currentConsultation: Consultation | null;
  isLoading: boolean;
  error: string | null;
}
