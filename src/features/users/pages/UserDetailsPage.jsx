import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';

export function UserDetailsPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('rewards');

  const user = {
    id: userId || 1234,
    name: 'Ziyad',
    userId: '011221',
    phone: '9874562214',
    email: 'ziyad.skywaytravels@icloud.com',
    location: 'Palakkad',
    address: 'Palakkad bypass junction, Palakkad, Kerala, 678553',
    totalBookings: 2500,
    totalRewards: 10,
  };

  // Sample booking data
  const bookings = [
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Pending',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Cancelled',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Completed',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Pending',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Pending',
    },
    {
      date: '12 Dec 2023',
      item: 'Package with bus',
      orderId: '#302011',
      total: '$121.00',
      status: 'Pending',
    },
  ];

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
    <div className='min-h-screen px-4 py-6 md:px-6'>
      <div className='mb-6'>
        <Link
          href='/admin/users'
          className='inline-flex items-center text-gray-600 hover:text-gray-900 text-sm'>
          <ArrowLeft className='h-4 w-4 mr-1' /> Back to Users
        </Link>
      </div>

      <h1 className='text-2xl font-semibold mb-6'>User Details</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='bg-white rounded-md shadow-sm p-6'>
          <div className='flex flex-col items-center mb-6'>
            <img
              src='/placeholder.svg?height=96&width=96'
              alt={user.name}
              className='w-24 h-24 rounded-md bg-gray-200 object-cover mb-4'
            />
            <h2 className='text-xl font-semibold'>{user.name}</h2>
            <p className='text-gray-500 text-sm'>ID-{user.userId}</p>
            <p className='text-gray-500 text-sm mt-1'>{user.location}</p>
          </div>

          <div className='border-t pt-4 space-y-4'>
            <h3 className='font-semibold text-lg mb-2'>Personal Information</h3>
            {[
              'User Name',
              'Phone Number',
              'Email ID',
              'Location',
              'Address',
            ].map((label, idx) => (
              <div key={label}>
                <p className='text-gray-500 text-sm'>{label}</p>
                <p className='font-medium'>{Object.values(user)[idx + 1]}</p>
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
                  <span className='ml-2 text-xs text-green-500'>+36%</span>
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
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead>
                    <tr>
                      {activeTab === 'rewards'
                        ? ['Date', 'Item', 'Order ID', 'Total', 'Status'].map(
                            (header) => (
                              <th
                                key={header}
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                {header}
                              </th>
                            )
                          )
                        : [
                            'Date',
                            'Options',
                            'Refer ID',
                            'Reward',
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
                    {(activeTab === 'bookings' ? bookings : rewards).map(
                      (row, i) => (
                        <tr
                          key={i}
                          className='hover:bg-gray-50'>
                          {Object.values(row).map((cell, j) => (
                            <td
                              key={j}
                              className={`px-4 py-4 whitespace-nowrap text-sm ${
                                j === 4 ? getStatusColor(cell) : 'text-gray-500'
                              }`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
