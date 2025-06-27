import { Download, Eye } from 'lucide-react';

const CompletedPayoutTable = ({
  payouts,
  onExportPayout,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='p-8 text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto'></div>
          <p className='mt-2 text-gray-500'>Loading completed payouts...</p>
        </div>
      </div>
    );
  }

  if (!payouts || payouts.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='p-8 text-center'>
          <p className='text-gray-500'>No completed payouts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Payout ID
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Vendor Name
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Account Number
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                IFSC Code
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Payout Mode
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Total Amount
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Admin Commission
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Net Amount
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Booking Type
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Booking ID
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Payout Date
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {payouts.map((payout) => (
              <tr
                key={payout.id}
                className='hover:bg-gray-50'>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    #{payout.id}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    {payout.vendor_name || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.vendor_email || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.bank_details?.account_number || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.bank_details?.ifsc_code || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    {payout.payout_mode?.toUpperCase() || 'Account'}
                  </span>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    ₹{parseFloat(payout.total_amount || 0).toLocaleString()}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    ₹{parseFloat(payout.admin_commission || 0).toLocaleString()}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-green-600'>
                    ₹{parseFloat(payout.net_amount || 0).toLocaleString()}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    {payout.bookings?.[0]?.type?.toUpperCase() || 'N/A'}
                  </span>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.bookings?.[0]?.booking_id || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.payout_date
                      ? new Date(payout.payout_date).toLocaleDateString(
                          'en-IN',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )
                      : 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => onExportPayout && onExportPayout(payout)}
                      className='text-green-600 hover:text-green-900 p-1 rounded'
                      title='Download PDF'>
                      <Download className='h-4 w-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedPayoutTable;
