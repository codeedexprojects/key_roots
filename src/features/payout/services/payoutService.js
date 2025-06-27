import { apiRequest } from '../../../lib/apiRequest';
import { axiosInstance } from '@/lib/axiosInstance';

const PAYOUT_ENDPOINTS = {
  PENDING: '/payout/unpaid-bookings/',
  COMPLETED: '/payout/history/',
  MARK_COMPLETED: '/payout/create/',
};

export const payoutService = {
  // Get pending payouts
  getPendingPayouts: async () => {
    return apiRequest(
      () => axiosInstance.get(PAYOUT_ENDPOINTS.PENDING),
      'Error getting pending payouts.'
    );
  },

  // Get completed payouts
  getCompletedPayouts: async () => {
    return apiRequest(
      () => axiosInstance.get(`${PAYOUT_ENDPOINTS.COMPLETED}`),
      'Error fetching completed payouts.'
    );
  },

  // Get single payout details
  getPayoutDetails: async (payoutId) => {
    return apiRequest(
      () => axiosInstance.get(`${PAYOUT_ENDPOINTS.PENDING}${payoutId}/`),
      'Error fetching payout details.'
    );
  },

  // Mark payout as completed
  markPayoutCompleted: async (payload) => {
    return apiRequest(
      () => axiosInstance.post(`${PAYOUT_ENDPOINTS.MARK_COMPLETED}`, payload),
      'Error marking payout as completed.'
    );
  },
};
