import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Function to get all users
export const getAllUsers = async () => {
  return apiRequest(
    () => axiosInstance.get('/users/'),
    'Error occurred while getting the users.'
  );
};

// Function to get user details by ID
export const getUserById = async (userId) => {
  return apiRequest(
    () => axiosInstance.get(`/user/${userId}/`),
    `Error occurred while getting user with ID ${userId}.`
  );
};

// Function to create a new user
export const createUser = async (userData) => {
  return apiRequest(
    () => axiosInstance.post('/create-user/', userData),
    'Error occurred while creating user.'
  );
};

// Function to toggle user status (block/unblock)
export const toggleUserStatus = async (userId) => {
  return apiRequest(
    () => axiosInstance.post(`/users/${userId}/toggle-status/`),
    `Error occurred while toggling status for user with ID ${userId}.`
  );
};
