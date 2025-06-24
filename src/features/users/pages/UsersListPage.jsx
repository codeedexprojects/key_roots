import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAllUsers, toggleUserStatus } from '../services/userService';
import { useNavigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { LoadingSpinner, EmptyState } from '@/components/common';

export const UsersListPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [filterState, setFilterState] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
  const [togglingUserId, setTogglingUserId] = useState(null);

  // Fetch users data
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers();

      if (response && !response.error) {
        setUsers(response.users || []);
        setUserStats({
          total_users: response.total_users || 0,
          booked_users_count: response.booked_users_count || 0,
          active_users_count: response.active_users_count || 0,
          inactive_users_count: response.inactive_users_count || 0,
        });
      } else {
        setError(response?.message || 'Failed to load users');
        toast.error(response?.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
      toast.error('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset district filter when state filter or sorting changes
  useEffect(() => {
    if (filterState === 'all' && sortBy !== 'place') {
      setFilterDistrict('all');
    }
  }, [filterState, sortBy]);

  // Toggle user status function
  const handleToggleUserStatus = async (userId, currentStatus, event) => {
    event.stopPropagation();

    setTogglingUserId(userId);
    try {
      const response = await toggleUserStatus(userId);

      if (response && !response.error) {
        toast.success(
          response.message ||
            `User has been ${
              response.is_active ? 'unblocked' : 'blocked'
            } successfully.`
        );
        await fetchUsers();
      } else {
        toast.error(response?.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status. Please try again.');
    } finally {
      setTogglingUserId(null);
    }
  };

  let processedUsers = [...users];

  if (searchTerm.trim() !== '') {
    processedUsers = processedUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm)
    );
  }

  // Filtering by state
  if (filterState !== 'all') {
    processedUsers = processedUsers.filter(
      (user) => user.place === filterState
    );
  }

  // Filtering by district
  if (
    filterDistrict !== 'all' &&
    (filterState !== 'all' || sortBy === 'place')
  ) {
    processedUsers = processedUsers.filter(
      (user) => user.district === filterDistrict
    );
  }

  // Sorting
  processedUsers.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'place') return (a.place || '').localeCompare(b.place || '');
    if (sortBy === 'status') return b.is_active - a.is_active;
    return 0;
  });

  // Pagination
  const usersPerPage = 8;
  const totalPages = Math.ceil(processedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = processedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Get unique districts for the selected state or all districts if sorted by place
  const availableDistricts = Array.from(
    new Set(
      users
        .filter((user) =>
          filterState !== 'all'
            ? user.place === filterState
            : sortBy === 'place'
        )
        .map((user) => user.district)
        .filter(Boolean)
    )
  ).sort();

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
            },
            {
              label: 'Booked Users',
              value: userStats.booked_users_count,
            },
            {
              label: 'Active Users',
              value: userStats.active_users_count,
            },
            {
              label: 'Inactive Users',
              value: userStats.inactive_users_count,
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
            </div>
            <div className='flex gap-2'>
              <select
                className='appearance-none pl-4 pr-10 py-2 border rounded-md text-sm'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value='name'>Sort by: Name</option>
                <option value='place'>Sort by: Place</option>
                <option value='status'>Sort by: Status</option>
              </select>

              {/* State Filter Dropdown */}
              <select
                className='appearance-none pl-4 pr-10 py-2 border rounded-md text-sm'
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}>
                <option value='all'>Filter by: All States</option>
                {Array.from(
                  new Set(users.map((u) => u.place).filter(Boolean))
                ).map((state) => (
                  <option
                    key={state}
                    value={state}>
                    {state}
                  </option>
                ))}
              </select>

              {/* District Filter Dropdown (Conditional) */}
              {(filterState !== 'all' || sortBy === 'place') &&
                availableDistricts.length > 0 && (
                  <select
                    className='appearance-none pl-4 pr-10 py-2 border rounded-md text-sm'
                    value={filterDistrict}
                    onChange={(e) => setFilterDistrict(e.target.value)}>
                    <option value='all'>Filter by: All Districts</option>
                    {availableDistricts.map((district) => (
                      <option
                        key={district}
                        value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                )}
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
        ) : processedUsers.length === 0 ? (
          <EmptyState
            title='No users found'
            description='There are no users to display.'
            icon='default'
          />
        ) : (
          <div className='overflow-x-auto min-h-[400px] no-scrollbar'>
            <table className='min-w-full lg:table-fixed divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-12'>
                    ID
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-44'>
                    Customer
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-36'>
                    Phone Number
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-48 hidden md:table-cell'>
                    Email
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-36'>
                    State
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-36'>
                    District
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-28'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-28'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-gray-200'>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className='hover:bg-gray-50 cursor-pointer'
                    onClick={() => navigate(`/users/${user.id}`)}>
                    <td className='px-4 py-4 text-sm text-gray-500 w-auto lg:w-12 truncate'>
                      {user.id}
                    </td>
                    <td className='px-4 py-4 w-auto lg:w-44 truncate'>
                      <div className='flex items-center'>
                        <img
                          className='h-10 w-10 rounded-md flex-shrink-0'
                          src='https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
                          alt=''
                        />
                        <div className='ml-4 w-full'>
                          <div
                            className='text-sm font-medium text-gray-900 truncate'
                            title={user.name}>
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className='px-4 py-4 text-sm text-gray-500 truncate w-auto lg:w-36'
                      title={user.mobile}>
                      {user.mobile || 'Not specified'}
                    </td>
                    <td
                      className='px-4 py-4 text-sm text-gray-500 truncate hidden md:table-cell w-auto lg:w-48'
                      title={user.email}>
                      {user.email || 'Not specified'}
                    </td>
                    <td
                      className='px-4 py-4 text-sm text-gray-500 truncate w-auto lg:w-36'
                      title={user.place}>
                      {user.place || 'Not specified'}
                    </td>
                    <td
                      className='px-4 py-4 text-sm text-gray-500 truncate w-auto lg:w-36'
                      title={user.district}>
                      {user.district || 'Not specified'}
                    </td>
                    <td className='px-4 py-4 w-auto lg:w-28'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className='px-4 py-4 w-auto lg:w-28'>
                      <button
                        onClick={(e) =>
                          handleToggleUserStatus(user.id, user.is_active, e)
                        }
                        disabled={togglingUserId === user.id}
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          user.is_active
                            ? 'border-red-500 text-red-500 hover:bg-red-50'
                            : 'border-green-500 text-green-500 hover:bg-green-50'
                        }`}>
                        {togglingUserId === user.id ? (
                          <LoadingSpinner size='small' />
                        ) : (
                          <>
                            {user.is_active ? (
                              <ShieldOff className='h-3 w-3 mr-1' />
                            ) : (
                              <Shield className='h-3 w-3 mr-1' />
                            )}
                            {user.is_active ? 'Block' : 'Unblock'}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {processedUsers.length > 0 && (
          <div className='flex justify-between items-center border-t border-gray-200 px-4 py-3 mt-4'>
            <p className='text-sm text-gray-700'>
              Showing {indexOfFirstUser + 1}–
              {Math.min(indexOfLastUser, processedUsers.length)} of{' '}
              {processedUsers.length} users
            </p>

            <div className='flex items-center space-x-2'>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <ChevronLeft className='h-5 w-5' />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <ChevronRight className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
