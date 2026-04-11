import api from './api';
import { extractPayload } from '@/lib/parking';

export const paymentService = {
  createOrder: async (bookingId) => {
    const response = await api.post('/parking/payments/order', { booking_id: Number(bookingId) });
    return extractPayload(response.data);
  },

  verifyPayment: async (verificationData) => {
    const response = await api.post('/parking/payments/verify', verificationData);
    return extractPayload(response.data);
  },

  failPayment: async (bookingId) => {
    const response = await api.post('/payments/fail', { booking_id: Number(bookingId) });
    return extractPayload(response.data);
  }
};
