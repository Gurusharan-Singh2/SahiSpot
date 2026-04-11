import api from './api';
import { extractPayload, normalizeLocations } from '@/lib/parking';

const fetchFromFirstAvailableEndpoint = async (requests) => {
  let lastError = null;

  for (const request of requests) {
    try {
      const response = await request();
      return response;
    } catch (error) {
      lastError = error;
      if (error.response?.status && error.response.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
};

const normalizeUsers = (payload) => {
  const data = extractPayload(payload);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.users)
      ? data.users
      : Array.isArray(data?.allUser)
        ? data.allUser
      : Array.isArray(data?.allUsers)
        ? data.allUsers
        : Array.isArray(data?.adminUsers)
          ? data.adminUsers
          : Array.isArray(data?.userList)
            ? data.userList
          : [];

  return list.map((user) => ({
    id: String(user.id ?? user.user_id ?? user.userId ?? ''),
    name: user.name || 'Unnamed user',
    email: user.email || 'Email unavailable',
    role: String(user.role || 'user').toLowerCase(),
    raw: user,
  }));
};

export const adminService = {
  getPendingLocations: async () => {
    const response = await api.get('/admin/parking/pending', {
      params: { page: 1, limit: 100 },
    });
    return normalizeLocations(response.data);
  },

  getApprovedLocations: async () => {
    const response = await fetchFromFirstAvailableEndpoint([
      () => api.get('/admin/parking/approved', { params: { page: 1, limit: 100 } }),
      () => api.get('/admin/parking/approve', { params: { page: 1, limit: 100 } }),
      () => api.get('/admin/parking/locations', { params: { status: 'approved', page: 1, limit: 100 } }),
      () => api.get('/parking/locations', { params: { status: 'approved', page: 1, limit: 100 } }),
    ]);
    return normalizeLocations(response.data);
  },

  getAllUsers: async () => {
    const response = await fetchFromFirstAvailableEndpoint([
      () => api.get('/admin/allUser'),
      () => api.get('/admin/users'),
    ]);
    return normalizeUsers(response.data);
  },

  getAllLocations: async () => {
    const response = await fetchFromFirstAvailableEndpoint([
      () => api.get('/admin/parking/all', { params: { page: 1, limit: 100 } }),
      () => api.get('/admin/locations', { params: { page: 1, limit: 100 } }),
      () => api.get('/admin/parking/locations', { params: { page: 1, limit: 100 } }),
      () => api.get('/admin/parking-locations', { params: { page: 1, limit: 100 } }),
      () => api.get('/admin/parking', { params: { page: 1, limit: 100 } }),
      () => api.get('/locations', { params: { page: 1, limit: 100 } }),
      () => api.get('/parking-locations', { params: { page: 1, limit: 100 } }),
      () => api.get('/parking', { params: { page: 1, limit: 100 } }),
      () => api.get('/parking/locations', { params: { page: 1, limit: 100 } }),
    ]);
    return normalizeLocations(response.data);
  },

  approveLocation: async (locationId) => {
    const response = await api.patch(`/admin/parking/${locationId}/approve`);
    return extractPayload(response.data);
  },

  rejectLocation: async (locationId) => {
    const response = await api.patch(`/admin/parking/${locationId}/reject`);
    return extractPayload(response.data);
  },

  getAllBookings: async () => {
    const response = await api.get('/admin/bookings', { params: { page: 1, limit: 100 } });
    const data = extractPayload(response.data);
    return Array.isArray(data?.bookings) ? data.bookings : data;
  },

  suspendUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/suspend`);
    return extractPayload(response.data);
  },

  suspendLocation: async (locationId) => {
    const response = await api.patch(`/admin/parking/${locationId}/suspend`);
    return extractPayload(response.data);
  },
};
