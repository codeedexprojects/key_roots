import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Function to get vendor count
export const getVendorCount = async () => {
  return apiRequest(
    () =>
      axiosInstance.get(
        'https://keyroute.pythonanywhere.com/api/admin/vendor/count/'
      ),
    'Error occurred while fetching vendor count.'
  );
};

// Function to get user count
export const getUserCount = async () => {
  return apiRequest(
    () =>
      axiosInstance.get(
        'https://keyroute.pythonanywhere.com/api/admin/user/count/'
      ),
    'Error occurred while fetching user count.'
  );
};

// Function to get top vendors
export const getTopVendors = async (limit = 5) => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/vendors/list/?limit=${limit}`
      ),
    'Error occurred while fetching top vendors.'
  );
};

// Function to get recent users
export const getRecentUsers = async (limit = 5) => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/users/list/?limit=${limit}`
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
