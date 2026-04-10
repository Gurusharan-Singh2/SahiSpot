import api from './api';
import { extractPayload, normalizeBooking, normalizeBookings } from '@/lib/parking';

export const bookingService = {
  createBooking: async (bookingData) => {
    const payload = {
      location_id: Number(bookingData.location_id ?? bookingData.locationId),
      slot_type_id: Number(bookingData.slot_type_id ?? bookingData.slotTypeId),
      vehicle_type: bookingData.vehicle_type ?? bookingData.vehicleType,
      duration_type: bookingData.duration_type ?? bookingData.durationType,
      total_hours:
        bookingData.duration_type === 'hour' || bookingData.durationType === 'hour'
          ? Number(bookingData.total_hours ?? bookingData.totalHours ?? 1)
          : undefined,
      start_time: bookingData.start_time ?? bookingData.startTime,
      end_time: bookingData.end_time ?? bookingData.endTime,
    };

    const response = await api.post('/parking/bookings', payload);
    return normalizeBooking(extractPayload(response.data));
  },

  getUserBookings: async ({ page = 1, limit = 10 } = {}) => {
    const response = await api.get('/parking/bookings/my', {
      params: { page, limit },
    });

    return normalizeBookings(response.data);
  },

  extendBooking: async (bookingId, extraHours) => {
    const response = await api.post(`/parking/bookings/${bookingId}/extend`, {
      extra_hours: extraHours,
    });
    return normalizeBooking(extractPayload(response.data));
  },

  checkoutBooking: async (bookingId) => {
    const response = await api.post(`/parking/bookings/${bookingId}/checkout`);
    return normalizeBooking(extractPayload(response.data));
  },
};

