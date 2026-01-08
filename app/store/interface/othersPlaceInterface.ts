// OthersPlace Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface OthersPlace {
  _id: string;
  name: string | LocalizedText;
  description?: string | LocalizedText;
  location?: string | LocalizedText;
  image?: string;
  createdAt?: string;
  __v?: number;
}

export interface OthersPlacesResponse {
  othersPlaces?: OthersPlace[];
  othersPlace?: OthersPlace[];
  message?: string;
}

export interface OthersPlaceResponse {
  message?: string;
  othersPlace: OthersPlace;
}

export interface OthersPlaceState {
  othersPlaces: OthersPlace[];
  currentOthersPlace: OthersPlace | null;
  isLoading: boolean;
  error: string | null;
}
