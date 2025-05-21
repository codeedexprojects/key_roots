import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Printer } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getPaymentById } from '../services/paymentService';
import { toast } from 'sonner';

export const PaymentDetailsPage = () => {
  const { paymentId } = useParams();

  // State for API data
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentType, setPaymentType] = useState('package'); // Default to package

  // Fetch payment details
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      try {
        // First try to fetch as package payment
        let response = await getPaymentById(paymentId, 'package');

        // If that fails, try as bus payment
        if (response.error) {
          response = await getPaymentById(paymentId, 'bus');
          if (!response.error) {
            setPaymentType('bus');
          }
        } else {
          setPaymentType('package');
        }

        if (!response.error) {
          setPayment(formatPaymentData(response));
          setError(null);
        } else {
          setError(response.message || 'Failed to load payment details');
          toast.error(response.message || 'Failed to load payment details');
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('An unexpected error occurred');
        toast.error(
          'An unexpected error occurred while loading payment details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  // Format payment data for display
  const formatPaymentData = (data) => {
    if (!data) return null;

    // Format the payment status
    const status = formatPaymentStatus(data.payment_status);

    // Format the payment details
    const formattedPayment = {
      id: data.id.toString(),
      tripName: data.bus_or_package || 'Unknown Trip',
      customerName: data.vendor_name || 'Unknown Customer',
      status,
      payment: {
        baseFare: data.total_amount
          ? `₹${parseFloat(data.total_amount).toLocaleString('en-IN')}`
          : '₹0',
        taxes: '₹0', // Not provided in the API response
        total: data.total_amount
          ? `₹${parseFloat(data.total_amount).toLocaleString('en-IN')}`
          : '₹0',
        amountPaid: data.advance_amount
          ? `₹${parseFloat(data.advance_amount).toLocaleString('en-IN')}`
          : '₹0',
        ourEarnings: calculateIncome(data),
        returnAmount:
          data.payment_status?.toLowerCase() === 'cancelled' ||
          data.payment_status?.toLowerCase() === 'canceled'
            ? `₹${parseFloat(data.advance_amount || 0).toLocaleString('en-IN')}`
            : '₹0',
      },
      paymentMode: 'Advance Paid & Remaining to Driver', // Not provided in the API response
      placedOn: new Date().toLocaleDateString(), // Not provided in the API response
      bookingType: data.booking_type || 'Unknown',
      balanceAmount: data.balance_amount
        ? `₹${parseFloat(data.balance_amount).toLocaleString('en-IN')}`
        : '₹0',
    };

    return formattedPayment;
  };

  // Helper function to format payment status
  const formatPaymentStatus = (status) => {
    if (!status) return 'Pending';

    // Convert to lowercase for case-insensitive comparison
    const lowerStatus = status.toLowerCase();

    if (lowerStatus === 'completed') return 'Completed';
    if (lowerStatus === 'cancelled' || lowerStatus === 'canceled')
      return 'Cancelled';
    if (lowerStatus === 'pending') return 'Pending';

    // Capitalize first letter for any other status
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to calculate income from a payment
  const calculateIncome = (data) => {
    // If payment is cancelled, return "Amount Returned"
    if (
      data.payment_status?.toLowerCase() === 'cancelled' ||
      data.payment_status?.toLowerCase() === 'canceled'
    ) {
      return '₹0';
    }

    // For now, we'll return a placeholder value
    // In a real implementation, you would calculate this based on the payment data
    const incomePercentage = 0.1; // 10%
    const totalAmount = parseFloat(data.total_amount || 0);
    const income = totalAmount * incomePercentage;

    return `₹${income.toLocaleString('en-IN')}`;
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

  const handlePrint = () => {
    window.print();
  };

  // Fix the useEffect dependency warning by using useCallback
  const formatPaymentDataCallback = useCallback((data) => {
    if (!data) return null;

    // Format the payment status
    const status = formatPaymentStatus(data.payment_status);

    // Format the payment details
    const formattedPayment = {
      id: data.id.toString(),
      tripName: data.bus_or_package || 'Unknown Trip',
      customerName: data.vendor_name || 'Unknown Customer',
      status,
      payment: {
        baseFare: data.total_amount
          ? `₹${parseFloat(data.total_amount).toLocaleString('en-IN')}`
          : '₹0',
        taxes: '₹0', // Not provided in the API response
        total: data.total_amount
          ? `₹${parseFloat(data.total_amount).toLocaleString('en-IN')}`
          : '₹0',
        amountPaid: data.advance_amount
          ? `₹${parseFloat(data.advance_amount).toLocaleString('en-IN')}`
          : '₹0',
        ourEarnings: calculateIncome(data),
        returnAmount:
          data.payment_status?.toLowerCase() === 'cancelled' ||
          data.payment_status?.toLowerCase() === 'canceled'
            ? `₹${parseFloat(data.advance_amount || 0).toLocaleString('en-IN')}`
            : '₹0',
      },
      paymentMode: 'Advance Paid & Remaining to Driver', // Not provided in the API response
      placedOn: new Date().toLocaleDateString(), // Not provided in the API response
      bookingType: data.booking_type || 'Unknown',
      balanceAmount: data.balance_amount
        ? `₹${parseFloat(data.balance_amount).toLocaleString('en-IN')}`
        : '₹0',
    };

    return formattedPayment;
  }, []);

  // Update the useEffect to use the callback
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      try {
        // First try to fetch as package payment
        let response = await getPaymentById(paymentId, 'package');

        // If that fails, try as bus payment
        if (response.error) {
          response = await getPaymentById(paymentId, 'bus');
          if (!response.error) {
            setPaymentType('bus');
          }
        } else {
          setPaymentType('package');
        }

        if (!response.error) {
          setPayment(formatPaymentDataCallback(response));
          setError(null);
        } else {
          setError(response.message || 'Failed to load payment details');
          toast.error(response.message || 'Failed to load payment details');
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('An unexpected error occurred');
        toast.error(
          'An unexpected error occurred while loading payment details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId, formatPaymentDataCallback]);

  return (
    <div className='flex-1'>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/payments'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back to Payments</span>
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
      ) : !payment ? (
        <EmptyState
          title='Payment not found'
          description='The requested payment could not be found.'
          icon='default'
        />
      ) : (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='p-6'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
              <div>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  {payment.tripName}
                </h1>
                <p className='text-gray-600 mt-1'>{payment.customerName}</p>
                <p className='text-gray-500 text-sm mt-1'>
                  Booking Type: {payment.bookingType}
                </p>
              </div>

              <div className='mt-4 md:mt-0'>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    payment.status
                  )}`}>
                  {payment.status}
                </span>
              </div>
            </div>

            {/* Payment Details */}
            <div className='mb-8'>
              <h2 className='text-lg font-semibold mb-4'>Payment Detail</h2>

              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Base fare</p>
                  <p className='font-medium'>{payment.payment.baseFare}</p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Taxes</p>
                  <p className='font-medium'>{payment.payment.taxes}</p>
                </div>

                <div className='flex justify-between items-center pt-2 border-t'>
                  <p className='text-gray-600 font-semibold'>Total</p>
                  <p className='font-semibold text-red-600'>
                    {payment.payment.total}
                  </p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Amount paid</p>
                  <p className='font-medium'>{payment.payment.amountPaid}</p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Balance amount</p>
                  <p className='font-medium'>{payment.balanceAmount}</p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Our earnings</p>
                  <p className='font-medium text-green-600'>
                    {payment.payment.ourEarnings}
                  </p>
                </div>

                {payment.status === 'Cancelled' && (
                  <div className='flex justify-between items-center pt-2 border-t'>
                    <p className='text-gray-600 font-semibold'>Return amount</p>
                    <p className='font-semibold text-red-600'>
                      {payment.payment.returnAmount}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Mode */}
            <div className='mb-8'>
              <h2 className='text-lg font-semibold mb-4'>Payment mode</h2>

              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>{payment.paymentMode}</p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Order ID</p>
                  <p className='font-medium'>{payment.id}</p>
                </div>

                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>Placed On</p>
                  <p className='font-medium'>{payment.placedOn}</p>
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
      )}
    </div>
  );
};
