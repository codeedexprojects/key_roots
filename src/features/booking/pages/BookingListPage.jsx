import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';

export const BookingListPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // Sample data for bookings
  const bookings = [
    {
      id: 1,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Bus',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 2,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Package',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 3,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Bus',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 4,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Bus',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 5,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Package',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 6,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Bus',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 7,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Package',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 8,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Bus',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 9,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Package',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 10,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Bus',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 11,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Package',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
    {
      id: 12,
      name: 'Jenna Willis',
      date: 'July 1, 2023',
      category: 'Bus',
      trip: 'Varkala → Ernakulam',
      cost: '$500',
    },
  ];

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter((booking) => {
      // Apply search filter
      if (searchTerm) {
        return (
          booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.trip.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply category filter
      if (filterBy === 'all') return true;
      if (filterBy === 'bus') return booking.category === 'Bus';
      if (filterBy === 'package') return booking.category === 'Package';

      return true;
    })
    .sort((a, b) => {
      // Apply sorting (in a real app, you'd use actual date objects)
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;

      return 0;
    });

  // Pagination
  const bookingsPerPage = 6;
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className='flex-1'>
      <h1 className='text-2xl font-semibold mb-6'>Bookings</h1>

      {/* Search and Filters */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div className='relative w-full md:w-64'>
          <input
            type='text'
            placeholder='Search bookings...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value='newest'>Sort by: Newest</option>
              <option value='oldest'>Sort by: Oldest</option>
            </select>
            <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
          </div>

          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm'
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}>
              <option value='all'>Filter by: All</option>
              <option value='bus'>Bus</option>
              <option value='package'>Package</option>
            </select>
            <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6'>
        <div className='overflow-x-auto'>
          {currentBookings.length > 0 ? (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  {['Name', 'Date', 'Category', 'Trip', 'Cost', 'Action'].map(
                    (header, i) => (
                      <th
                        key={i}
                        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className='hover:bg-gray-50 cursor-pointer'
                    onClick={() => navigate(`/booking/${booking.id}`)}>
                    <td className='px-4 py-4'>
                      <div className='flex items-center'>
                        <img
                          className='h-10 w-10 rounded-md'
                          src='https://img.freepik.com/premium-vector/booking-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
                          alt=''
                        />
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {booking.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500'>
                      {booking.date}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500'>
                      {booking.category}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500'>
                      {booking.trip}
                    </td>
                    <td className='px-4 py-4'>
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                        {booking.cost}
                      </span>
                    </td>
                    <td className='px-4 py-4 text-right text-sm font-medium'>
                      <MoreHorizontal className='h-5 w-5 text-gray-400 hover:text-gray-500' />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='bg-white rounded-lg shadow-sm p-8 text-center mb-6'>
              <p className='text-gray-500'>
                No Bookings found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {currentBookings.length > 0 && (
          <div className='px-6 py-4 bg-white border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-medium'>{indexOfFirstBooking + 1}</span>{' '}
                to{' '}
                <span className='font-medium'>
                  {Math.min(indexOfLastBooking, filteredBookings.length)}
                </span>{' '}
                of{' '}
                <span className='font-medium'>{filteredBookings.length}</span>{' '}
                bookings
              </div>

              <div className='flex space-x-1'>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span className='sr-only'>Previous</span>
                  <ChevronLeft className='h-5 w-5' />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    } rounded-md`}>
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span className='sr-only'>Next</span>
                  <ChevronRight className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
