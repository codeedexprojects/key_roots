import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Function to get dashboard counts (vendors, users, bookings)
export const getDashboardCounts = async () => {
  return apiRequest(
    () =>
      axiosInstance.get(
        'https://keyroute.pythonanywhere.com/api/admin/dashbord-count'
      ),
    'Error occurred while fetching dashboard counts.'
  );
};

// Function to get top vendors
export const getTopVendors = async (state = '') => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/top-vendors/${
          state ? `?state=${state}` : ''
        }`
      ),
    'Error occurred while fetching top vendors.'
  );
};

// Function to get recent users
export const getRecentUsers = async (state = '') => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/recent-users/${
          state ? `?state=${state}` : ''
        }`
      ),
    'Error occurred while fetching recent users.'
  );
};

// Function to get recent approved bookings
export const getRecentApprovedBookings = async (state = '') => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/recent-approved-booking${
          state ? `?state=${state}` : ''
        }`
      ),
    'Error occurred while fetching recent approved bookings.'
  );
};

// Function to get recent reviews
export const getRecentReviews = async (limit = 5, state = '') => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/reviews/recent/?limit=${limit}${
          state ? `&state=${state}` : ''
        }`
      ),
    'Error occurred while fetching recent reviews.'
  );
};

// Function to get revenue data
export const getRevenueData = async () => {
  return apiRequest(
    () =>
      axiosInstance.get(
        'https://keyroute.pythonanywhere.com/api/admin/dashboard/revenu'
      ),
    'Error occurred while fetching revenue data.'
  );
};
