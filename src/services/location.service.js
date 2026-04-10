import api from './api';
import {
  extractPayload,
  normalizeImages,
  normalizeLocation,
  normalizeLocations,
  normalizeReviews,
  normalizeSlots,
} from '@/lib/parking';

export const locationService = {
  getAllLocations: async ({ city, page = 1, limit = 50 } = {}) => {
    const response = await api.get('/parking/locations', {
      params: { city, page, limit },
    });
    return normalizeLocations(response.data);
  },

  getMyLocations: async () => {
    const response = await api.get('/parking/locations/my');
    return normalizeLocations(response.data);
  },

  getNearbyLocations: async ({ lat, lng, radius = 10, city, type, page = 1, limit = 20 }) => {
    const response = await api.get('/parking/locations/nearby', {
      params: { lat, lng, radius, city, type, page, limit }
    });
    return normalizeLocations(response.data);
  },

  searchLocations: async ({ query, page = 1, limit = 20 } = {}) => {
    const response = await api.get('/parking/locations/search', {
      params: { query, page, limit },
    });
    return normalizeLocations(response.data);
  },

  getLocationById: async (id) => {
    const response = await api.get(`/parking/locations/${id}`);
    return normalizeLocation(extractPayload(response.data));
  },

  createLocation: async (payload) => {
    const response = await api.post('/parking/locations', payload);
    return normalizeLocation(extractPayload(response.data));
  },

  updateLocation: async (locationId, payload) => {
    const response = await api.put(`/parking/locations/${locationId}`, payload);
    return normalizeLocation(extractPayload(response.data));
  },

  deleteLocation: async (locationId) => {
    const response = await api.delete(`/parking/locations/${locationId}`);
    return extractPayload(response.data);
  },

  uploadLocationImage: async (locationId, file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/parking/locations/${locationId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return extractPayload(response.data);
  },

  getLocationDetails: async (id) => {
    const [location, slots, reviews, images] = await Promise.allSettled([
      locationService.getLocationById(id),
      locationService.getLocationSlots(id),
      locationService.getLocationReviews(id),
      locationService.getLocationImages(id),
    ]);

    const baseLocation =
      location.status === 'fulfilled' ? location.value : normalizeLocation({ id });

    return {
      ...baseLocation,
      slots: slots.status === 'fulfilled' ? slots.value : [],
      reviews: reviews.status === 'fulfilled' ? reviews.value : baseLocation.reviews,
      images: images.status === 'fulfilled' ? images.value : baseLocation.images,
    };
  },

  getLocationSlots: async (locationId) => {
    const response = await api.get(`/parking/locations/${locationId}/slots`);
    return normalizeSlots(response.data);
  },

  getLocationReviews: async (locationId, { page = 1, limit = 10 } = {}) => {
    const response = await api.get(`/parking/locations/${locationId}/reviews`, {
      params: { page, limit },
    });
    return normalizeReviews(response.data);
  },

  getLocationImages: async (locationId) => {
    const response = await api.get(`/parking/locations/${locationId}/images`);
    return normalizeImages(response.data);
  },
};
