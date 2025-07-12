import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import {
  getAllPayments,
  formatPaymentsForDisplay,
} from '../services/paymentService';
import { toast } from 'sonner';

export const PaymentsListPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // State for API data
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments data
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const response = await getAllPayments();

        if (!response.error) {
          // Format the payments data for display
          const formattedPayments = formatPaymentsForDisplay(response);
          setPayments(formattedPayments);
          setError(null);
        } else {
          setError(response.message || 'Failed to load payments');
          toast.error(response.message || 'Failed to load payments');
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred while loading payments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      // Apply search filter
      if (searchTerm) {
        return (
          payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.trip.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (filterBy === 'all') return true;
      if (filterBy === 'completed') return payment.status === 'Completed';
      if (filterBy === 'pending') return payment.status === 'Pending';
      if (filterBy === 'cancelled') return payment.status === 'Cancelled';

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'amount') {
        // Extract numeric values from formatted amounts
        const aAmount = a.totalAmount.replace(/[₹,\s]/g, '');
        const bAmount = b.totalAmount.replace(/[₹,\s]/g, '');
        return parseFloat(bAmount) - parseFloat(aAmount);
      }

      return 0;
    });

  // Pagination
  const paymentsPerPage = 6;
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='flex-1'>
      <h1 className='text-2xl font-semibold mb-6'>Payments</h1>

      {/* Search and Filters */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div className='relative w-full md:w-64'>
          <input
            type='text'
            placeholder='Search payments...'
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
              <option value='amount'>Sort by: Amount</option>
            </select>
            <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
          </div>

          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm'
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}>
              <option value='all'>Filter by: All</option>
              <option value='completed'>Completed</option>
              <option value='pending'>Pending</option>
              <option value='cancelled'>Cancelled</option>
            </select>
            <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6'>
        {isLoading ? (
          <div className='flex justify-center items-center min-h-[500px]'>
            <LoadingSpinner size='large' />
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <EmptyState
            title='No payments found'
            description='There are no payments matching your criteria.'
            icon='default'
          />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  {[
                    'Vendor Name',
                    'Trip',
                    'Total Amount',
                    'Status',
                    'Income',
                    'Booking Type',
                  ].map((header, i) => (
                    <th
                      key={`${header}-${i}`}
                      className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className='hover:bg-gray-50 cursor-pointer'
                    onClick={() => navigate(`/admin/payments/${payment.id}`)}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <img
                          className='h-10 w-10 rounded-md'
                          src='https://img.freepik.com/premium-vector/booking-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
                          alt=''
                        />
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {payment.vendorName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {payment.trip}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium'>
                        {payment.totalAmount}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          payment.status
                        )}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={`text-sm ${
                          payment.status === 'Cancelled'
                            ? 'text-red-500'
                            : 'text-green-500'
                        }`}>
                        {payment.income}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {payment.bookingType}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - only show when we have data and not loading */}
        {!isLoading && !error && filteredPayments.length > 0 && (
          <div className='px-6 py-4 bg-white border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-medium'>{indexOfFirstPayment + 1}</span>{' '}
                to{' '}
                <span className='font-medium'>
                  {Math.min(indexOfLastPayment, filteredPayments.length)}
                </span>{' '}
                of{' '}
                <span className='font-medium'>{filteredPayments.length}</span>{' '}
                payments
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
          </div>
        )}
      </div>
    </div>
  );
};
