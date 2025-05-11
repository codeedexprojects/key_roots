import { apiRequest } from '@/lib/apiRequest';
import axios from 'axios';

export const loginAdmin = async (credentials) => {
  return apiRequest(
    () =>
      axios.post(
        'https://keyroute.pythonanywhere.com/api/admin/login/',
        credentials
      ),
    'Login failed. Please check your email and password.'
  );
};
