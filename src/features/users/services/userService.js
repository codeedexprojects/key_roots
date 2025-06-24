import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

const mockUsers = [
  {
    id: 1,
    name: 'Aarav Sharma',
    mobile: '+91-9876543210',
    email: 'aarav.sharma@example.com',
    district: 'Palakkad',
    place: 'Mumbai, Maharashtra',
    is_active: true,
  },
  {
    id: 2,
    name: 'Priya Patel',
    mobile: '+91-8765432109',
    email: 'priya.patel@example.com',
    district: 'Ernakulam',
    place: 'Mumbai, Maharashtra',
    is_active: false,
  },
  {
    id: 3,
    name: 'Vikram Singh',
    mobile: '+91-7654321098',
    email: null,
    district: 'Thrissur',
    place: 'Bengaluru, Karnataka',
    is_active: true,
  },
  {
    id: 4,
    name: 'Ananya Gupta',
    mobile: null,
    email: 'ananya.gupta@example.com',
    district: 'Thrissur',
    place: 'Bengaluru, Karnataka',
    is_active: true,
  },
  {
    id: 5,
    name: 'Rohan Desai',
    mobile: '+91-6543210987',
    email: 'rohan.desai@example.com',
    district: 'Thrissur',
    place: 'Bengaluru, Karnataka',
    is_active: false,
  },
];

// Function to get all users
export const getAllUsers = async () => {
  // return { users: mockUsers };
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
    () => axiosInstance.post('/admin/create-user/', userData),
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
