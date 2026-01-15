// Enrollment Interfaces

export interface Enrollment {
  _id: string;
  student: string | {
    _id: string;
    email: string;
    [key: string]: any;
  };
  course: string | {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
    [key: string]: any;
  };
  enrolledAt: string;
  status: "active" | "cancelled" | "completed";
  cancelledAt?: string;
  completedAt?: string;
}

export interface CreateEnrollmentRequest {
  courseId: string;
}

export interface EnrollmentResponse {
  message?: string;
  enrollment: Enrollment;
}

export interface EnrollmentsResponse {
  enrollments: Enrollment[];
}

export interface EnrollmentState {
  enrollments: Enrollment[];
  currentEnrollment: Enrollment | null;
  isLoading: boolean;
  error: string | null;
}
