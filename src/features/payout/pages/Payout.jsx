import { useState } from 'react';
import { Download, Search, Bell, User } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const PayoutPage = () => {
  const [formData, setFormData] = useState({
    ifscCode: '',
    payoutAmount: '',
    payoutMode: '',
    phoneNumber: '',
    emailId: '',
    customerId: '',
    payId: '',
    payoutNarration: '',
    notes: '',
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const exportToPDF = async () => {
    setIsExporting(true);
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

      // Payout Information Section
      let yPosition = 50;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Payout Information', margin, yPosition);

      yPosition += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      const payoutInfo = [
        ['IFSC Code:', formData.ifscCode || 'Not provided'],
        ['Payout Amount:', formData.payoutAmount || 'Not provided'],
        ['Payout Mode:', formData.payoutMode || 'Not provided'],
        ['Phone Number:', formData.phoneNumber || 'Not provided'],
        ['Email ID:', formData.emailId || 'Not provided'],
        ['Customer ID:', formData.customerId || 'Not provided'],
        ['Pay ID:', formData.payId || 'Not provided'],
      ];

      payoutInfo.forEach(([label, value]) => {
        yPosition += 8;
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + 40, yPosition);
      });

      // Payout Details Section
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
            formData.payoutNarration || 'No narration provided',
          ],
          ['Notes', formData.notes || 'No notes provided'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 130 },
        },
      });

      yPosition = doc.lastAutoTable.finalY + 20;

      // Summary Section
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', margin, yPosition);

      yPosition += 10;

      const summaryData = [
        [
          'Total Amount',
          formData.payoutAmount ? `₹${formData.payoutAmount}` : '₹0',
        ],
        ['Payment Method', formData.payoutMode || 'Not specified'],
        ['Status', 'Pending'],
        ['Generated Date', new Date().toLocaleDateString()],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Description', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
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
      doc.save(`payout-details-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='flex-1 p-8'>
      <div className='bg-white rounded-lg shadow-sm'>
        {/* Header with Export Button */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h1 className='text-2xl font-semibold text-gray-900'>Pay out</h1>
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'>
            {isExporting ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className='h-4 w-4 mr-2' />
                Export Excel
              </>
            )}
          </button>
        </div>

        {/* Form */}
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Left Column - Mandatory Fields */}
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='ifscCode'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  IFSC Code (Mandatory)
                </label>
                <input
                  type='text'
                  id='ifscCode'
                  name='ifscCode'
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter IFSC Code'
                />
              </div>

              <div>
                <label
                  htmlFor='payoutMode'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Pay out Mode (Mandatory)
                </label>
                <input
                  type='text'
                  id='payoutMode'
                  name='payoutMode'
                  value={formData.payoutMode}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter payout mode'
                />
              </div>

              <div>
                <label
                  htmlFor='emailId'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Email id (Optional)
                </label>
                <input
                  type='email'
                  id='emailId'
                  name='emailId'
                  value={formData.emailId}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter email address'
                />
              </div>

              <div>
                <label
                  htmlFor='payId'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Pay id (Optional)
                </label>
                <input
                  type='text'
                  id='payId'
                  name='payId'
                  value={formData.payId}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter pay ID'
                />
              </div>

              <div>
                <label
                  htmlFor='notes'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Notes (Optional)
                </label>
                <textarea
                  id='notes'
                  name='notes'
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter any additional notes'
                />
              </div>
            </div>

            {/* Right Column - Optional Fields */}
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='payoutAmount'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Pay out Amount (Mandatory)
                </label>
                <input
                  type='number'
                  id='payoutAmount'
                  name='payoutAmount'
                  value={formData.payoutAmount}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter amount'
                />
              </div>

              <div>
                <label
                  htmlFor='phoneNumber'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone number (Optional)
                </label>
                <input
                  type='tel'
                  id='phoneNumber'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter phone number'
                />
              </div>

              <div>
                <label
                  htmlFor='customerId'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Customer id (Optional)
                </label>
                <input
                  type='text'
                  id='customerId'
                  name='customerId'
                  value={formData.customerId}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter customer ID'
                />
              </div>

              <div>
                <label
                  htmlFor='payoutNarration'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Pay out Narration (Optional)
                </label>
                <textarea
                  id='payoutNarration'
                  name='payoutNarration'
                  value={formData.payoutNarration}
                  onChange={handleInputChange}
                  rows={6}
                  className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  placeholder='Enter payout narration'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
