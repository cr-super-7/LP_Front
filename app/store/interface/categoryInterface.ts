// Category Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface Category {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  createdAt: string;
  updatedAt: string;
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

