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
import { Star, ArrowRight, ChevronDown } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { Link } from 'react-router';
import {
  getDashboardCounts,
  getTopVendors,
  getRecentUsers,
  getRecentApprovedBookings,
  getRevenueData,
  getRecentReviews,
} from '../services/dashboardService';

export function DashboardPage() {
  // State for API data
  const [dashboardCounts, setDashboardCounts] = useState({
    total_vendors: null,
    total_users: null,
    total_bookings: null,
    today_bookings: null,
  });
  const [topVendors, setTopVendors] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentApproved, setRecentApproved] = useState([]);
  const [revenueData, setRevenueData] = useState({
    monthly_revenue: [],
    all_bookings: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(null);

  // State filter states
  const [topVendorsState, setTopVendorsState] = useState('');
  const [recentUsersState, setRecentUsersState] = useState('');
  const [recentApprovedState, setRecentApprovedState] = useState('');
  const [reviewsState, setReviewsState] = useState('');

  const [recentApprovedStates, setRecentApprovedStates] = useState([]);
  const [recentUsersStates, setRecentUsersStates] = useState([]);
  const [topVendorStates, setTopVendorStates] = useState([]);
  const [reviewsStates, setReviewsStates] = useState([]);

  // Loading states
  const [dashboardCountsLoading, setDashboardCountsLoading] = useState(true);
  const [topVendorsLoading, setTopVendorsLoading] = useState(true);
  const [recentUsersLoading, setRecentUsersLoading] = useState(true);
  const [recentApprovedLoading, setRecentApprovedLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Error states
  const [dashboardCountsError, setDashboardCountsError] = useState(null);
  const [topVendorsError, setTopVendorsError] = useState(null);
  const [recentUsersError, setRecentUsersError] = useState(null);
  const [recentApprovedError, setRecentApprovedError] = useState(null);
  const [revenueError, setRevenueError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);

  // Fetch dashboard counts
  useEffect(() => {
    const fetchDashboardCounts = async () => {
      setDashboardCountsLoading(true);
      try {
        const response = await getDashboardCounts();
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
        const response = await getTopVendors(topVendorsState);

        if (response && !response.error) {
          const transformedVendors = response.map((vendor) => ({
            name: vendor.name,
            location: vendor.place,
            bookings: vendor.total_booking_count || 0,
            img: '/placeholder.svg?height=40&width=40',
            state: vendor.state,
          }));
          setTopVendors(transformedVendors);

          const states = Array.from(
            new Set(response.map((vendor) => vendor.place))
          ).filter(Boolean);
          setTopVendorStates(['', ...states]);
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
  }, [topVendorsState]);

  // Fetch recent users
  useEffect(() => {
    const fetchRecentUsers = async () => {
      setRecentUsersLoading(true);
      try {
        const response = await getRecentUsers(recentUsersState);
        console.log('Recent users response:', response);
        if (response && !response.error) {
          const transformedUsers = response.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            joined: new Date(user.created_at).toLocaleDateString(),
            img: '/placeholder.svg?height=40&width=40',
            state: user.state,
          }));
          setRecentUsers(transformedUsers);

          const states = Array.from(
            new Set(response.map((user) => user.state))
          ).filter(Boolean);
          setRecentUsersStates(['', ...states]);
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
  }, [recentUsersState]);

  // Fetch recent approved bookings
  useEffect(() => {
    const fetchRecentApproved = async () => {
      setRecentApprovedLoading(true);
      try {
        const response = await getRecentApprovedBookings(recentApprovedState);
        console.log('Recent approved bookings response:', response.details);
        if (response && !response.error) {
          setRecentApproved(response);

          const states = Array.from(
            new Set(response.map((b) => b.state))
          ).filter(Boolean);
          setRecentApprovedStates(['', ...states]);
        } else {
          setRecentApprovedError(
            response?.message || 'Failed to load recent approved bookings'
          );
        }
      } catch (error) {
        console.error('Error fetching recent approved bookings:', error);
        setRecentApprovedError(
          'Failed to load recent approved bookings. Please try again later.'
        );
      } finally {
        setRecentApprovedLoading(false);
      }
    };

    fetchRecentApproved();
  }, [recentApprovedState]);

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      setRevenueLoading(true);
      try {
        const response = await getRevenueData();
        console.log('Revenue data response:', response);
        if (response && !response.error) {
          setRevenueData(response);
          if (response.monthly_revenue && response.monthly_revenue.length > 0) {
            setSelectedMonth(
              response.monthly_revenue[response.monthly_revenue.length - 1]
                .month
            );
          }
        } else {
          setRevenueError(response?.message || 'Failed to load revenue data');
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setRevenueError('Failed to load revenue data. Please try again later.');
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Transform revenue data for the chart
  const getChartData = () => {
    if (!revenueData.all_bookings || revenueData.all_bookings.length === 0) {
      return [];
    }

    const revenueByMonth = {};
    revenueData.all_bookings.forEach((booking) => {
      // Only consider accepted + non-cancelled
      const date = new Date(booking.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = 0;
      }
      revenueByMonth[monthKey] += booking.total_amount;
    });

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return Object.entries(revenueByMonth).map(([month, total]) => {
      const [year, monthIndex] = month.split('-');
      return {
        name: `${monthNames[parseInt(monthIndex) - 1]} ${year}`,
        month,
        revenue: total,
      };
    });
  };

  const chartData = getChartData();

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time function
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch reviews
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await getRecentReviews(5, reviewsState);
        console.log('Reviews response:', response);
        if (response && !response.error) {
          setReviews(response);

          // Extract unique states from the response
          const states = Array.from(
            new Set(response.map((review) => review.state))
          ).filter(Boolean);
          setReviewsStates(['', ...states]);
        } else {
          setReviewsError(response?.message || 'Failed to load reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsError('Failed to load reviews. Please try again later.');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [reviewsState]);

  // Filter data based on selected state
  const filteredRecentApproved = recentApprovedState
    ? recentApproved.filter((b) => b.state === recentApprovedState)
    : recentApproved;

  const filteredTopVendors = topVendorsState
    ? topVendors.filter((v) => v.location === topVendorsState)
    : topVendors;

  const filteredRecentUsers = recentUsersState
    ? recentUsers.filter((u) => u.state === recentUsersState)
    : recentUsers;

  const filteredReviews = reviewsState
    ? reviews.filter((r) => r.state === reviewsState)
    : reviews;

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
            </>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 bg-white p-4 rounded-md shadow-sm'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4'>
            <h3 className='font-medium text-lg'>Total Revenue</h3>
            <div className='flex flex-wrap gap-2'>
              {chartData.map((item) => (
                <button
                  key={item.month}
                  onClick={() => setSelectedMonth(item.month)}
                  className={`text-sm px-2 py-1 rounded-md ${
                    selectedMonth === item.month
                      ? 'bg-primary text-white'
                      : 'text-gray-500 border border-gray-300 hover:bg-gray-100'
                  }`}>
                  {item.month.split('-')[0]}-{item.month.split('-')[1]}
                </button>
              ))}
            </div>
          </div>

          {revenueLoading ? (
            <div className='flex justify-center items-center min-h-[256px]'>
              <LoadingSpinner size='medium' />
            </div>
          ) : revenueError ? (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center min-h-[256px] flex items-center justify-center'>
              <p className='text-red-600 text-sm'>{revenueError}</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className='min-h-[256px] flex items-center justify-center'>
              <EmptyState
                title='No revenue data'
                description='There is no revenue data to display.'
                icon='payout'
              />
            </div>
          ) : (
            <>
              {selectedMonth && (
                <div className='mb-4 p-3 bg-gray-50 rounded-md'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='text-sm text-gray-500'>
                        Selected Month Revenue
                      </p>
                      <p className='text-xl font-semibold'>
                        ₹
                        {chartData
                          .find((item) => item.month === selectedMonth)
                          ?.revenue.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500'>Total Bookings</p>
                      <p className='text-xl font-semibold'>
                        {
                          revenueData.all_bookings.filter((booking) =>
                            booking.created_at.startsWith(selectedMonth)
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className='h-64'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient
                        id='colorRevenue'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#00d38d'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='#00d38d'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip
                      formatter={(value) => [
                        `₹${value.toLocaleString()}`,
                        'Revenue',
                      ]}
                    />
                    <Area
                      type='monotone'
                      dataKey='revenue'
                      stroke='#00d38d'
                      fillOpacity={1}
                      fill='url(#colorRevenue)'
                      name='Revenue'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        <div className='bg-white border border-gray-200 rounded-md p-5 flex flex-col max-h-[440px]'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Recent approved</h3>
            <div className='relative'>
              <select
                value={recentApprovedState}
                onChange={(e) => setRecentApprovedState(e.target.value)}
                className='text-gray-500 text-sm border border-gray-300 px-2 py-1 pr-8 rounded-md hover:bg-gray-100 appearance-none cursor-pointer'>
                {recentApprovedStates.map((state) => (
                  <option
                    key={state}
                    value={state}>
                    {state
                      ? state.replace('_', ' ').toUpperCase()
                      : 'All States'}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />
            </div>
          </div>

          {/* Scrollable content */}
          <div className='overflow-y-auto no-scrollbar divide-y divide-gray-200 flex-1'>
            {recentApprovedLoading ? (
              <div className='flex justify-center items-center min-h-[200px]'>
                <LoadingSpinner size='medium' />
              </div>
            ) : recentApprovedError ? (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center'>
                <p className='text-red-600 text-sm'>{recentApprovedError}</p>
              </div>
            ) : filteredRecentApproved.length === 0 ? (
              <EmptyState
                title='No approved bookings'
                description='There are no recent approved bookings to display.'
                icon='default'
              />
            ) : (
              filteredRecentApproved.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className='py-3 text-sm'>
                  <div className='flex justify-between'>
                    <div>
                      <div className='text-xs text-gray-500'>
                        {booking.default_member_name} • {booking.total_members}{' '}
                        members
                      </div>
                      <div className='font-medium'>
                        {booking.from_location} ————→ {booking.to_location}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {formatDate(booking.created_at)} •{' '}
                        {formatTime(booking.created_at)}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xs text-gray-500'>
                        {booking.booking_type}
                      </div>
                      <div className='font-medium'>₹{booking.total_amount}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky footer */}
          <Link
            to='/booking'
            className='mt-4 flex items-center justify-center text-gray-500 text-sm hover:text-primary hover:underline'>
            <span>SEE ALL BOOKINGS</span>
            <ArrowRight className='h-4 w-4 ml-1' />
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Top Vendors Card */}
        <div className='card bg-[#e9f7f4] border border-gray-200 rounded-md p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Top Vendors</h3>
            <div className='relative'>
              <select
                value={topVendorsState}
                onChange={(e) => setTopVendorsState(e.target.value)}
                className='text-gray-500 text-sm border border-gray-300 px-2 py-1 pr-8 rounded-md hover:bg-gray-100 appearance-none cursor-pointer'>
                {topVendorStates.map((state) => (
                  <option
                    key={state}
                    value={state}>
                    {state
                      ? state.replace('_', ' ').toUpperCase()
                      : 'All States'}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />
            </div>
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
              {filteredTopVendors.slice(0, 5).map((vendor, idx) => (
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
            <div className='relative'>
              <select
                value={recentUsersState}
                onChange={(e) => setRecentUsersState(e.target.value)}
                className='text-gray-500 text-sm border border-gray-300 px-2 py-1 pr-8 rounded-md hover:bg-gray-100 appearance-none cursor-pointer'>
                {recentUsersStates.map((state) => (
                  <option
                    key={state}
                    value={state}>
                    {state
                      ? state.replace('_', ' ').toUpperCase()
                      : 'All States'}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />
            </div>
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
              {filteredRecentUsers.slice(0, 5).map((user, idx) => (
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
            <div className='relative'>
              <select
                value={reviewsState}
                onChange={(e) => setReviewsState(e.target.value)}
                className='text-gray-500 text-sm border border-gray-300 px-2 py-1 pr-8 rounded-md hover:bg-gray-100 appearance-none cursor-pointer'>
                {reviewsStates.map((state) => (
                  <option
                    key={state}
                    value={state}>
                    {state
                      ? state.replace('_', ' ').toUpperCase()
                      : 'All States'}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />
            </div>
          </div>
          {reviewsLoading ? (
            <div className='flex justify-center items-center min-h-[200px]'>
              <LoadingSpinner size='medium' />
            </div>
          ) : reviewsError ? (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center'>
              <p className='text-red-600 text-sm'>{reviewsError}</p>
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              title='No reviews found'
              description='There are no reviews to display.'
              icon='default'
            />
          ) : (
            <div className='space-y-4'>
              {filteredReviews.slice(0, 5).map((review, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between'>
                  <div className='flex items-center w-full'>
                    <img
                      src={review.img || '/placeholder.svg?height=40&width=40'}
                      alt={review.user}
                      className='h-10 w-10 rounded-full bg-gray-200'
                    />
                    <div className='ml-3 flex-1'>
                      <h4 className='font-medium'>{review.user}</h4>
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
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
