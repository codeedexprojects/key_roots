import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PayoutTable = ({
  payouts,
  onExportPayout,
  onCompletePayout,
  isLoading = false,
}) => {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [open, setOpen] = useState(false);

  const handleDialogOpen = (payout) => {
    setSelectedPayout(payout);
    setSelectedStatus('');
    setAdminRemarks('');
    setOpen(true);
  };

  const handleStatusChange = () => {
    if (selectedPayout && selectedStatus) {
      onCompletePayout(selectedPayout.id, selectedStatus, adminRemarks);
      setOpen(false);
    }
  };

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
          <p className='text-gray-500'>No payouts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border overflow-hidden no-scrollbar'>
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
                Category
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Total Amount
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Admin Remarks
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
                    {payout.payoutMode || 'Account'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    ₹{payout.amount?.toLocaleString() || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4'>
                  <span className='text-sm font-medium text-gray-900'>
                    {payout.type?.[0].toUpperCase() + payout.type?.slice(1) ||
                      'N/A'}
                  </span>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    ₹{payout.amount?.toLocaleString() || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.status?.[0].toUpperCase() +
                      payout.status?.slice(1) || 'N/A'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {payout.admin_remarks || 'N/A'}
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
                    {
                      <Dialog
                        open={open && selectedPayout?.id === payout.id}
                        onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <button
                            className='text-white p-2 bg-orange-400 rounded transition-all shadow-lg font-light text-xs focus:border-0 focus:ring-0 focus:outline-none'
                            title='Change Status'
                            onClick={() => handleDialogOpen(payout)}>
                            Change Status
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Payout Status</DialogTitle>
                            <DialogDescription>
                              Select a new status for the payout and provide any
                              remarks.
                            </DialogDescription>
                          </DialogHeader>
                          <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                              <Label
                                htmlFor='status'
                                className='text-right'>
                                Status
                              </Label>
                              <Select
                                onValueChange={setSelectedStatus}
                                value={selectedStatus}>
                                <SelectTrigger className='col-span-3'>
                                  <SelectValue placeholder='Select a status' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='approved'>
                                    Approved
                                  </SelectItem>
                                  <SelectItem value='processed'>
                                    Processed
                                  </SelectItem>
                                  <SelectItem value='rejected'>
                                    Rejected
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                              <Label
                                htmlFor='admin_remarks'
                                className='text-right'>
                                Admin Remarks
                              </Label>
                              <Input
                                id='admin_remarks'
                                value={adminRemarks}
                                onChange={(e) =>
                                  setAdminRemarks(e.target.value)
                                }
                                className='col-span-3'
                                placeholder='Enter remarks'
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => setOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              type='button'
                              onClick={handleStatusChange}
                              disabled={!selectedStatus}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    }
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

export default PayoutTable;
