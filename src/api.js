import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
      
      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        window.location.href = '/dashboard';
      }
      
      // Return server error message if available
      if (error.response.data && error.response.data.message) {
        return Promise.reject(error.response.data);
      }
    }
    
    // Return a generic error message
    return Promise.reject({
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
);

export default api;
