import api from "../utils/api";
import { setLoading, setError, setCategories, setCurrentCategory } from "../slice/categorySlice";
import { AppDispatch } from "../store";
import type { Category, CategoriesResponse, CategoryResponse } from "../interface/categoryInterface";

// Define error response interface
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

const getCategories = async (dispatch: AppDispatch): Promise<Category[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/categories");

    // Debug: Log the raw response
    console.log("Raw categories API response:", data);

    // API response shape:
    // { categories: Category[] }
    const categoriesResponse: CategoriesResponse = data;
    
    // Try different response structures
    let categories = categoriesResponse.categories || data.result?.categories || data.categories || [];
    
    // If categories is nested (categories inside categories), flatten it
    if (Array.isArray(categories) && categories.length > 0 && categories[0]?.categories) {
      // Flatten nested structure
      const flattenedCategories: Category[] = [];
      categories.forEach((cat: any) => {
        if (cat.categories && Array.isArray(cat.categories)) {
          flattenedCategories.push(...cat.categories);
        } else {
          flattenedCategories.push(cat);
        }
      });
      categories = flattenedCategories;
    }

    console.log("Processed categories:", categories);

    dispatch(setCategories(categories));
    dispatch(setLoading(false));
    return categories;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch categories";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const getCategoryById = async (categoryId: string, dispatch: AppDispatch): Promise<Category> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/categories/${categoryId}`);

    // API response shape:
    // { message: string, category: Category }
    const categoryResponse: CategoryResponse = data;
    const category = (categoryResponse.category || data.result?.category || data) as Category;

    dispatch(setCurrentCategory(category));
    dispatch(setLoading(false));
    return category;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch category";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export { getCategories, getCategoryById };

