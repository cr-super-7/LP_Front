// Auth Interfaces

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  role: "student" | "instructor";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  // Backend typically returns _id, some places may use id
  _id?: string;
  id?: string;
  email: string;
  phone: string;
  role: "student" | "instructor" | "teacher";
  inquiry?: boolean;
  profilePicture?: string | null;
  location?: string | null;
  bio?: string | null;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserProfile {
  _id: string;
  email: string;
  phone: string;
  role: "student" | "instructor" | "teacher";
  createdAt: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
}

export interface UpdateProfileRequest {
  bio?: string;
  location?: string;
  profilePicture?: File;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

