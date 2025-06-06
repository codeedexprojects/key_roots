import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Printer } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getBookingById } from '../services/bookingService';
import { toast } from 'sonner';

export const BookingDetailsPage = () => {
  const { bookingId, bookingType } = useParams();

  // State for API data
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getBookingById(bookingId, bookingType);

        if (!response.error) {
          setBooking(response);
          setError(null);
        } else {
          setError(response.message || 'Failed to load booking details');
          toast.error(response.message || 'Failed to load booking details');
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('An unexpected error occurred');
        toast.error(
          'An unexpected error occurred while loading booking details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // Format booking data for display
  const formatBookingData = () => {
    if (!booking) return null;

    // Get the first traveler's name or use a default
    const travelerName =
      booking.travelers && booking.travelers.length > 0
        ? `${booking.travelers[0].first_name} ${
            booking.travelers[0].last_name || ''
          }`
        : 'Unknown';

    // Format the travel date
    const travelDate = booking.start_date
      ? new Date(booking.start_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A';

    // Get trip location
    const tripLocation =
      booking.from_location && booking.to_location
        ? `${booking.from_location} to ${booking.to_location}`
        : 'N/A';

    // Get phone number from first traveler
    const phone =
      booking.travelers &&
      booking.travelers.length > 0 &&
      booking.travelers[0].mobile
        ? booking.travelers[0].mobile
        : 'N/A';

    // Format payment details
    const payment = {
      baseFare: booking.total_amount
        ? `₹${parseFloat(booking.total_amount).toLocaleString('en-IN')}`
        : '₹0',
      taxes: '₹0', // Not provided in the API response
      total: booking.total_amount
        ? `₹${parseFloat(booking.total_amount).toLocaleString('en-IN')}`
        : '₹0',
      amountPaid: booking.advance_amount
        ? `₹${parseFloat(booking.advance_amount).toLocaleString('en-IN')}`
        : '₹0',
      amountToBePaid: booking.balance_amount
        ? `₹${parseFloat(booking.balance_amount).toLocaleString('en-IN')}`
        : '₹0',
    };

    // Get trip name based on booking type
    const tripName =
      booking.booking_type === 'bus'
        ? booking.bus
          ? `Bus: ${booking.bus}`
          : 'Bus Booking'
        : booking.package_details
        ? booking.package_details.travels_name
        : 'Package Booking';

    return {
      id: booking.id.toString(),
      customerName: `${travelerName} & ${booking.total_travelers || 0} members`,
      tripName,
      travelDate,
      place: tripLocation,
      phone,
      payment,
      status: booking.booking_status || 'pending',
      paymentStatus: booking.payment_status || 'pending',
      tripStatus: booking.trip_status || 'not_started',
    };
  };

  const formattedBooking = formatBookingData();

  const handlePrint = () => {
    window.print();
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
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/booking'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back to Bookings</span>
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
      ) : !formattedBooking ? (
        <EmptyState
          title='Booking not found'
          description='The requested booking could not be found.'
          icon='default'
        />
      ) : (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='p-6'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
              <div>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  {formattedBooking.tripName}
                </h1>
                <p className='text-gray-600 mt-1'>
                  {formattedBooking.customerName}
                </p>
              </div>
              <div className='mt-4 md:mt-0'>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    formattedBooking.status
                  )}`}>
                  {formattedBooking.status?.charAt(0).toUpperCase() +
                    formattedBooking.status?.slice(1) || 'Pending'}
                </span>
              </div>
            </div>

            {/* Booking Details */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Your Booking Id</p>
                    <p className='font-medium'>{formattedBooking.id}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Travel date</p>
                    <p className='font-medium'>{formattedBooking.travelDate}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Place</p>
                    <p className='font-medium'>{formattedBooking.place}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Phone</p>
                    <p className='font-medium'>{formattedBooking.phone}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Payment Status</p>
                    <p className='font-medium'>
                      <span
                        className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          formattedBooking.paymentStatus
                        )}`}>
                        {formattedBooking.paymentStatus
                          ?.charAt(0)
                          .toUpperCase() +
                          formattedBooking.paymentStatus?.slice(1) || 'Pending'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Trip Status</p>
                    <p className='font-medium'>
                      <span
                        className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          formattedBooking.tripStatus
                        )}`}>
                        {formattedBooking.tripStatus === 'not_started'
                          ? 'Not Started'
                          : formattedBooking.tripStatus
                              ?.charAt(0)
                              .toUpperCase() +
                              formattedBooking.tripStatus?.slice(1) ||
                            'Not Started'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h2 className='text-lg font-semibold mb-4'>Payment Detail</h2>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <p className='text-gray-600'>Base fare</p>
                    <p className='font-medium'>
                      {formattedBooking.payment.baseFare}
                    </p>
                  </div>

                  <div className='flex justify-between items-center'>
                    <p className='text-gray-600'>Taxes</p>
                    <p className='font-medium'>
                      {formattedBooking.payment.taxes}
                    </p>
                  </div>

                  <div className='flex justify-between items-center pt-2 border-t'>
                    <p className='text-gray-600 font-semibold'>Total</p>
                    <p className='font-semibold text-red-600'>
                      {formattedBooking.payment.total}
                    </p>
                  </div>

                  <div className='flex justify-between items-center'>
                    <p className='text-gray-600'>Amount paid</p>
                    <p className='font-medium'>
                      {formattedBooking.payment.amountPaid}
                    </p>
                  </div>

                  <div className='flex justify-between items-center pt-2 border-t'>
                    <p className='text-gray-600 font-semibold'>
                      Amount to be paid
                    </p>
                    <p className='font-semibold text-red-600'>
                      {formattedBooking.payment.amountToBePaid}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travelers Section */}
            {booking.travelers && booking.travelers.length > 0 && (
              <div className='mb-8'>
                <h2 className='text-lg font-semibold mb-4'>Travelers</h2>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Name
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Email
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Mobile
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Age
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {booking.travelers.map((traveler, index) => (
                        <tr key={traveler.id || index}>
                          <td className='px-4 py-3 text-sm text-gray-500'>
                            {traveler.first_name} {traveler.last_name || ''}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-500'>
                            {traveler.email || 'N/A'}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-500'>
                            {traveler.mobile || 'N/A'}
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-500'>
                            {traveler.age || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Print Button */}
            <div className='flex justify-end'>
              <button
                onClick={handlePrint}
                className='inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                <Printer className='h-5 w-5 mr-2' />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
