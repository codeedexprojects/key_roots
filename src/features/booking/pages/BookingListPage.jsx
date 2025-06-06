import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import {
  getAllBookings,
  formatBookingsForDisplay,
} from '../services/bookingService';
import { toast } from 'sonner';

export const BookingListPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // State for API data
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await getAllBookings();
        if (!response.error) {
          // Format the bookings data for display
          const formattedBookings = formatBookingsForDisplay(response);
          setBookings(formattedBookings);
          setError(null);
        } else {
          setError(response.message || 'Failed to load bookings');
          toast.error(response.message || 'Failed to load bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred while loading bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
    // This effect should only run once on mount
    // formatBookingsForDisplay is imported and doesn't change
  }, []);

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
      // Apply sorting based on date or ID
      if (sortBy === 'newest') {
        // If we have dates, use them for sorting
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        // Fallback to ID sorting
        return b.id - a.id;
      }
      if (sortBy === 'oldest') {
        if (a.date && b.date) {
          return new Date(a.date) - new Date(b.date);
        }
        return a.id - b.id;
      }
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

  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Helper function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        {isLoading ? (
          <div className='flex justify-center items-center min-h-[500px]'>
            <LoadingSpinner size='large' />
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title='No bookings found'
            description='There are no bookings matching your criteria.'
            icon='default'
          />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  {[
                    'Name',
                    'Date',
                    'Category',
                    'Trip',
                    'Cost',
                    'Status',
                    'Action',
                  ].map((header, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className='hover:bg-gray-50 cursor-pointer'
                    onClick={() =>
                      navigate(
                        `/booking/${
                          booking.id
                        }/${booking.category.toLowerCase()}`
                      )
                    }>
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
                    <td className='px-4 py-4'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          booking.status
                        )}`}>
                        {booking.status?.charAt(0).toUpperCase() +
                          booking.status?.slice(1) || 'Pending'}
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

        {/* Pagination - only show when we have data and not loading */}
        {!isLoading && !error && filteredBookings.length > 0 && (
          <div className='flex px-6 py-4 bg-white border-t border-gray-200 justify-end'>
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

              {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
                <>
                  <button
                    onClick={() => paginate(1)}
                    className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md'>
                    1
                  </button>
                  {currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
                    <span>...</span>
                  )}
                </>
              )}

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } rounded-md`}>
                  {page}
                </button>
              ))}

              {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
                <>
                  {currentPage <
                    totalPages - Math.floor(maxVisiblePages / 2) - 1 && (
                    <span>...</span>
                  )}
                  <button
                    onClick={() => paginate(totalPages)}
                    className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md'>
                    {totalPages}
                  </button>
                </>
              )}

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
        )}
      </div>
    </div>
  );
};
