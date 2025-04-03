import { useParams, Link } from 'react-router';
import { ArrowLeft, Printer } from 'lucide-react';

export const PaymentDetailsPage = () => {
  const { paymentId } = useParams();

  const payment = {
    id: '098754756',
    tripName: 'Green line express',
    customerName: 'Jenna wills & 44 members',
    status: 'Completed', // Can be 'Completed', 'Pending', or 'Cancelled'
    payment: {
      baseFare: '₹100000',
      taxes: '₹38',
      total: '₹100038',
      amountPaid: '₹100038',
      ourEarnings: '₹1500',
      returnAmount: '₹0', // Only for cancelled payments
    },
    paymentMode: 'Advance Paid & Remaining to Driver',
    placedOn: '12/7/2025',
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

  return (
    <div>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/payments'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back to Payments</span>
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='p-6'>
          {/* Header */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                {payment.tripName}
              </h1>
              <p className='text-gray-600 mt-1'>{payment.customerName}</p>
            </div>

            <div>
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
    </div>
  );
};
