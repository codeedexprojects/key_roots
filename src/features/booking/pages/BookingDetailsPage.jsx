import React from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Printer } from 'lucide-react';

export const BookingDetailsPage = () => {
  const { bookingId } = useParams();

  // Sample booking data (in a real app, you'd fetch this based on the ID)
  const booking = {
    id: '234567838',
    customerName: 'Jenna wills & 44 members',
    tripName: 'Green line express',
    travelDate: '16/06/2025 - 17/06/2025',
    place: 'Thrissur to Alleppey, kollam and wayanad',
    phone: '9949622564',
    payment: {
      baseFare: '₹6000',
      taxes: '₹38',
      total: '₹6038',
      amountPaid: '₹2000',
      amountToBePaid: '₹4038',
    },
  };

  const handlePrint = () => {
    window.print();
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

      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='p-6'>
          {/* Header */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                {booking.tripName}
              </h1>
              <p className='text-gray-600 mt-1'>{booking.customerName}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>Your Booking Id</p>
                  <p className='font-medium'>{booking.id}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Travel date</p>
                  <p className='font-medium'>{booking.travelDate}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Place</p>
                  <p className='font-medium'>{booking.place}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Phone</p>
                  <p className='font-medium'>{booking.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Payment Detail</h2>

              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Base fare</p>
                  <p className='font-medium'>{booking.payment.baseFare}</p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Taxes</p>
                  <p className='font-medium'>{booking.payment.taxes}</p>
                </div>

                <div className='flex justify-between items-center pt-2 border-t'>
                  <p className='text-gray-600 font-semibold'>Total</p>
                  <p className='font-semibold text-red-600'>
                    {booking.payment.total}
                  </p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Amount paid</p>
                  <p className='font-medium'>{booking.payment.amountPaid}</p>
                </div>

                <div className='flex justify-between items-center pt-2 border-t'>
                  <p className='text-gray-600 font-semibold'>
                    Amount to be paid
                  </p>
                  <p className='font-semibold text-red-600'>
                    {booking.payment.amountToBePaid}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
    </div>
  );
};
