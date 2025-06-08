import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Hash,
  FileText,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

const PayoutDetailsModal = ({
  payout,
  isOpen,
  onClose,
  onExportPayout,
  type = 'pending',
}) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !payout) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Generate and download the PDF
      await exportToPDF();

      // Only move to completed if this is a pending payout
      if (type === 'pending') {
        onExportPayout(payout);
      }

      // Close the modal after successful export
      onClose();
    } catch (error) {
      console.error('Error during export:', error);
      alert('Failed to export PDF. Please try again.');
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
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

        if (type === 'completed' && payout.completedDate) {
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

        // Additional Details Section (if available)
        if (payout.payoutNarration || payout.notes) {
          yPosition += 20;
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Additional Details', margin, yPosition);

          yPosition += 15;
          autoTable(doc, {
            startY: yPosition,
            head: [['Field', 'Details']],
            body: [
              [
                'Payout Narration',
                payout.payoutNarration || 'No narration provided',
              ],
              ['Notes', payout.notes || 'No notes provided'],
            ],
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38] }, // Red color to match the theme
            margin: { left: margin, right: margin },
            styles: { fontSize: 10 },
            columnStyles: {
              0: { cellWidth: 40 },
              1: { cellWidth: 130 },
            },
          });

          yPosition = doc.lastAutoTable.finalY + 20;
        } else {
          yPosition += 20;
        }

        // Summary Section
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 30;
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
          ['Status', type === 'completed' ? 'Completed' : 'Pending'],
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
          alert('PDF exported successfully!');
          setIsExporting(false);
          resolve();
        }, 1000);
      } catch (error) {
        console.error('Error exporting PDF:', error);
        setIsExporting(false);
        reject(error);
      }
    });
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Payout Details
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 p-1 rounded'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Vendor Information */}
          <div className='bg-gray-50 rounded-lg p-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
              <User className='h-5 w-5 mr-2' />
              Vendor Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Vendor Name
                </label>
                <p className='text-sm text-gray-900'>{payout.vendorName}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center'>
                  <Mail className='h-4 w-4 mr-1' />
                  Email ID
                </label>
                <p className='text-sm text-gray-900'>{payout.emailId}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center'>
                  <Phone className='h-4 w-4 mr-1' />
                  Phone Number
                </label>
                <p className='text-sm text-gray-900'>{payout.phoneNumber}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Vendor ID
                </label>
                <p className='text-sm text-gray-900'>{payout.vendorId}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className='bg-blue-50 rounded-lg p-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
              <CreditCard className='h-5 w-5 mr-2' />
              Payment Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  IFSC Code
                </label>
                <p className='text-sm text-gray-900 font-mono'>
                  {payout.ifscCode}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Payout Mode
                </label>
                <p className='text-sm text-gray-900'>{payout.payoutMode}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Payout Amount
                </label>
                <p className='text-lg font-semibold text-green-600'>
                  ₹{payout.payoutAmount?.toLocaleString()}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Admin Commission
                </label>
                <p className='text-lg font-semibold text-red-600'>
                  ₹{payout.adminCommission?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className='bg-yellow-50 rounded-lg p-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
              <Hash className='h-5 w-5 mr-2' />
              Booking Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Booking ID
                </label>
                <p className='text-sm text-gray-900 font-mono'>
                  {payout.bookingId}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Category
                </label>
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {payout.category}
                </span>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center'>
                  <Calendar className='h-4 w-4 mr-1' />
                  Booking Date
                </label>
                <p className='text-sm text-gray-900'>
                  {payout.bookingDate
                    ? new Date(payout.bookingDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              {type === 'completed' && payout.completedDate && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center'>
                    <Calendar className='h-4 w-4 mr-1' />
                    Completed Date
                  </label>
                  <p className='text-sm text-gray-900'>
                    {new Date(payout.completedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Total Summary */}
          <div className='bg-gray-100 rounded-lg p-4'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-medium text-gray-900'>
                Total Amount:
              </span>
              <span className='text-2xl font-bold text-gray-900'>
                ₹
                {(
                  (payout.payoutAmount || 0) + (payout.adminCommission || 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t bg-gray-50'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'>
            Close
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className='px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed'>
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
                {type === 'pending' ? 'Export to PDF' : 'Download PDF'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutDetailsModal;
