import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

export const getDashboardCounts = async () => {
  return apiRequest(
    () => axiosInstance.get('/dashbord-count'),
    'Error occurred while fetching dashboard counts.'
  );
};

export const getTopVendors = async () => {
  return apiRequest(
    () => axiosInstance.get(`/top-vendors/`),
    'Error occurred while fetching top vendors.'
  );
};

export const getRecentUsers = async () => {
  return apiRequest(
    () => axiosInstance.get(`/recent-users/`),
    'Error occurred while fetching recent users.'
  );
};

export const getRecentApprovedBookings = async () => {
  return apiRequest(
    () => axiosInstance.get(`/recent-approved-booking`),
    'Error occurred while fetching recent approved bookings.'
  );
};

export const getRecentReviews = async (limit = 5) => {
  return apiRequest(
    () => axiosInstance.get(`/recent-reviews/`),
    'Error occurred while fetching recent reviews.'
  );
};

export const getRevenueData = async () => {
  return apiRequest(
    () => axiosInstance.get('/dashboard/revenu'),
    'Error occurred while fetching revenue data.'
  );
};
