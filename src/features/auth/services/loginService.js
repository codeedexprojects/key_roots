import { apiRequest } from '@/lib/apiRequest';
import axios from 'axios';

export const loginAdmin = async (credentials) => {
  return apiRequest(
    () =>
      axios.post(
        'https://api.keyrouteexpedo.com/api/admin/login/',
        credentials
      ),
    'Login failed. Please check your email and password.'
  );
};
