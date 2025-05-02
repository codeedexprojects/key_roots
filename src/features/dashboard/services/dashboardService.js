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
export const getTopVendors = async () => {
  return apiRequest(
    () =>
      axiosInstance.get(
        'https://keyroute.pythonanywhere.com/api/admin/top-vendors/'
      ),
    'Error occurred while fetching top vendors.'
  );
};

// Function to get recent users
export const getRecentUsers = async () => {
  return apiRequest(
    () =>
      axiosInstance.get(
        'https://keyroute.pythonanywhere.com/api/admin/recent-users/'
      ),
    'Error occurred while fetching recent users.'
  );
};

// Function to get recent approved bookings
export const getRecentApprovedBookings = async (limit = 5) => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/bookings/recent/?limit=${limit}`
      ),
    'Error occurred while fetching recent bookings.'
  );
};

// Function to get recent reviews
export const getRecentReviews = async (limit = 5) => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/reviews/recent/?limit=${limit}`
      ),
    'Error occurred while fetching recent reviews.'
  );
};
