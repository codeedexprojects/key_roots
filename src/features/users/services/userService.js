import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Function to get all users
export const getAllUsers = async () => {
  return apiRequest(
    () =>
      axiosInstance.get('https://keyroute.pythonanywhere.com/api/admin/users/'),
    'Error occurred while getting the users.'
  );
};

// Function to get user details by ID
export const getUserById = async (userId) => {
  return apiRequest(
    () =>
      axiosInstance.get(
        `https://keyroute.pythonanywhere.com/api/admin/user/${userId}/`
      ),
    `Error occurred while getting user with ID ${userId}.`
  );
};

// Function to create a new user
export const createUser = async (userData) => {
  return apiRequest(
    () =>
      axiosInstance.post(
        'https://keyroute.pythonanywhere.com/api/admin/create-user/',
        userData
      ),
    'Error occurred while creating user.'
  );
};
