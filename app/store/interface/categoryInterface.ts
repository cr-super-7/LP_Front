// Category Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface Category {
  _id: string;
  name: LocalizedText | string;
  description?: LocalizedText | string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryResponse {
  message?: string;
  category: Category;
}

export interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

