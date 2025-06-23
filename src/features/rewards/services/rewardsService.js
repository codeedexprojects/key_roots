import { apiRequest } from '@/lib/apiRequest';
import { axiosInstance } from '@/lib/axiosInstance';

const mockRewards = [
  {
    id: 1,
    name: 'Ziyad',
    created_at: '2025-02-01',
    refer_id: '#00000001',
    reward_amount: '300.00',
    status: 'pending',
    status_text: 'Withdraw',
    booking_type: 'bus',
    upi_id: '58466244@axl',
  },
  {
    id: 2,
    name: 'Amal',
    created_at: '2025-01-08',
    refer_id: '#00000002',
    reward_amount: '200.00',
    status: 'completed',
    status_text: 'Completed',
    booking_type: 'refer',
    upi_id: '58466245@axl',
  },
  {
    id: 3,
    name: 'Rahul',
    created_at: '2025-01-07',
    refer_id: '#00000003',
    reward_amount: '150.00',
    status: 'pending',
    status_text: 'Pending',
    booking_type: 'refer',
    upi_id: '58466246@axl',
  },
  {
    id: 4,
    name: 'Priya',
    created_at: '2025-01-06',
    refer_id: '#00000004',
    reward_amount: '250.00',
    status: 'withdraw',
    status_text: 'Withdraw',
    booking_type: 'bus',
    upi_id: '58466247@axl',
  },
  {
    id: 5,
    name: 'Sanjay',
    created_at: '2025-01-05',
    refer_id: '#00000005',
    reward_amount: '180.00',
    status: 'pending',
    status_text: 'Pending',
    booking_type: 'refer',
    upi_id: '58466248@axl',
  },
];

export const getAllRewards = async () => {
  return apiRequest(
    () => axiosInstance.get('/rewards/'),
    'Error occurred while fetching rewards.'
  );
};

export const getRewardById = async (id) => {
  return apiRequest(
    () => axiosInstance.get(`/rewards${id}`),
    'Error occurred while fetching rewards.'
  );
};
