import { useState, useEffect, useCallback } from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import PendingPayoutTable from '../components/PendingPayoutTable';

import { payoutService } from '../services/payoutService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import CompletedPayoutTable from '../components/CompletedPayoutTable';

const PayoutPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [completedPayouts, setCompletedPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load payouts data
  const loadPayouts = useCallback(async () => {
    setIsLoading(true);
    try {
      const pendingRes = await payoutService.getPendingPayouts();
      if (pendingRes.length) {
        setPendingPayouts(pendingRes);
        setTotalPages(1);
      }

      const completedRes = await payoutService.getCompletedPayouts();
      if (completedRes.length) {
        setCompletedPayouts(completedRes);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error('Error loading pending and completed payouts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on component mount and tab change
  useEffect(() => {
    loadPayouts();
  }, [activeTab, currentPage, loadPayouts]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleMoveToCompleted = async (payout) => {
    const payload = {
      vendor_id: payout.vendor_id,
      payout_mode: 'account',
      booking_ids: [{ type: payout.type, id: payout.booking_id }],
    };

    exportSinglePayoutToPDF(payout);
    const response = await payoutService.markPayoutCompleted(payload);
    if (Object.entries(response).length) {
      toast.success('PDF exported successfully and moved to completed.');
      loadPayouts();
    }
  };

  // Generate and download PDF for a single payout
  const exportSinglePayoutToPDF = (payout) => {
    console.log(payout);
    return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;

        // Add title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Payout Details Report', margin, 30);

        // Add generation date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          pageWidth - 60,
          30
        );

        // Vendor Information Section
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

        // Payout Information Section
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
          [
            'Admin Commission:',
            payout.admin_commission
              ? ` ${payout.admin_commission.toLocaleString()}`
              : 'Not provided',
          ],
          ['Category:', payout.type || 'Not provided'],
        ];

        payoutInfo.forEach(([label, value]) => {
          yPosition += 8;
          doc.setFont('helvetica', 'bold');
          doc.text(label, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(value, margin + 40, yPosition);
        });

        // Booking Information Section
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

        // Summary Section
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

        const totalAmount =
          (payout.amount || 0) + (payout.admin_commission || 0);

        const summaryData = [
          ['Total Amount', `${totalAmount.toLocaleString()}`],
          [
            'Payout Amount',
            payout.amount ? `${payout.amount.toLocaleString()}` : '0',
          ],
          [
            'Admin Commission',
            payout.admin_commission
              ? `${payout.admin_commission.toLocaleString()}`
              : '0',
          ],
          ['Payment Method', payout.payoutMode || 'Not specified'],
          ['Status', payout.completedDate ? 'Completed' : 'Pending'],
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

        // Add footer
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

        // Save the PDF
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

  const currentPayouts =
    activeTab === 'pending' ? pendingPayouts : completedPayouts;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-2xl font-semibold text-gray-900'>Pay out</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Tabs */}
        <div className='mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8'>
              <button
                onClick={() => handleTabChange('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                <div className='flex items-center'>
                  <Clock className='h-4 w-4 mr-2' />
                  Pending Payouts
                  {pendingPayouts.length > 0 && (
                    <span className='ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs'>
                      {pendingPayouts.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => handleTabChange('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                <div className='flex items-center'>
                  <CheckCircle className='h-4 w-4 mr-2' />
                  Completed Payouts
                  {completedPayouts.length > 0 && (
                    <span className='ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs'>
                      {completedPayouts.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
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
                      {pendingPayouts.length}
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
                  <CheckCircle className='h-8 w-8 text-green-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Completed Payouts
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {completedPayouts.length}
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
                      {pendingPayouts
                        .reduce(
                          (sum, payout) => sum + (payout.payoutAmount || 0),
                          0
                        )
                        .toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'pending' ? (
          <PendingPayoutTable
            payouts={currentPayouts}
            onExportPayout={handleMoveToCompleted}
            isLoading={isLoading}
          />
        ) : (
          <CompletedPayoutTable
            payouts={currentPayouts}
            isLoading={isLoading}
          />
        )}

        {/* Pagination */}
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
