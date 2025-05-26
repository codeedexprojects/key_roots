import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

/**
 * Function to get all reviews (bus, package, and app reviews)
 * @returns {Promise} Promise that resolves to the reviews data
 */
export const getAllReviews = async () => {
  return apiRequest(
    () => axiosInstance.get('/reviews/all/'),
    'Error occurred while fetching reviews.'
  );
};
