// Blog Interfaces

export interface BlogAuthor {
  _id: string;
  email: string;
  phone: string;
  role: "student" | "instructor" | "teacher";
  createdAt: string;
  bio?: string;
  profilePicture?: string;
}

export interface BlogTitle {
  ar: string;
  en: string;
}

export interface BlogDescription {
  ar: string;
  en: string;
}

export interface Blog {
  _id: string;
  title: BlogTitle;
  description: BlogDescription;
  image: string;
  author: BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  message: string;
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogResponse {
  message: string;
  blog: Blog;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

