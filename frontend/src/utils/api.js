import axios from 'axios';

// Create axios instance with production-ready configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden - insufficient permissions');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error - please try again later');
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      // Network error
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
      errors: error.response.data.errors || []
    };
  } else if (error.request) {
    return {
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};

// Helper function to make authenticated requests
export const makeAuthenticatedRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;