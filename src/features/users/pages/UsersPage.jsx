import { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router';

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
    {
      id: 3,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
    {
      id: 4,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
    {
      id: 5,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
    {
      id: 6,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
    {
      id: 7,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
    {
      id: 8,
      name: 'Customer name',
      phone: '9585622559',
      email: 'customer@gmail.com',
      place: 'Kerala',
      status: 'ACTIVE',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen p-4'>
      <h1 className='text-2xl font-semibold mb-6'>Total Users</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {[
          { label: 'Total Users', value: 2500, change: '+36%', color: 'green' },
          { label: 'Booked Users', value: 25, change: '-26%', color: 'red' },
          { label: 'Active Users', value: 250, change: '+36%', color: 'green' },
          { label: 'Inactive Users', value: 250, change: '-36%', color: 'red' },
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

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='w-12 px-4 py-3 text-left'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300'
                  />
                </th>
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
                  onClick={() => navigate(`/admin/users/details/${user.id}`)}>
                  <td className='px-4 py-4'>
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300'
                    />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center'>
                      <img
                        className='h-10 w-10 rounded-md'
                        src='/placeholder.svg?height=40&width=40'
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
                    {user.phone}
                  </td>
                  <td className='px-4 py-4 text-sm text-gray-500 hidden md:table-cell'>
                    {user.email}
                  </td>
                  <td className='px-4 py-4 text-sm text-gray-500'>
                    {user.place}
                  </td>
                  <td className='px-4 py-4'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                      {user.status}
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
}
