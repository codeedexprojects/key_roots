import { useState, useEffect, useCallback } from 'react';
import { FileText, Clock } from 'lucide-react';
import PayoutTable from '../components/PayoutTable';
import { payoutService } from '../services/payoutService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

const PayoutPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load payouts data
  const loadPayouts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await payoutService.getPayouts(currentPage);
      if (response.payout_requests?.length) {
        const mappedPayouts = response.payout_requests.map((payout) => ({
          id: payout.id,
          vendor_name: payout.vendor_name,
          vendor_email: payout.bank_detail.email_id,
          vendor_phone: payout.bank_detail.phone_number,
          vendor_id: payout.vendor_travels,
          vendor_account_number: payout.bank_detail.account_number,
          vendor_ifsc_code: payout.bank_detail.ifsc_code,
          payoutMode: payout.bank_detail.payout_mode,
          amount: payout.request_amount,
          admin_remarks: payout.admin_remarks || '',
          type: payout.remarks,
          booking_id: payout.transaction_id || payout.id,
          created_at: payout.requested_at,
          completedDate: payout.processed_at,
          status: payout.status,
        }));
        setPayouts(mappedPayouts);
        setTotalPages(Math.ceil(response.total_requests / 10));
      } else {
        setPayouts([]);
      }
    } catch (error) {
      toast.error('Error loading payouts');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // Load data on component mount
  useEffect(() => {
    loadPayouts();
  }, [currentPage, loadPayouts]);

  // Handle export PDF
  const handleExportPayout = async (payout) => {
    try {
      const payoutDetails = await payoutService.getPayoutById(payout.id);
      if (payoutDetails.error) {
        toast.error(payoutDetails.message);
        if (payoutDetails.status === 401) {
          window.location.href = '/login';
        }
        return;
      }
      const mappedDetails = {
        id: payoutDetails.id,
        vendor_name: payoutDetails.vendor_name,
        vendor_email: payoutDetails.bank_detail.email_id,
        vendor_phone: payoutDetails.bank_detail.phone_number,
        vendor_id: payoutDetails.vendor_travels,
        vendor_account_number: payoutDetails.bank_detail.account_number,
        vendor_ifsc_code: payoutDetails.bank_detail.ifsc_code,
        payoutMode: payoutDetails.bank_detail.payout_mode,
        amount: payoutDetails.request_amount,
        admin_remarks: payoutDetails.admin_remarks || '',
        type: payoutDetails.remarks,
        booking_id: payoutDetails.transaction_id || payoutDetails.id,
        created_at: payoutDetails.requested_at,
        completedDate: payoutDetails.processed_at,
        status: payoutDetails.status,
      };
      await exportSinglePayoutToPDF(mappedDetails);
      toast.success('PDF exported successfully.');
    } catch (error) {
      toast.error('Error exporting payout');
      console.error(error);
    }
  };

  // Handle status change
  const handleCompletePayout = async (payoutId, status, admin_remarks) => {
    try {
      const response = await payoutService.completePayout(
        payoutId,
        status,
        admin_remarks
      );
      if (response.error) {
        toast.error(response.message);
        if (response.status === 401) {
          window.location.href = '/login';
        }
        return;
      }
      toast.success(`Payout status changed to ${status}.`);
      loadPayouts();
    } catch (error) {
      toast.error('Error changing payout status');
      console.error(error);
    }
  };

  // Generate and download PDF for a single payout
  const exportSinglePayoutToPDF = (payout) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Payout Details Report', margin, 30);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          pageWidth - 60,
          30
        );

        let yPosition = 50;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Vendor Information', margin, yPosition);

        yPosition += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const vendorInfo = [
          ['Vendor Name:', payout.vendor_name || 'Not provided'],
          ['Email ID:', payout.vendor_email || 'Not provided'],
          ['Phone Number:', payout.vendor_phone || 'Not provided'],
          ['Vendor ID:', payout.vendor_id?.toString() || 'Not provided'],
        ];

        vendorInfo.forEach(([label, value]) => {
          yPosition += 8;
          doc.setFont('helvetica', 'bold');
          doc.text(label, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(value, margin + 40, yPosition);
        });

        yPosition += 20;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Payout Information', margin, yPosition);

        yPosition += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const payoutInfo = [
          ['IFSC Code:', payout.vendor_ifsc_code || 'Not provided'],
          ['Payout Mode:', payout.payoutMode || 'Not provided'],
          [
            'Payout Amount:',
            payout.amount
              ? `${payout.amount.toLocaleString()}`
              : 'Not provided',
          ],
          ['Category:', payout.type || 'Not provided'],
          ['Admin Remarks:', payout.admin_remarks || 'Not provided'],
        ];

        payoutInfo.forEach(([label, value]) => {
          yPosition += 8;
          doc.setFont('helvetica', 'bold');
          doc.text(label, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(value, margin + 40, yPosition);
        });

        yPosition += 20;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Booking Information', margin, yPosition);

        yPosition += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const bookingInfo = [
          ['Booking ID:', payout.booking_id?.toString() || 'Not provided'],
          [
            'Booking Date:',
            payout.created_at
              ? new Date(payout.created_at).toLocaleDateString()
              : 'Not provided',
          ],
        ];

        if (payout.completedDate) {
          bookingInfo.push([
            'Completed Date:',
            new Date(payout.completedDate).toLocaleDateString(),
          ]);
        }

        bookingInfo.forEach(([label, value]) => {
          yPosition += 8;
          doc.setFont('helvetica', 'bold');
          doc.text(label, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(value, margin + 40, yPosition);
        });

        if (yPosition > 200) {
          doc.addPage();
          yPosition = 30;
        } else {
          yPosition += 20;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary', margin, yPosition);

        yPosition += 10;

        const summaryData = [
          [
            'Payout Amount',
            payout.amount ? `${payout.amount.toLocaleString()}` : '0',
          ],
          ['Payment Method', payout.payoutMode || 'Not specified'],
          [
            'Status',
            payout.status
              ? payout.status.charAt(0).toUpperCase() + payout.status.slice(1)
              : 'Pending',
          ],
          ['Admin Remarks', payout.admin_remarks || 'None'],
          ['Generated Date', new Date().toLocaleDateString()],
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Description', 'Value']],
          body: summaryData,
          theme: 'grid',
          headStyles: { fillColor: [220, 38, 38] },
          margin: { left: margin, right: margin },
          styles: { fontSize: 10 },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth - 30,
            doc.internal.pageSize.height - 10
          );
        }

        const filename = `payout-details-${payout.vendor_name.replace(
          /\s+/g,
          '-'
        )}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        setTimeout(() => {
          resolve();
        }, 1000);
      } catch (error) {
        console.error('Error exporting PDF:', error);
        reject(error);
      }
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-2xl font-semibold text-gray-900'>Payouts</h1>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <Clock className='h-8 w-8 text-yellow-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Pending Payouts
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {
                        payouts.filter((p) =>
                          ['pending', 'approved'].includes(p.status)
                        ).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <Clock className='h-8 w-8 text-green-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Completed Payouts
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {payouts.filter((p) => p.status === 'processed').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <FileText className='h-8 w-8 text-blue-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Total Amount Pending
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {payouts
                        .filter((p) =>
                          ['pending', 'approved'].includes(p.status)
                        )
                        .reduce((sum, payout) => sum + (payout.amount || 0), 0)
                        .toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PayoutTable
          payouts={payouts}
          onExportPayout={handleExportPayout}
          onCompletePayout={handleCompletePayout}
          isLoading={isLoading}
        />

        {totalPages > 1 && (
          <div className='mt-6 flex items-center justify-between'>
            <div className='flex-1 flex justify-between sm:hidden'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                Next
              </button>
            </div>
            <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm text-gray-700'>
                  Showing page{' '}
                  <span className='font-medium'>{currentPage}</span> of{' '}
                  <span className='font-medium'>{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutPage;
