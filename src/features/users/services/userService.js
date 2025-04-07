import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

export function getAllUsers() {
  return apiRequest(
    () => axiosInstance.get('/users/list'),
    'Error occurred while getting the users.'
  );
}
