import axios from 'axios';

const api = axios.create({
  baseURL: `${(import.meta.env.VITE_API_BASE_URL || 'https://sahi-spotv.vercel.app').replace(/\/$/, '')}/api/v1`,
  withCredentials: true, // For cookie-based JWT authentication
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors, e.g. redirect to login on 401
    if (error.response && error.response.status === 401) {
      // Clear auth state if unauthorized
      console.error('Unauthorized! Redirecting to login...');
      // Logic for zustand auth store clear and redirect will be tied dynamically
    }
    return Promise.reject(error);
  }
);

export default api;
