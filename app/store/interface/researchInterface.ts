// Research Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface Department {
  _id: string;
  name: LocalizedText;
  college?: {
    _id: string;
    name: LocalizedText;
    university?: {
      _id: string;
      name: LocalizedText;
    };
  };
}

export interface OthersPlace {
  _id: string;
  name: LocalizedText;
}

export interface User {
  _id: string;
  email: string;
}

export interface Research {
  _id: string;
  researcherName: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  file: string | null; // URL to the research file
  researchType: "university" | "others";
  department?: Department | string;
  othersPlace?: OthersPlace | string;
  createdBy: User | string;
  isApproved: boolean;
  approvedBy?: User | string | null;
  approvedAt?: string | null;
  // Popularity/Stats fields (new)
  viewCount?: number;
  popularityScore?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateResearchRequest {
  file?: File; // Optional file
  "researcherName.ar": string;
  "researcherName.en": string;
  "title.ar": string;
  "title.en": string;
  "description.ar": string;
  "description.en": string;
  researchType: "university" | "others";
  department?: string; // Required if researchType is 'university'
  othersPlace?: string; // Required if researchType is 'others'
}

export interface UpdateResearchRequest extends Partial<CreateResearchRequest> {
  file?: File;
}

export interface ResearchesResponse {
  message?: string;
  researches: Research[];
}

export interface ResearchResponse {
  message?: string;
  research: Research;
}

export interface ResearchState {
  researches: Research[];
  currentResearch: Research | null;
  isLoading: boolean;
  error: string | null;
}
