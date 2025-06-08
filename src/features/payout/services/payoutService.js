import { apiRequest } from '../../../lib/apiRequest';

const PAYOUT_ENDPOINTS = {
  PENDING: '/api/admin/payout/unpaid-bookings/',
  COMPLETED: '/api/admin/payout/history/',
  EXPORT: '/api/admin/payout/export/',
  MARK_COMPLETED: '/api/admin/payout/mark-completed/',
};

export const payoutService = {
  // Get pending payouts
  getPendingPayouts: async (page = 1, limit = 10) => {
    try {
      const response = await apiRequest.get(
        `${PAYOUT_ENDPOINTS.PENDING}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching pending payouts:', error);
      throw error;
    }
  },

  // Get completed payouts
  getCompletedPayouts: async (page = 1, limit = 10) => {
    try {
      const response = await apiRequest.get(
        `${PAYOUT_ENDPOINTS.COMPLETED}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching completed payouts:', error);
      throw error;
    }
  },

  // Get single payout details
  getPayoutDetails: async (payoutId) => {
    try {
      const response = await apiRequest.get(
        `${PAYOUT_ENDPOINTS.PENDING}${payoutId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching payout details:', error);
      throw error;
    }
  },

  // Export payout to Excel
  exportPayoutToExcel: async (payoutId) => {
    try {
      const response = await apiRequest.post(
        `${PAYOUT_ENDPOINTS.EXPORT}${payoutId}/`,
        {},
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting payout:', error);
      throw error;
    }
  },

  // Mark payout as completed
  markPayoutCompleted: async (payoutId) => {
    try {
      const response = await apiRequest.post(
        `${PAYOUT_ENDPOINTS.MARK_COMPLETED}${payoutId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error marking payout as completed:', error);
      throw error;
    }
  },
};

// Mock data for development
export const mockPayoutData = {
  pending: [
    {
      id: 1,
      vendorName: 'Shafeek ali',
      emailId: 'shafeek@gmail.com',
      phoneNumber: '9995986574',
      ifscCode: 'ICIC0005965',
      payoutMode: 'Account',
      payoutAmount: 23500,
      adminCommission: 2500,
      category: 'Bus',
      bookingDate: '2024-01-15',
      bookingId: 'BK001',
      vendorId: 'V001',
    },
    {
      id: 2,
      vendorName: 'Rajesh Kumar',
      emailId: 'rajesh@gmail.com',
      phoneNumber: '9876543210',
      ifscCode: 'HDFC0001234',
      payoutMode: 'UPI',
      payoutAmount: 15000,
      adminCommission: 1500,
      category: 'Package',
      bookingDate: '2024-01-16',
      bookingId: 'BK002',
      vendorId: 'V002',
    },
  ],
  completed: [
    {
      id: 3,
      vendorName: 'Priya Sharma',
      emailId: 'priya@gmail.com',
      phoneNumber: '9123456789',
      ifscCode: 'SBI0001111',
      payoutMode: 'Account',
      payoutAmount: 18000,
      adminCommission: 1800,
      category: 'Bus',
      bookingDate: '2024-01-10',
      bookingId: 'BK003',
      vendorId: 'V003',
      completedDate: '2024-01-17',
    },
  ],
};
