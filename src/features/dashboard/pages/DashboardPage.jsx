import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Star, ArrowRight } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { Link } from 'react-router';
import {
  getDashboardCounts,
  getTopVendors,
  getRecentUsers,
} from '../services/dashboardService';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('12 Months');

  // State for API data
  const [dashboardCounts, setDashboardCounts] = useState({
    total_vendors: null,
    total_users: null,
    total_bookings: null,
    today_bookings: null,
  });
  const [topVendors, setTopVendors] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // Loading states
  const [dashboardCountsLoading, setDashboardCountsLoading] = useState(true);
  const [topVendorsLoading, setTopVendorsLoading] = useState(true);
  const [recentUsersLoading, setRecentUsersLoading] = useState(true);

  // Error states
  const [dashboardCountsError, setDashboardCountsError] = useState(null);
  const [topVendorsError, setTopVendorsError] = useState(null);
  const [recentUsersError, setRecentUsersError] = useState(null);

  // Fetch dashboard counts
  useEffect(() => {
    const fetchDashboardCounts = async () => {
      setDashboardCountsLoading(true);
      try {
        const response = await getDashboardCounts();
        console.log('Dashboard counts response:', response);
        if (response && !response.error) {
          setDashboardCounts({
            total_vendors: response.total_vendors,
            total_users: response.total_users,
            total_bookings: response.total_bookings,
            today_bookings: response.today_bookings,
          });
        } else {
          setDashboardCountsError(
            response?.message || 'Failed to load dashboard counts'
          );
        }
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
        setDashboardCountsError(
          'Failed to load dashboard counts. Please try again later.'
        );
      } finally {
        setDashboardCountsLoading(false);
      }
    };

    fetchDashboardCounts();
  }, []);

  // Fetch top vendors
  useEffect(() => {
    const fetchTopVendors = async () => {
      setTopVendorsLoading(true);
      try {
        const response = await getTopVendors();
        console.log('Top vendors response:', response);
        if (response && !response.error) {
          const transformedVendors = response.map((vendor) => ({
            name: vendor.name,
            location: vendor.place,
            bookings: vendor.total_booking_count || 0,
            img: '/placeholder.svg?height=40&width=40',
          }));
          setTopVendors(transformedVendors);
        } else {
          setTopVendorsError(response?.message || 'Failed to load top vendors');
        }
      } catch (error) {
        console.error('Error fetching top vendors:', error);
        setTopVendorsError(
          'Failed to load top vendors. Please try again later.'
        );
      } finally {
        setTopVendorsLoading(false);
      }
    };

    fetchTopVendors();
  }, []);

  // Fetch recent users
  useEffect(() => {
    const fetchRecentUsers = async () => {
      setRecentUsersLoading(true);
      try {
        const response = await getRecentUsers();
        console.log('Recent users response:', response);
        if (response && !response.error) {
          const transformedUsers = response.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            joined: new Date(user.created_at).toLocaleDateString(),
            img: '/placeholder.svg?height=40&width=40',
          }));
          setRecentUsers(transformedUsers);
        } else {
          setRecentUsersError(
            response?.message || 'Failed to load recent users'
          );
        }
      } catch (error) {
        console.error('Error fetching recent users:', error);
        setRecentUsersError(
          'Failed to load recent users. Please try again later.'
        );
      } finally {
        setRecentUsersLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  // Sample data for charts
  const chartData = [
    { name: 'Jan', value1: 30, value2: 20 },
    { name: 'Feb', value1: 35, value2: 25 },
    { name: 'Mar', value1: 40, value2: 30 },
    { name: 'Apr', value1: 45, value2: 35 },
    { name: 'May', value1: 50, value2: 40 },
    { name: 'Jun', value1: 55, value2: 45 },
    { name: 'Jul', value1: 60, value2: 50 },
    { name: 'Aug', value1: 65, value2: 55 },
    { name: 'Sep', value1: 70, value2: 60 },
    { name: 'Oct', value1: 75, value2: 65 },
    { name: 'Nov', value1: 80, value2: 70 },
    { name: 'Dec', value1: 85, value2: 75 },
  ];

  // Sample approved bookings
  const approvedBookings = [
    {
      from: 'Varkala',
      to: 'Ernakulam',
      amount: '₹25000',
      time: '8:00 Am',
      date: '12/3/2025',
      type: 'Full amount paid',
    },
    {
      from: 'Varkala',
      to: 'Ernakulam',
      amount: '₹25000',
      time: '8:00 Am',
      date: '12/3/2025',
      type: 'Full amount paid',
    },
    {
      from: 'Varkala',
      to: 'Ernakulam',
      amount: '₹25000',
      time: '8:00 Am',
      date: '12/3/2025',
      type: 'Full amount paid',
    },
    {
      from: 'Varkala',
      to: 'Ernakulam',
      amount: '₹25000',
      time: '8:00 Am',
      date: '12/3/2025',
      type: 'Full amount paid',
    },
  ];

  // Sample reviews
  const reviews = [
    {
      name: 'Kaja husain',
      img: '/placeholder.svg?height=40&width=40',
      rating: 5,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Kaja husain',
      img: '/placeholder.svg?height=40&width=40',
      rating: 4,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Kaja husain',
      img: '/placeholder.svg?height=40&width=40',
      rating: 4,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Kaja husain',
      img: '/placeholder.svg?height=40&width=40',
      rating: 3,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  const tabs = ['12 Months', '6 Months', '30 Days', '7 Days'];

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Today Booking Card */}
        <div className='p-4 bg-white rounded-lg shadow-sm'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Today booking</h3>
            {dashboardCountsLoading && <LoadingSpinner size='small' />}
          </div>
          {dashboardCountsError ? (
            <div className='text-red-500 text-sm'>Error loading data</div>
          ) : (
            <>
              <div className='text-xl font-semibold'>
                {dashboardCounts.today_bookings !== null
                  ? dashboardCounts.today_bookings
                  : '-'}
              </div>
              <div className='text-green-500 text-sm'>+0%</div>
            </>
          )}
        </div>

        {/* Total Booking Card */}
        <div className='p-4 bg-white rounded-lg shadow-sm'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Total booking</h3>
            {dashboardCountsLoading && <LoadingSpinner size='small' />}
          </div>
          {dashboardCountsError ? (
            <div className='text-red-500 text-sm'>Error loading data</div>
          ) : (
            <>
              <div className='text-xl font-semibold'>
                {dashboardCounts.total_bookings !== null
                  ? dashboardCounts.total_bookings
                  : '-'}
              </div>
              <div className='text-red-500 text-sm'>+0%</div>
            </>
          )}
        </div>

        {/* Total Vendor Card */}
        <div className='p-4 bg-white rounded-lg shadow-sm'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Total vendor</h3>
            {dashboardCountsLoading && <LoadingSpinner size='small' />}
          </div>
          {dashboardCountsError ? (
            <div className='text-red-500 text-sm'>Error loading data</div>
          ) : (
            <>
              <div className='text-xl font-semibold'>
                {dashboardCounts.total_vendors !== null
                  ? dashboardCounts.total_vendors
                  : '-'}
              </div>
              <div className='text-red-500 text-sm'>+0%</div>
            </>
          )}
        </div>

        {/* Total Users Card */}
        <div className='p-4 bg-white rounded-lg shadow-sm'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Total Users</h3>
            {dashboardCountsLoading && <LoadingSpinner size='small' />}
          </div>
          {dashboardCountsError ? (
            <div className='text-red-500 text-sm'>Error loading data</div>
          ) : (
            <>
              <div className='text-xl font-semibold'>
                {dashboardCounts.total_users !== null
                  ? dashboardCounts.total_users
                  : '-'}
              </div>
              <div className='text-green-500 text-sm'>+0%</div>
            </>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 bg-white p-4 rounded-md shadow-sm'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4'>
            <h3 className='font-medium text-lg'>Total Revenue</h3>
            <div className='flex flex-wrap gap-2'>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    activeTab === tab
                      ? 'bg-primary text-white'
                      : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className='h-64'>
            <ResponsiveContainer
              width='100%'
              height='100%'>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='value1'
                  stroke='#00d38d'
                  fill='#00d38d'
                  fillOpacity={0.2}
                />
                <Area
                  type='monotone'
                  dataKey='value2'
                  stroke='#d30700'
                  fill='#d30700'
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-md p-5 overflow-y-auto max-h-80'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Recent approved</h3>
            <button className='text-[#1f81ec] text-sm'>Export PDF</button>
          </div>
          <div className='divide-y divide-gray-200'>
            {approvedBookings.map((b, i) => (
              <div
                key={i}
                className='py-3 text-sm'>
                <div className='flex justify-between'>
                  <div>
                    <div className='text-xs text-gray-500'>
                      random & A.K member
                    </div>
                    <div className='font-medium'>
                      {b.from} ————→ {b.to}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {b.date} • {b.time}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-xs text-gray-500'>{b.type}</div>
                    <div className='font-medium'>{b.amount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Top Vendors Card */}
        <div className='card bg-[#e9f7f4] border border-gray-200 rounded-md p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Top Vendors</h3>
            <Link
              to='/vendors'
              className='text-gray-500 text-sm border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-100'>
              See All
            </Link>
          </div>
          {topVendorsLoading ? (
            <div className='flex justify-center items-center min-h-[200px]'>
              <LoadingSpinner size='medium' />
            </div>
          ) : topVendorsError ? (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center'>
              <p className='text-red-600 text-sm'>{topVendorsError}</p>
            </div>
          ) : topVendors.length === 0 ? (
            <EmptyState
              title='No vendors found'
              description='There are no vendors to display.'
              icon='default'
            />
          ) : (
            <div className='space-y-4'>
              {topVendors.slice(0, 5).map((vendor, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between'>
                  <div className='flex items-center w-full'>
                    <img
                      src={vendor.img}
                      alt={vendor.name}
                      className='h-10 w-10 rounded-full bg-gray-200'
                    />
                    <div className='ml-3 flex-1'>
                      <h4 className='font-medium'>{vendor.name}</h4>
                      <p className='text-sm text-gray-500'>{vendor.location}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-500'>Total bookings</p>
                    <p className='font-medium'>{vendor.bookings}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link
            to='/vendors'
            className='mt-4 flex items-center justify-center w-full text-gray-500 text-sm hover:text-primary hover:underline'>
            <span>SEE ALL VENDORS</span>
            <ArrowRight className='h-4 w-4 ml-1' />
          </Link>
        </div>

        {/* Recent Users Card */}
        <div className='card bg-[#f7f7f7] border border-gray-200 rounded-md p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Recent Users</h3>
            <Link
              to='/users'
              className='text-gray-500 text-sm border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-100'>
              See All
            </Link>
          </div>
          {recentUsersLoading ? (
            <div className='flex justify-center items-center min-h-[200px]'>
              <LoadingSpinner size='medium' />
            </div>
          ) : recentUsersError ? (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center'>
              <p className='text-red-600 text-sm'>{recentUsersError}</p>
            </div>
          ) : recentUsers.length === 0 ? (
            <EmptyState
              title='No users found'
              description='There are no recent users to display.'
              icon='default'
            />
          ) : (
            <div className='space-y-4'>
              {recentUsers.slice(0, 5).map((user, idx) => (
                <div
                  key={user.id || idx}
                  className='flex items-center justify-between'>
                  <div className='flex items-center w-full'>
                    <img
                      src={user.img}
                      alt={user.name}
                      className='h-10 w-10 rounded-full bg-gray-200'
                    />
                    <div className='ml-3 flex-1'>
                      <h4 className='font-medium'>{user.name}</h4>
                      <p className='text-xs text-gray-500 truncate'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-500'>Joined on</p>
                    <p className='font-medium'>{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link
            to='/users'
            className='mt-4 flex items-center justify-center w-full text-gray-500 text-sm hover:text-primary hover:underline'>
            <span>SEE ALL USERS</span>
            <ArrowRight className='h-4 w-4 ml-1' />
          </Link>
        </div>

        {/* Reviews Card */}
        <div className='card bg-white border border-gray-200 rounded-md p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Reviews</h3>
            <Link
              to='/reviews'
              className='text-gray-500 text-sm border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-100'>
              See All
            </Link>
          </div>
          <div className='space-y-4'>
            {reviews.slice(0, 5).map((review, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between'>
                <div className='flex items-center w-full'>
                  <img
                    src={review.img}
                    alt={review.name}
                    className='h-10 w-10 rounded-full bg-gray-200'
                  />
                  <div className='ml-3 flex-1'>
                    <h4 className='font-medium'>{review.name}</h4>
                    <div className='flex items-center mt-1'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                      {review.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to='/reviews'
            className='mt-4 flex items-center justify-center w-full text-gray-500 text-sm hover:text-primary hover:underline'>
            <span>SEE ALL REVIEWS</span>
            <ArrowRight className='h-4 w-4 ml-1' />
          </Link>
        </div>
      </div>
    </div>
  );
}
