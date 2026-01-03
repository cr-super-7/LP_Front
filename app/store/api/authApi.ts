import api from "../utils/api";
import { setIsLoading, setError, setAuth } from "../slice/authSlice";
import { AppDispatch } from "../store";
import type { RegisterRequest } from "../interface/auth.interface";
import toast from 'react-hot-toast'
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
        toast.success(data.message);
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
        toast.success(data.message || 'Login successful');
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

const resendConfirmationEmail = async (email: string, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        const { data } = await api.post('/auth/resend-confirmation-email', { email }, { params: { email } });
        toast.success(data.message || 'Confirmation email resent');
        return data;
    } catch (error: unknown) {
        let errorMessage = 'Failed to resend confirmation email';
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
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

const confirmEmail = async (email: string, token: string, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        // Send as query params only to avoid any double encode/decode issues on the server side
        const { data } = await api.post('/auth/confirm-email', null, { params: { email, token } });
        toast.success(data.message || 'Email confirmed successfully');
        return data;
    } catch (error: unknown) {
        let errorMessage = 'Failed to confirm email';
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
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

const resetPassword = async (email: string, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        const { data } = await api.post('/auth/send-reset-password-email', { email }, { params: { email } });
        toast.success(data.message || 'Password reset email sent successfully');
        return data;
    } catch (error: unknown) {
        let errorMessage = 'Failed to reset password';
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
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

const repassword = async (email: string, token: string, newPassword: string, dispatch: AppDispatch) => {
    try {
        dispatch(setIsLoading(true));
        const { data } = await api.post('/auth/reset-password', { email, token, newPassword }, { params: { email, token, newPassword } });
        toast.success(data.message || 'Password reset successfully');
        return data;
    } catch (error: unknown) {
        let errorMessage = 'Failed to reset password';
        const err = error as ErrorResponse;
        
        // تحسين رسائل الخطأ
        if (err.response?.status === 401) {
            errorMessage = 'Token is invalid or expired. Please request a new password reset link.';
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
        } else if (err.message) {
            errorMessage = err.message;
        }
        
        dispatch(setIsLoading(false));
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
        throw new Error(errorMessage);
    } finally {
        dispatch(setIsLoading(false));
    }
};

export {
    register,
    login,
    resendConfirmationEmail,
    resetPassword,
    confirmEmail,
    repassword,
};
