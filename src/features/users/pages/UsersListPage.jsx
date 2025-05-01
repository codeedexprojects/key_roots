import { useState, useEffect } from 'react';
import { Search, ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getAllUsers } from '../services/userService';
import { useToast } from '@/components/ui/toast-provider';

export const UsersListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // State for API data
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    total_users: 0,
    booked_users_count: 0,
    active_users_count: 0,
    inactive_users_count: 0,
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();

        if (response && !response.error) {
          // Set users data
          setUsers(response.users || []);

          // Set user stats
          setUserStats({
            total_users: response.total_users || 0,
            booked_users_count: response.booked_users_count || 0,
            active_users_count: response.active_users_count || 0,
            inactive_users_count: response.inactive_users_count || 0,
          });
        } else {
          setError(response?.message || 'Failed to load users');
          addToast({
            title: 'Error',
            message: response?.message || 'Failed to load users',
            type: 'error',
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
        addToast({
          title: 'Error',
          message: 'Failed to load users. Please try again later.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [addToast]);

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>Total Users</h1>
        <Link
          to='/users/create'
          className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          <Plus className='h-4 w-4 mr-2' />
          Add User
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center min-h-[100px]'>
          <LoadingSpinner size='medium' />
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {[
            {
              label: 'Total Users',
              value: userStats.total_users,
              change: '+0%',
              color: 'green',
            },
            {
              label: 'Booked Users',
              value: userStats.booked_users_count,
              change: '+0%',
              color: 'green',
            },
            {
              label: 'Active Users',
              value: userStats.active_users_count,
              change: '+0%',
              color: 'green',
            },
            {
              label: 'Inactive Users',
              value: userStats.inactive_users_count,
              change: '+0%',
              color: 'red',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className='bg-white p-4 rounded-md shadow-sm'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-gray-500 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                <h3 className='text-gray-600 text-sm'>{stat.label}</h3>
              </div>
              <div className='mt-2 flex items-baseline'>
                <p className='text-2xl font-semibold'>{stat.value}</p>
                <span className={`ml-2 text-xs text-${stat.color}-500`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='bg-white rounded-md shadow-sm p-4'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4'>
          <h2 className='text-lg font-semibold'>Total Users</h2>
          <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto'>
            <div className='relative w-full md:w-64'>
              <input
                type='text'
                placeholder='Search Users'
                className='pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm w-full'
              />
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
            </div>
            <div className='flex gap-2'>
              <button className='flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'>
                <span>Sort by: Newest</span>
                <ChevronDown className='h-4 w-4' />
              </button>
              <button className='flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'>
                <span>Filter by: State</span>
                <ChevronDown className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center min-h-[100px]'>
            <LoadingSpinner size='medium' />
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            title='No users found'
            description='There are no users to display.'
            icon='default'
          />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  {[
                    'Customer',
                    'Phone Number',
                    'Email',
                    'Place',
                    'Status',
                    'Action',
                  ].map((header, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        header === 'Email' ? 'hidden md:table-cell' : ''
                      }`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className='hover:bg-gray-50 cursor-pointer'
                    onClick={() => navigate(`/users/${user.id}`)}>
                    <td className='px-4 py-4'>
                      <div className='flex items-center'>
                        <img
                          className='h-10 w-10 rounded-md'
                          src='https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
                          alt=''
                        />
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500'>
                      {user.mobile}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500 hidden md:table-cell'>
                      {user.email}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500'>
                      {user.place || 'Not specified'}
                    </td>
                    <td className='px-4 py-4'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className='px-4 py-4 text-right text-sm font-medium'>
                      <MoreHorizontal className='h-5 w-5 text-gray-400 hover:text-gray-500' />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className='flex justify-between items-center border-t border-gray-200 px-4 py-3 mt-4'>
          <p className='text-sm text-gray-700'>Page {currentPage} of 10</p>
          <div className='flex space-x-2'>
            {[1, 2, 3, '...', 10].map((page, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() =>
                  typeof page === 'number' && setCurrentPage(page)
                }>
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
