import api from "../utils/api";
import { setLoading, setError, setDepartments, setCurrentDepartment } from "../slice/departmentSlice";
import { AppDispatch } from "../store";
import type { Department, DepartmentsResponse, DepartmentResponse } from "../interface/departmentInterface";

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

const getDepartments = async (dispatch: AppDispatch): Promise<Department[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/departments");

    // API response shape:
    // { departments: Department[] }
    const departmentsResponse: DepartmentsResponse = data;
    const departments = departmentsResponse.departments || data.result?.departments || [];

    dispatch(setDepartments(departments));
    dispatch(setLoading(false));
    return departments;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch departments";
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

const getDepartmentById = async (departmentId: string, dispatch: AppDispatch): Promise<Department> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/departments/${departmentId}`);

    // API response shape:
    // { message: string, department: Department }
    const departmentResponse: DepartmentResponse = data;
    const department = (departmentResponse.department || data.result?.department || data) as Department;

    dispatch(setCurrentDepartment(department));
    dispatch(setLoading(false));
    return department;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch department";
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

export { getDepartments, getDepartmentById };

