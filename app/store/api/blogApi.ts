import api from "../utils/api";
import { setLoading, setError, setBlogs, setCurrentBlog } from "../slice/blogSlice";
import { AppDispatch } from "../store";
import type { Blog, BlogsResponse, BlogResponse, GetBlogsParams } from "../interface/blogInterface";
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

const getBlogs = async (params: GetBlogsParams = {}, dispatch: AppDispatch): Promise<BlogsResponse> => {
  try {
    dispatch(setLoading(true));
    const { page = 1, limit = 10, sort = "-createdAt" } = params;
    
    const { data } = await api.get("/blogs", {
      params: {
        page,
        limit,
        sort,
      },
    });

    // API response shape:
    // { message: string, blogs: Blog[], total: number, page: number, limit: number, totalPages: number }
    const blogsResponse: BlogsResponse = {
      message: data.message || "Blogs retrieved successfully",
      blogs: data.blogs || data.result?.blogs || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      totalPages: data.totalPages || Math.ceil((data.total || 0) / limit),
    };

    dispatch(
      setBlogs({
        blogs: blogsResponse.blogs,
        pagination: {
          page: blogsResponse.page,
          limit: blogsResponse.limit,
          total: blogsResponse.total,
          totalPages: blogsResponse.totalPages,
        },
      })
    );

    dispatch(setLoading(false));
    return blogsResponse;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch blogs";
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

const getBlogById = async (blogId: string, dispatch: AppDispatch): Promise<Blog> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/blogs/${blogId}`);

    // API response shape:
    // { message: string, blog: Blog }
    const blogResponse: BlogResponse = data;
    const blog = (blogResponse.blog || data.result?.blog || data) as Blog;

    dispatch(setCurrentBlog(blog));
    dispatch(setLoading(false));
    return blog;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch blog";
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

export { getBlogs, getBlogById };

