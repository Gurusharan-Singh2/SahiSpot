
import api from './api';

const buildAuthPayload = (data) => {
  if (!data?.photo) {
    return data;
  }

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "photo") {
      formData.append("img", value);
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export const authService = {
  
  signup: async (data) => {
    const response = await api.post('/signup', data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const payload = buildAuthPayload(data);
    const response = await api.post('/verify-otp', payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/login', data);
    return response.data;
  },

  adminLogin: async (data) => {
    const response = await api.post('/admin/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/forgot-password/reset', data);
    return response.data;
  },

  editProfile: async (data) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.photo) formData.append("img", data.photo);
    const response = await api.put('/profile/edit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  }
};
