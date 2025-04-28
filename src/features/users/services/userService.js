import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

export function getAllUsers() {
  return apiRequest(
    () => axiosInstance.get('/users/list'),
    'Error occurred while getting the users.'
  );
}

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
