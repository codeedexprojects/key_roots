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

export function DashboardPage() {
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
    <div className='p-2 md:p-4 lg:p-6 space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[
          {
            title: 'Today booking',
            value: '₹25000',
            count: '05',
            trend: '+34%',
            type: 'up',
          },
          {
            title: 'Total booking',
            value: '₹1409090',
            count: '15',
            trend: '-26%',
            type: 'down',
          },
          {
            title: 'Total vendor',
            value: '75',
            trend: '-26%',
            type: 'down',
          },
          {
            title: 'Total Users',
            value: '2500',
            trend: '+56%',
            type: 'up',
          },
        ].map(({ title, value, count, trend, type }) => (
          <div
            className='p-4 bg-white rounded-lg shadow-sm'
            key={`${title}-${value}`}>
            <div className='flex justify-between items-center'>
              <h3 className='text-gray-600'>{title}</h3>
              {count && <span className='text-gray-500'>{count}</span>}
            </div>
            <div className='text-xl font-semibold'>{value}</div>
            <div
              className={
                type === 'up'
                  ? 'text-green-500 text-sm'
                  : 'text-red-500 text-sm'
              }>
              {trend}
            </div>
          </div>
        ))}
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
        {[
          {
            title: 'Top Vendors',
            bg: 'bg-[#e9f7f4]',
            data: vendors,
            footer: 'SEE ALL VENDORS',
            render: (v) => (
              <>
                <h4 className='font-medium'>{v.name}</h4>
                <p className='text-sm text-gray-500'>{v.location}</p>
              </>
            ),
            meta: (v) => (
              <>
                <p className='text-xs text-gray-500'>Total bookings</p>
                <p className='font-medium'>{v.bookings}</p>
              </>
            ),
          },
          {
            title: 'Recent Users',
            bg: 'bg-[#f7f7f7]',
            data: users,
            footer: 'SEE ALL USERS',
            render: (u) => (
              <>
                <h4 className='font-medium'>{u.name}</h4>
                <p className='text-xs text-gray-500 truncate'>{u.email}</p>
              </>
            ),
            meta: (u) => (
              <>
                <p className='text-xs text-gray-500'>Joined in</p>
                <p className='font-medium'>{u.joined}</p>
              </>
            ),
          },
          {
            title: 'Reviews',
            bg: 'bg-white',
            data: reviews,
            footer: 'SEE ALL REVIEWS',
            render: (r) => (
              <>
                <h4 className='font-medium'>{r.name}</h4>
                <div className='flex items-center mt-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                  {r.content}
                </p>
              </>
            ),
            meta: () => null,
          },
        ].map(({ title, bg, data, footer, render, meta }, i) => (
          <div
            key={i}
            className={`card ${bg} border border-gray-200 rounded-md p-5`}>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-medium'>{title}</h3>
              <button className='text-gray-500 text-sm border border-gray-300 px-2 py-1 rounded-md'>
                Stats
              </button>
            </div>
            <div className='space-y-4'>
              {data.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between'>
                  <div className='flex items-center w-full'>
                    <img
                      src={item.img}
                      alt={item.name}
                      className='h-10 w-10 rounded-full bg-gray-200'
                    />
                    <div className='ml-3 flex-1'>{render(item)}</div>
                  </div>
                  <div className='text-right'>{meta(item)}</div>
                </div>
              ))}
            </div>
            <button className='mt-4 text-center w-full text-gray-500 text-sm'>
              {footer}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
