import axios from 'axios';

const api = axios.create({
  baseURL: `${(import.meta.env.VITE_API_BASE_URL || 'https://sahi-spotv.vercel.app').replace(/\/$/, '')}/api/v1`,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    if (error.response && error.response.status === 401) {
      
      console.error('Unauthorized! Redirecting to login...');
      
    }
    return Promise.reject(error);
  }
);

export default api;
