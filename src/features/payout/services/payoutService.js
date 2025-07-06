import { apiRequest } from '@/lib/apiRequest';
import { axiosInstance } from '@/lib/axiosInstance';

const PAYOUT_ENDPOINTS = {
  PAYOUTS: '/payout-requests/',
};

export const payoutService = {
  // Get all payouts with pagination
  getPayouts: async (page = 1) => {
    return apiRequest(
      () => axiosInstance.get(`${PAYOUT_ENDPOINTS.PAYOUTS}?page=${page}`),
      'Error fetching payouts.'
    );
  },

  // Get payout details by ID (for PDF export)
  getPayoutById: async (id) => {
    return apiRequest(
      () => axiosInstance.get(`${PAYOUT_ENDPOINTS.PAYOUTS}${id}/`),
      `Error fetching payout details for ID ${id}.`
    );
  },

  // Update payout status and remarks
  completePayout: async (payoutId, status, admin_remarks) => {
    return apiRequest(
      () =>
        axiosInstance.patch(`${PAYOUT_ENDPOINTS.PAYOUTS}${payoutId}/`, {
          status,
          admin_remarks,
        }),
      `Error updating payout for ID ${payoutId}.`
    );
  },
};
