import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getUserById } from '../services/userService';
import { useToast } from '@/components/ui/toast-provider';

export const UserDetailsPage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('bookings');
  const { addToast } = useToast();

  // State for API data
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  console.log(user);
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await getUserById(userId);

        if (response && !response.error) {
          // Transform user data
          const userData = {
            id: userId,
            name: response.personal_info?.name || 'Unknown',
            userId: userId,
            phone: response.personal_info?.phone_number || 'Not available',
            email: response.personal_info?.email || 'Not available',
            location: response.personal_info?.location || 'Not available',
            address: response.personal_info?.address || 'Not available',
            totalBookings: response.total_booking_count || 0,
            totalRewards: response.rewards_count || 0,
          };

          setUser(userData);

          // Set bookings data
          if (response.bookings && Array.isArray(response.bookings)) {
            const transformedBookings = response.bookings.map((booking) => ({
              date: booking.date || 'N/A',
              item: booking.package_name || 'Package',
              orderId: `#${booking.id || '000000'}`,
              total: booking.amount ? `₹${booking.amount}` : '₹0',
              status: booking.status || 'Pending',
            }));
            setBookings(transformedBookings);
          } else {
            setBookings([]);
          }
        } else {
          setError(response?.message || 'Failed to load user details');
          addToast({
            title: 'Error',
            message: response?.message || 'Failed to load user details',
            type: 'error',
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details. Please try again later.');
        addToast({
          title: 'Error',
          message: 'Failed to load user details. Please try again later.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, addToast]);

  // Sample rewards data (we'll keep this for now as a fallback)

  // Sample rewards data
  const rewards = [
    {
      date: '12 Dec 2023',
      option: 'First time Booking',
      referId: '#302011',
      reward: '$300.00',
      status: 'Withdraw',
    },
    {
      date: '12 Dec 2023',
      option: 'Invite Friend',
      referId: '#302011',
      reward: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      option: 'Booking',
      referId: '#302011',
      reward: '$121.00',
      status: 'Pending',
    },
    {
      date: '12 Dec 2023',
      option: 'Booking',
      referId: '#302011',
      reward: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      option: 'Booking',
      referId: '#302011',
      reward: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      option: 'Booking',
      referId: '#302011',
      reward: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      option: 'Booking',
      referId: '#302011',
      reward: '$121.00',
      status: 'Pending',
    },
    {
      date: '12 Dec 2023',
      option: 'Booking',
      referId: '#302011',
      reward: '$121.00',
      status: 'Pending',
    },
    {
      date: '12 Dec 2023',
      option: 'Booking',
      referId: '#302011',
      reward: '$121.00',
      status: 'Pending',
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      case 'withdraw':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className='min-h-screen'>
      <div className='mb-6 flex item-center justify-between'>
        <h1 className='text-2xl font-semibold'>User Details</h1>

        <Link
          to='/users'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Go Back</span>
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center min-h-[500px]'>
          <LoadingSpinner size='large' />
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center'>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : !user ? (
        <EmptyState
          title='User not found'
          description='The requested user could not be found.'
          icon='default'
        />
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='bg-white rounded-md shadow-sm p-6'>
            <div className='flex flex-col items-center mb-6'>
              <img
                src='https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
                alt={user.name}
                className='w-24 h-24 rounded-md bg-gray-200 object-cover mb-4'
              />
              <h2 className='text-xl font-semibold'>{user.name}</h2>
              <p className='text-gray-500 text-sm'>ID-{user.userId}</p>
              <p className='text-gray-500 text-sm mt-1'>{user.location}</p>
            </div>

            <div className='border-t pt-4 space-y-4'>
              <h3 className='font-semibold text-lg mb-2'>
                Personal Information
              </h3>
              {[
                { label: 'User Name', value: user.name },
                { label: 'Phone Number', value: user.phone },
                { label: 'Email ID', value: user.email },
                { label: 'Location', value: user.location },
                { label: 'Address', value: user.address },
              ].map((item) => (
                <div key={item.label}>
                  <p className='text-gray-500 text-sm'>{item.label}</p>
                  <p className='font-medium'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='lg:col-span-2 space-y-6'>
            <div className='flex justify-end gap-2'>
              <button className='px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50'>
                Action
              </button>
              <button className='px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50'>
                Export PDF
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                {
                  label: 'Total Bookings',
                  value: user.totalBookings,
                },
                {
                  label: 'Rewards',
                  value: user.totalRewards,
                },
              ].map(({ label, value }) => (
                <div
                  className='bg-white p-4 rounded-md shadow-sm'
                  key={`${label}-${value}`}>
                  <div className='flex items-center gap-2'>
                    <div className='h-5 w-5 text-gray-500'>📄</div>
                    <h3 className='text-gray-600 text-sm'>{label}</h3>
                  </div>
                  <div className='mt-2 flex items-baseline'>
                    <p className='text-2xl font-semibold'>{value}</p>
                    <span className='ml-2 text-xs text-green-500'>+0%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className='bg-white rounded-md shadow-sm'>
              <div className='border-b flex'>
                {['bookings', 'rewards'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {tab === 'bookings' ? 'Total Booking' : 'Total Rewards'}
                  </button>
                ))}
              </div>

              <div className='p-4'>
                {/* Filters */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4'>
                  <input
                    type='text'
                    placeholder='Search...'
                    className='pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm w-full md:w-64 relative'
                  />
                  <div className='flex gap-2'>
                    {['Sort by: Newest', 'Filter by: State'].map((text) => (
                      <button
                        key={text}
                        className='flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm'>
                        <span>{text}</span>
                        <span>🔽</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                {activeTab === 'bookings' ? (
                  bookings.length === 0 ? (
                    <EmptyState
                      title='No bookings found'
                      description='This user has no bookings yet.'
                      icon='default'
                    />
                  ) : (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                          <tr>
                            {[
                              'Date',
                              'Item',
                              'Order ID',
                              'Total',
                              'Status',
                            ].map((header) => (
                              <th
                                key={header}
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {bookings.map((row, i) => (
                            <tr
                              key={i}
                              className='hover:bg-gray-50'>
                              {Object.values(row).map((cell, j) => (
                                <td
                                  key={j}
                                  className={`px-4 py-4 whitespace-nowrap text-sm ${
                                    j === 4
                                      ? getStatusColor(cell)
                                      : 'text-gray-500'
                                  }`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  <EmptyState
                    title='No rewards found'
                    description='This user has no rewards yet.'
                    icon='default'
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
