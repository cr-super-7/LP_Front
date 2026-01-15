import api from "../utils/api";
import { setLoading, setError, setCourses, setCurrentCourse, addCourse, updateCourse as updateCourseAction, removeCourse } from "../slice/courseSlice";
import { AppDispatch } from "../store";
import type { Course, CoursesResponse, CourseResponse, GetCoursesParams, CreateCourseRequest } from "../interface/courseInterface";
import toast from "react-hot-toast";

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

const createCourse = async (courseData: CreateCourseRequest, dispatch: AppDispatch): Promise<Course> => {
  try {
    dispatch(setLoading(true));
    
    const formData = new FormData();
    
    // Add required fields
    formData.append("title.ar", courseData["title.ar"]);
    formData.append("title.en", courseData["title.en"]);
    formData.append("description.ar", courseData["description.ar"]);
    formData.append("description.en", courseData["description.en"]);
    formData.append("Teacher", courseData.Teacher);
    formData.append("category", courseData.category);
    formData.append("courseType", courseData.courseType);
    formData.append("level", courseData.level);
    formData.append("price", courseData.price.toString());
    formData.append("currency", courseData.currency);
    formData.append("durationHours", courseData.durationHours.toString());
    
    // Add department or othersPlace based on courseType (required by API)
    if (courseData.courseType === "university") {
      if (courseData.department) {
        formData.append("department", courseData.department);
      } else {
        throw new Error("Department is required for university courses");
      }
    } else if (courseData.courseType === "others") {
      if (courseData.othersPlace && courseData.othersPlace.trim() !== "") {
        formData.append("othersPlace", courseData.othersPlace);
      } else {
        throw new Error("othersPlace is required for others courses");
      }
    }
    if (courseData.totalLessons !== undefined) {
      formData.append("totalLessons", courseData.totalLessons.toString());
    }
    if (courseData.isPublished !== undefined) {
      formData.append("isPublished", courseData.isPublished.toString());
    }
    if (courseData.thumbnail) {
      formData.append("thumbnail", courseData.thumbnail);
    }
    
    const { data } = await api.post("/courses", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // API response shape:
    // { message: string, course: Course }
    const courseResponse: CourseResponse = data;
    const course = (courseResponse.course || data.result?.course || data) as Course;

    dispatch(addCourse(course));
    dispatch(setLoading(false));
   
    return course;
  } catch (error: unknown) {
    let errorMessage = "Failed to create course";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const getCourses = async (params: GetCoursesParams = {}, dispatch: AppDispatch): Promise<CoursesResponse> => {
  try {
    dispatch(setLoading(true));
    const { page = 1, limit = 10, sort = "-createdAt" } = params;
    
    const { data } = await api.get("/courses", {
      params: {
        page,
        limit,
        sort,
      },
    });

    // API response shape:
    // { message: string, courses: Course[], total: number, page: number, limit: number, totalPages: number }
    const coursesResponse: CoursesResponse = {
      message: data.message || "Courses retrieved successfully",
      courses: data.courses || data.result?.courses || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      totalPages: data.totalPages || Math.ceil((data.total || 0) / limit),
    };

    dispatch(
      setCourses({
        courses: coursesResponse.courses,
        pagination: {
          page: coursesResponse.page || page,
          limit: coursesResponse.limit || limit,
          total: coursesResponse.total || 0,
          totalPages: coursesResponse.totalPages || Math.ceil((coursesResponse.total || 0) / limit),
        },
      })
    );

    dispatch(setLoading(false));
    return coursesResponse;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch courses";
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

const getTeacherCourses = async (dispatch: AppDispatch): Promise<Course[]> => {
  try {
    dispatch(setLoading(true));
    
    const { data } = await api.get("/courses/teacher/my");

    // API response shape: Course[] or { courses: Course[] } or { message: string, courses: Course[] }
    const courses: Course[] = Array.isArray(data) 
      ? data 
      : data.courses || data.result?.courses || [];

    dispatch(
      setCourses({
        courses: courses,
        pagination: {
          page: 1,
          limit: courses.length,
          total: courses.length,
          totalPages: 1,
        },
      })
    );

    dispatch(setLoading(false));
    return courses;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch teacher courses";
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

const getCourseById = async (courseId: string, dispatch: AppDispatch): Promise<Course> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/courses/${courseId}`);

    // API response shape:
    // { message: string, course: Course }
    const courseResponse: CourseResponse = data;
    const course = (courseResponse.course || data.result?.course || data) as Course;

    dispatch(setCurrentCourse(course));
    dispatch(setLoading(false));
    return course;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch course";
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

const updateCourse = async (courseId: string, courseData: Partial<CreateCourseRequest>, dispatch: AppDispatch): Promise<Course> => {
  try {
    dispatch(setLoading(true));
    
    const formData = new FormData();
    
    // Add fields that are provided
    if (courseData["title.ar"]) formData.append("title.ar", courseData["title.ar"]);
    if (courseData["title.en"]) formData.append("title.en", courseData["title.en"]);
    if (courseData["description.ar"]) formData.append("description.ar", courseData["description.ar"]);
    if (courseData["description.en"]) formData.append("description.en", courseData["description.en"]);
    if (courseData.Teacher) formData.append("Teacher", courseData.Teacher);
    if (courseData.category) formData.append("category", courseData.category);
    if (courseData.courseType) formData.append("courseType", courseData.courseType);
    if (courseData.level) formData.append("level", courseData.level);
    if (courseData.price !== undefined) formData.append("price", courseData.price.toString());
    if (courseData.currency) formData.append("currency", courseData.currency);
    if (courseData.durationHours !== undefined) formData.append("durationHours", courseData.durationHours.toString());
    if (courseData.department) formData.append("department", courseData.department);
    if (courseData.othersPlace) formData.append("othersPlace", courseData.othersPlace);
    if (courseData.totalLessons !== undefined) formData.append("totalLessons", courseData.totalLessons.toString());
    if (courseData.isPublished !== undefined) formData.append("isPublished", courseData.isPublished.toString());
    if (courseData.thumbnail) formData.append("thumbnail", courseData.thumbnail);
    
    const { data } = await api.put(`/courses/${courseId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const courseResponse: CourseResponse = data;
    const course = (courseResponse.course || data.result?.course || data) as Course;

    dispatch(updateCourseAction(course));
    dispatch(setLoading(false));
    toast.success(courseResponse.message || "Course updated successfully");
    return course;
  } catch (error: unknown) {
    let errorMessage = "Failed to update course";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const deleteCourse = async (courseId: string, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));
    
    const { data } = await api.delete(`/courses/${courseId}`);

    dispatch(removeCourse(courseId));
    dispatch(setLoading(false));
    toast.success(data.message || "Course deleted successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to delete course";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const getCoursesByCategory = async (
  categoryId: string,
  dispatch: AppDispatch
): Promise<{ category: any; courses: Course[]; message?: string }> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/courses/category/${categoryId}`);

    // API response shape:
    // { message: string, category: Category, courses: Course[] }
    const category = data.category || {};
    const courses = data.courses || [];

    dispatch(setLoading(false));
    return {
      category,
      courses,
      message: data.message || "Courses retrieved successfully",
    };
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch courses by category";
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

export { createCourse, getCourses, getTeacherCourses, getCourseById, updateCourse, deleteCourse, getCoursesByCategory };

