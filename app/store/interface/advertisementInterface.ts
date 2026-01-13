// Advertisement Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface User {
  _id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export interface Advertisement {
  _id: string;
  image: string; // URL to the advertisement image
  description: LocalizedText;
  advertisementType: "privateLessons" | "courses" | "researches" | "all";
  createdBy: User | string;
  isApproved: boolean;
  approvedBy?: User | string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAdvertisementRequest {
  image: File;
  "description.ar": string;
  "description.en": string;
  advertisementType: "privateLessons" | "courses" | "researches" | "all";
}

export interface UpdateAdvertisementRequest {
  image?: File;
  "description.ar"?: string;
  "description.en"?: string;
  advertisementType?: "privateLessons" | "courses" | "researches" | "all";
}

export interface AdvertisementResponse {
  message?: string;
  advertisement: Advertisement;
}

export interface AdvertisementsResponse {
  advertisements: Advertisement[];
}

export interface AdvertisementState {
  advertisements: Advertisement[];
  currentAdvertisement: Advertisement | null;
  isLoading: boolean;
  error: string | null;
}
