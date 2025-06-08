import { useState, useEffect, useCallback } from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import PayoutTable from '../components/PayoutTable';
import PayoutDetailsModal from '../components/PayoutDetailsModal';
import { mockPayoutData } from '../services/payoutService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PayoutPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [completedPayouts, setCompletedPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Load payouts data
  const loadPayouts = useCallback(async (type = 'pending', page = 1) => {
    setIsLoading(true);
    try {
      // Using mock data for now - replace with actual API calls
      if (type === 'pending') {
        // const response = await payoutService.getPendingPayouts(page)
        setPendingPayouts(mockPayoutData.pending);
        setTotalPages(1);
      } else {
        // const response = await payoutService.getCompletedPayouts(page)
        setCompletedPayouts(mockPayoutData.completed);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading payouts:', error);
      // Handle error - show toast notification
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on component mount and tab change
  useEffect(() => {
    loadPayouts(activeTab, currentPage);
  }, [activeTab, currentPage, loadPayouts]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle view details
  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
    setIsDetailsModalOpen(true);
  };

  // Handle export to PDF for a single payout
  const handleExportPayout = async (payout, moveToCompleted = true) => {
    try {
      // If this is a pending payout and we need to move it to completed
      if (moveToCompleted && activeTab === 'pending') {
        await movePayoutToCompleted(payout);
        alert('Payout exported successfully and moved to completed!');
      }
    } catch (error) {
      console.error('Error exporting payout:', error);
      alert('Error processing payout. Please try again.');
    }
  };

  // Generate and download PDF for a single payout
  const exportSinglePayoutToPDF = (payout) => {
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
          ['Vendor Name:', payout.vendorName || 'Not provided'],
          ['Email ID:', payout.emailId || 'Not provided'],
          ['Phone Number:', payout.phoneNumber || 'Not provided'],
          ['Vendor ID:', payout.vendorId || 'Not provided'],
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
          ['IFSC Code:', payout.ifscCode || 'Not provided'],
          ['Payout Mode:', payout.payoutMode || 'Not provided'],
          [
            'Payout Amount:',
            payout.payoutAmount
              ? `₹${payout.payoutAmount.toLocaleString()}`
              : 'Not provided',
          ],
          [
            'Admin Commission:',
            payout.adminCommission
              ? `₹${payout.adminCommission.toLocaleString()}`
              : 'Not provided',
          ],
          ['Category:', payout.category || 'Not provided'],
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
          ['Booking ID:', payout.bookingId || 'Not provided'],
          [
            'Booking Date:',
            payout.bookingDate
              ? new Date(payout.bookingDate).toLocaleDateString()
              : 'Not provided',
          ],
        ];

        if (payout.completedDate) {
          bookingInfo.push([
            'Completed Date:',
            payout.completedDate
              ? new Date(payout.completedDate).toLocaleDateString()
              : 'Not provided',
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
          (payout.payoutAmount || 0) + (payout.adminCommission || 0);

        const summaryData = [
          ['Total Amount', `₹${totalAmount.toLocaleString()}`],
          [
            'Payout Amount',
            payout.payoutAmount
              ? `₹${payout.payoutAmount.toLocaleString()}`
              : '₹0',
          ],
          [
            'Admin Commission',
            payout.adminCommission
              ? `₹${payout.adminCommission.toLocaleString()}`
              : '₹0',
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
          headStyles: { fillColor: [220, 38, 38] }, // Red color to match the theme
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
        const filename = `payout-details-${payout.vendorName.replace(
          /\s+/g,
          '-'
        )}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        // Wait a moment to ensure the download has started
        setTimeout(() => {
          resolve();
        }, 1000);
      } catch (error) {
        console.error('Error exporting PDF:', error);
        reject(error);
      }
    });
  };

  // Move payout to completed
  const movePayoutToCompleted = async (payout) => {
    try {
      // Mark as completed in backend
      // await payoutService.markPayoutCompleted(payout.id)

      // Update local state
      const completedPayout = {
        ...payout,
        completedDate: new Date().toISOString(),
      };

      setPendingPayouts((prev) => prev.filter((p) => p.id !== payout.id));
      setCompletedPayouts((prev) => [...prev, completedPayout]);

      return true;
    } catch (error) {
      console.error('Error moving payout to completed:', error);
      throw error;
    }
  };

  // Export all pending payouts
  const handleExportAll = async () => {
    if (pendingPayouts.length === 0) {
      alert('No pending payouts to export');
      return;
    }

    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;

      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('All Pending Payouts Report', margin, 30);

      // Add generation date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth - 60,
        30
      );

      // Add summary
      let yPosition = 50;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', margin, yPosition);

      yPosition += 10;

      const totalAmount = pendingPayouts.reduce(
        (sum, payout) => sum + (payout.payoutAmount || 0),
        0
      );
      const totalCommission = pendingPayouts.reduce(
        (sum, payout) => sum + (payout.adminCommission || 0),
        0
      );

      const summaryData = [
        ['Total Pending Payouts', pendingPayouts.length.toString()],
        ['Total Payout Amount', `₹${totalAmount.toLocaleString()}`],
        ['Total Admin Commission', `₹${totalCommission.toLocaleString()}`],
        ['Grand Total', `₹${(totalAmount + totalCommission).toLocaleString()}`],
        ['Generated Date', new Date().toLocaleDateString()],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Description', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] }, // Red color to match the theme
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 },
      });

      yPosition = doc.lastAutoTable.finalY + 20;

      // Add all payouts table
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Pending Payouts', margin, yPosition);

      yPosition += 10;

      const tableHeaders = [
        'Vendor Name',
        'Email ID',
        'Phone',
        'IFSC Code',
        'Mode',
        'Amount (₹)',
        'Commission (₹)',
        'Category',
      ];

      const tableData = pendingPayouts.map((payout) => [
        payout.vendorName || '-',
        payout.emailId || '-',
        payout.phoneNumber || '-',
        payout.ifscCode || '-',
        payout.payoutMode || '-',
        payout.payoutAmount?.toLocaleString() || '0',
        payout.adminCommission?.toLocaleString() || '0',
        payout.category || '-',
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] }, // Red color to match the theme
        margin: { left: margin, right: margin },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 30 }, // Vendor name
          1: { cellWidth: 40 }, // Email
          5: { cellWidth: 20 }, // Amount
          6: { cellWidth: 20 }, // Commission
        },
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
      doc.save(
        `all-pending-payouts-${new Date().toISOString().split('T')[0]}.pdf`
      );

      // Ask if user wants to mark all as completed
      if (
        confirm(
          'PDF exported successfully! Do you want to mark all payouts as completed?'
        )
      ) {
        // Move all pending payouts to completed
        const completedPayouts = pendingPayouts.map((payout) => ({
          ...payout,
          completedDate: new Date().toISOString(),
        }));

        setCompletedPayouts((prev) => [...prev, ...completedPayouts]);
        setPendingPayouts([]);
      }
    } catch (error) {
      console.error('Error exporting all payouts:', error);
      alert('Error exporting payouts. Please try again.');
    } finally {
      setIsExporting(false);
    }
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
            <div className='flex items-center space-x-3'>
              {activeTab === 'pending' && pendingPayouts.length > 0 && (
                <button
                  onClick={handleExportAll}
                  disabled={isExporting || isLoading}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'>
                  {isExporting ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileText className='h-4 w-4 mr-2' />
                      Export All PDF
                    </>
                  )}
                </button>
              )}
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
                      ₹
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

        {/* Payouts Table */}
        <PayoutTable
          payouts={currentPayouts}
          onViewDetails={handleViewDetails}
          onExportPayout={handleExportPayout}
          isLoading={isLoading}
          type={activeTab}
        />

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

      {/* Payout Details Modal */}
      <PayoutDetailsModal
        payout={selectedPayout}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPayout(null);
        }}
        onExportPayout={handleExportPayout}
        type={activeTab}
      />
    </div>
  );
};

export default PayoutPage;
