import api from "../utils/api";
import { setIsLoading, setError, setAuth } from "../slice/authSlice";
import { AppDispatch } from "../store";
import type { RegisterRequest, UserProfile, UpdateProfileRequest, ChangePasswordRequest } from "../interface/auth.interface";
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

const register = async (user: RegisterRequest, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        const { data } = await api.post('/auth/register', user);
        console.log('Register response:', data);
        console.log('Register result:', data.result);
        dispatch(setIsLoading(false));
       
        return data;
    } catch (error: unknown) {
        // Extract meaningful error message from server response
        let errorMessage = 'An error occurred during registration';
        const err = error as ErrorResponse;
        
        if (err.response?.data?.message) {
            // Server returned a specific error message
            errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
            // Alternative error field
            errorMessage = err.response.data.error;
        } else if (err.response?.status === 400) {
            errorMessage = 'Invalid data, please check the entered information';
        } else if (err.response?.status === 409) {
            errorMessage = 'Email is already in use';
        } else if (err.response?.status === 500) {
            errorMessage = 'Server error, please try again later';
        } else if (err.message) {
            errorMessage = err.message;
        }
        
        dispatch(setError(errorMessage));
        dispatch(setIsLoading(false));
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

const login = async (email: string, password: string, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        const { data } = await api.post('/auth/login', { email, password });
        console.log('Login response:', data);
        console.log('Login result:', data.result);
        console.log('Login result type:', typeof data.result);
        console.log('Login result keys:', Object.keys(data.result || {}));
        
        // Extract user data and token from response
        const userData = data.result || data;
        const token = userData.token || userData.accessToken || userData.access_token || data.token;
        
        if (!token) {
            throw new Error('Token not found in response');
        }
        
        console.log('User data to be saved:', userData);
        console.log('Token to be saved:', token);
        
        // Use setAuth to save both user data and token
        dispatch(setAuth({ user: userData.user || userData, token }));
        dispatch(setIsLoading(false));
       
        return data;        
    } catch (error: unknown) {
        let errorMessage = 'An error occurred during login';
        const err = error as ErrorResponse;
        if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
        } else if (err.message) {
            errorMessage = err.message;
        }
        dispatch(setError(errorMessage));
        dispatch(setIsLoading(false));
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

const getUserProfile = async (userId: string, dispatch: AppDispatch): Promise<UserProfile> => {
    try {
        dispatch(setIsLoading(true));
        const { data } = await api.get(`/auth/user/${userId}`);
        // API response shape:
        // { message: string, user: { ...UserProfile } }
        const userProfile = (data.user || data.result?.user || data) as UserProfile;
        dispatch(setIsLoading(false));
        return userProfile;
    } catch (error: unknown) {
        let errorMessage = 'Failed to fetch user profile';
        const err = error as ErrorResponse;
        if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
        } else if (err.message) {
            errorMessage = err.message;
        }
        dispatch(setError(errorMessage));
        dispatch(setIsLoading(false));
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

const updateProfile = async (profileData: UpdateProfileRequest, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        const formData = new FormData();
        
        if (profileData.bio !== undefined) {
            formData.append('bio', profileData.bio);
        }
        if (profileData.location !== undefined) {
            formData.append('location', profileData.location);
        }
        if (profileData.profilePicture) {
            formData.append('profilePicture', profileData.profilePicture);
        }
        
        const { data } = await api.put('/auth/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        dispatch(setIsLoading(false));
        toast.success(data.message || 'Profile updated successfully');
        return data;
    } catch (error: unknown) {
        let errorMessage = 'Failed to update profile';
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
        dispatch(setIsLoading(false));
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

const changePassword = async (passwordData: ChangePasswordRequest, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        const { data } = await api.post('/auth/change-password', passwordData);
        dispatch(setIsLoading(false));
        toast.success(data.message || 'Password changed successfully');
        return data;
    } catch (error: unknown) {
        let errorMessage = 'Failed to change password';
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
        dispatch(setIsLoading(false));
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

export {
    register,
    login,
    getUserProfile,
    updateProfile,
    changePassword,
};
