import { Download } from 'lucide-react';

const PendingPayoutTable = ({ payouts, onExportPayout, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='p-8 text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto'></div>
          <p className='mt-2 text-gray-500'>Loading payouts...</p>
        </div>
      </div>
    );
  }

  if (!payouts || payouts.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='p-8 text-center'>
          <p className='text-gray-500'>No pending payouts found</p>
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
                Vendor name
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email id
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Phone number
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Account number
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                IFSC Code
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Pay out Mode
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Pay out Amount
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Admin commission
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Category
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Total Amount
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Reward
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
                    {payout.vendor_phone || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.vendor_account_number || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.vendor_ifsc_code || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.payout_mode || 'Account'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    ₹{payout.amount?.toLocaleString() || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    ₹{payout.admin_commission?.toLocaleString() || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    {payout.type?.[0].toUpperCase() + payout.type?.slice(1) ||
                      'N/A'}
                  </span>
                </td>

                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    ₹{payout.net_amount || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.rewards || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => onExportPayout(payout)}
                      className='text-green-600 hover:text-green-900 p-1 rounded'
                      title='Export to PDF'>
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

export default PendingPayoutTable;
