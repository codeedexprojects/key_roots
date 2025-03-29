import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Star } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('12 Months');

  // Sample data for charts
  const data = [
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

  // Sample vendor data
  const vendors = [
    {
      name: 'Shajahan travel',
      location: 'Palakkad',
      bookings: 75,
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Shajahan travel',
      location: 'Palakkad',
      bookings: 75,
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Shajahan travel',
      location: 'Palakkad',
      bookings: 75,
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Shajahan travel',
      location: 'Palakkad',
      bookings: 75,
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Shajahan travel',
      location: 'Palakkad',
      bookings: 75,
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Shajahan travel',
      location: 'Palakkad',
      bookings: 75,
      img: '/placeholder.svg?height=40&width=40',
    },
  ];

  // Sample users data
  const users = [
    {
      name: 'Kaja husain',
      email: 'kajahusain23@gmail.com',
      joined: '12/3/25',
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Kaja husain',
      email: 'kajahusain23@gmail.com',
      joined: '12/3/25',
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Kaja husain',
      email: 'kajahusain23@gmail.com',
      joined: '12/3/25',
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Kaja husain',
      email: 'kajahusain23@gmail.com',
      joined: '12/3/25',
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Kaja husain',
      email: 'kajahusain23@gmail.com',
      joined: '12/3/25',
      img: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Kaja husain',
      email: 'kajahusain23@gmail.com',
      joined: '12/3/25',
      img: '/placeholder.svg?height=40&width=40',
    },
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
    <div className='p-2 md:p-4 lg:p-6'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        {/* Today Booking */}
        <div className='stat-card p-4 border rounded-lg'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Today booking</h3>
            <span className='text-gray-500'>05</span>
          </div>
          <div className='stat-value'>₹25000</div>
          <div className='percentage-up'>+34%</div>
        </div>

        {/* Total Booking */}
        <div className='stat-card p-4 border rounded-lg'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Total booking</h3>
            <span className='text-gray-500'>15</span>
          </div>
          <div className='stat-value'>₹1409090</div>
          <div className='percentage-down'>-26%</div>
        </div>

        {/* Total Vendor */}
        <div className='stat-card p-4 border rounded-lg'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Total vendor</h3>
          </div>
          <div className='stat-value'>75</div>
          <div className='percentage-down'>-26%</div>
        </div>

        {/* Total Users */}
        <div className='stat-card p-4 border rounded-lg'>
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-600'>Total Users</h3>
          </div>
          <div className='stat-value'>2500</div>
          <div className='percentage-up'>+56%</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-2'>
        <div className='card lg:col-span-2'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Total Revenue</h3>
            <div className='flex space-x-2'>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'tab-active' : ''} `}
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
              <AreaChart data={data}>
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

        {/* Recent Approved */}
        <div className='card bg-white border border-gray-200 rounded-md p-5 overflow-y-auto max-h-80'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Recent approved</h3>
            <button className='text-[#1f81ec] text-sm'>Export PDF</button>
          </div>
          <div className='divide-y divide-gray-200'>
            {approvedBookings.map((booking, index) => (
              <div
                key={index}
                className='py-3'>
                <div className='flex justify-between items-center text-sm'>
                  <div>
                    <div className='text-xs text-gray-500'>
                      random & A.K member
                    </div>
                    <div className='font-medium'>
                      {booking.from} ————→ {booking.to}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {booking.date} • {booking.time}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-xs text-gray-500'>{booking.type}</div>
                    <div className='font-medium'>{booking.amount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendors, Users, and Reviews */}
      <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-2'>
        {/* Top Vendors */}
        <div className='card bg-[#e9f7f4] border border-gray-200 rounded-md p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Top Vendors</h3>
            <button className='text-gray-500 text-sm border border-gray-300 px-2 py-1 rounded-md'>
              Stats
            </button>
          </div>
          <div className='space-y-4'>
            {vendors.slice(0, 5).map((vendor, index) => (
              <div
                key={index}
                className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <img
                    src={vendor.img}
                    alt={vendor.name}
                    className='h-10 w-10 rounded-full bg-gray-200'
                  />
                  <div className='ml-3'>
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
          <button className='mt-4 text-center w-full text-gray-500 text-sm'>
            SEE ALL VENDORS
          </button>
        </div>

        {/* Recent Users */}
        <div className='card bg-[#f7f7f7] border border-gray-200 rounded-md p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Recent Users</h3>
            <button className='text-gray-500 text-sm border border-gray-300 px-2 py-1 rounded-md'>
              Stats
            </button>
          </div>
          <div className='space-y-4'>
            {users.slice(0, 5).map((user, index) => (
              <div
                key={index}
                className='flex items-center justify-between'>
                <div className='flex items-center'>
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
                  <p className='text-xs text-gray-500'>Joined in</p>
                  <p className='font-medium'>{user.joined}</p>
                </div>
              </div>
            ))}
          </div>
          <button className='mt-4 text-center w-full text-gray-500 text-sm'>
            SEE ALL USERS
          </button>
        </div>

        {/* Reviews */}
        <div className='card bg-white border border-gray-200 rounded-md p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>Reviews</h3>
            <button className='text-gray-500 text-sm border border-gray-300 px-2 py-1 rounded-md'>
              Stats
            </button>
          </div>
          <div className='space-y-4'>
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={index}
                className='flex items-start'>
                <img
                  src={review.img}
                  alt={review.name}
                  className='h-10 w-10 rounded-full bg-gray-200'
                />
                <div className='ml-3'>
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
            ))}
          </div>
          <button className='mt-4 text-center w-full text-gray-500 text-sm'>
            SEE ALL REVIEWS
          </button>
        </div>
      </div>
    </div>
  );
}
