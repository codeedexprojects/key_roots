import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getUserById } from '../services/userService';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const UserDetailsPage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('bookings');

  // State for API data
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest, 'asc' for oldest
  const [selectedState, setSelectedState] = useState('');
  const [availableStates, setAvailableStates] = useState([]);

  // Pagination states
  const [currentPageBookings, setCurrentPageBookings] = useState(1);
  const [currentPageRewards, setCurrentPageRewards] = useState(1);
  const itemsPerPage = 5;

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // PDF Export Function
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Set up the document
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('User Details Report', 20, 20);

      // User basic info
      doc.setFontSize(14);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

      let yPosition = 55;

      // Personal Information Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Personal Information', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);

      const personalInfo = [
        ['User Name:', user?.name || 'N/A'],
        ['User ID:', `ID-${user?.userId || 'N/A'}`],
        ['Phone Number:', user?.phone || 'N/A'],
        ['Email ID:', user?.email || 'N/A'],
        ['Location:', user?.location || 'N/A'],
        ['Address:', user?.address || 'N/A'],
      ];

      personalInfo.forEach(([label, value]) => {
        doc.text(label, 20, yPosition);
        doc.text(value, 80, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Statistics Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Statistics', 20, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);

      const stats = [
        ['Total Bookings:', user?.totalBookings?.toString() || '0'],
        ['Total Rewards:', user?.totalRewards?.toString() || '0'],
      ];

      stats.forEach(([label, value]) => {
        doc.text(label, 20, yPosition);
        doc.text(value, 80, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // Bookings Table
      if (bookings && bookings.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Booking History', 20, yPosition);
        yPosition += 10;

        const bookingTableData = bookings.map((booking) => [
          booking.start_date,
          `#${booking.id}`,
          booking.booking_status,
          booking.trip_status,
          booking.total,
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [
            [
              'Start Date',
              'Order ID',
              'Booking Status',
              'Trip Status',
              'Amount',
            ],
          ],
          body: bookingTableData,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [248, 248, 248],
          },
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }

      // Add page break if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Rewards Section (if available)
      const rewards = user?.rewards || [];
      if (rewards.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Rewards History', 20, yPosition);
        yPosition += 10;

        const rewardsTableData = rewards.map((reward, index) => [
          `#${reward.id || index + 1}`,
          reward.type || 'Loyalty Points',
          reward.points || '100',
          reward.date || new Date().toLocaleDateString(),
          reward.status || 'Active',
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Reward ID', 'Type', 'Points', 'Date', 'Status']],
          body: rewardsTableData,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [248, 248, 248],
          },
        });
      }

      // Save the PDF
      doc.save(`User_${user?.name || userId}_Details.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPageBookings(1);
  }, [searchTerm, selectedState, sortOrder]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await getUserById(userId);
        console.log(response);
        if (response && !response.error) {
          // Transform user data
          const userData = {
            id: userId,
            name: response.personal_info?.name || 'Unknown',
            userId: userId,
            phone: response.personal_info?.phone_number || 'Not available',
            email: response.personal_info?.email || 'Not available',
            location: response.personal_info?.location || 'Not available',
            address: response.personal_info?.address || 'Not available',
            totalBookings: response.total_booking_count || 0,
            totalRewards: response.rewards_count || 0,
          };

          setUser(userData);

          // Set bookings data
          if (response.bookings && Array.isArray(response.bookings)) {
            const transformedBookings = response.bookings.map((booking) => ({
              id: booking.id || '000000',
              orderId: `#${booking.id || '000000'}`,
              start_date: booking.start_date || 'N/A',
              booking_status: booking.booking_status || 'Pending',
              trip_status: booking.trip_status || 'Unknown',
              total: booking.total_amount ? `₹${booking.total_amount}` : '₹0',
              state: booking.state || '',
            }));
            setBookings(transformedBookings);

            // Extract unique states from bookings
            const states = Array.from(
              new Set(response.bookings.map((b) => b.state))
            ).filter(Boolean);
            setAvailableStates(states);
          } else {
            setBookings([]);
            setAvailableStates([]);
          }
        } else {
          setError(response?.message || 'Failed to load user details');
          toast.error(response?.message || 'Failed to load user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details. Please try again later.');
        toast.error('Failed to load user details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div className='min-h-screen'>
      <div className='mb-6 flex item-center justify-between'>
        <h1 className='text-2xl font-semibold'>User Details</h1>

        <Link
          to='/admin/users'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Go Back</span>
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
      ) : !user ? (
        <EmptyState
          title='User not found'
          description='The requested user could not be found.'
          icon='default'
        />
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='bg-white rounded-md shadow-sm p-6'>
            <div className='flex flex-col items-center mb-6'>
              <img
                src='https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
                alt={user.name}
                className='w-24 h-24 rounded-md bg-gray-200 object-cover mb-4'
              />
              <h2 className='text-xl font-semibold'>{user.name}</h2>
              <p className='text-gray-500 text-sm'>ID-{user.userId}</p>
              <p className='text-gray-500 text-sm mt-1'>{user.location}</p>
            </div>

            <div className='border-t pt-4 space-y-4'>
              <h3 className='font-semibold text-lg mb-2'>
                Personal Information
              </h3>
              {[
                { label: 'User Name', value: user.name },
                { label: 'Phone Number', value: user.phone },
                { label: 'Email ID', value: user.email },
                { label: 'Location', value: user.location },
                { label: 'Address', value: user.address },
              ].map((item) => (
                <div key={item.label}>
                  <p className='text-gray-500 text-sm'>{item.label}</p>
                  <p className='font-medium'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='lg:col-span-2 space-y-6'>
            <div className='flex justify-end gap-2'>
              <button
                onClick={exportToPDF}
                className='px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50'>
                Export PDF
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                {
                  label: 'Total Bookings',
                  value: user.totalBookings,
                },
                {
                  label: 'Rewards',
                  value: user.totalRewards,
                },
              ].map(({ label, value }) => (
                <div
                  className='bg-white p-4 rounded-md shadow-sm'
                  key={`${label}-${value}`}>
                  <div className='flex items-center gap-2'>
                    <div className='h-5 w-5 text-gray-500'>📄</div>
                    <h3 className='text-gray-600 text-sm'>{label}</h3>
                  </div>
                  <div className='mt-2 flex items-baseline'>
                    <p className='text-2xl font-semibold'>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='bg-white rounded-md shadow-sm'>
              <div className='border-b flex'>
                {['bookings', 'rewards'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {tab === 'bookings' ? 'Total Booking' : 'Total Rewards'}
                  </button>
                ))}
              </div>

              <div className='p-4'>
                {/* Filters */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4'>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm w-full md:w-64 relative'
                  />
                  <div className='flex gap-2'>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm appearance-none cursor-pointer'>
                      <option value='desc'>Newest</option>
                      <option value='asc'>Oldest</option>
                    </select>

                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      disabled={availableStates.length === 0}
                      className={`px-3 py-2 border border-gray-300 rounded-md bg-white text-sm appearance-none cursor-pointer ${
                        availableStates.length === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}>
                      <option value=''>All States</option>
                      {availableStates.map((state) => (
                        <option
                          key={state}
                          value={state}>
                          {state.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table */}
                {activeTab === 'bookings' ? (
                  bookings.length === 0 ? (
                    <EmptyState
                      title='No bookings found'
                      description='This user has no bookings yet.'
                      icon='default'
                    />
                  ) : (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                          <tr>
                            {[
                              'Start Date',
                              'Order ID',
                              'Booking Status',
                              'Trip Status',
                              'Amount',
                            ].map((header) => (
                              <th
                                key={header}
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {(() => {
                            const filteredBookings = bookings
                              .filter(
                                (b) =>
                                  (!selectedState ||
                                    b.state === selectedState) &&
                                  (!searchTerm ||
                                    b.package_name
                                      ?.toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    b.booking_status
                                      ?.toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    b.trip_status
                                      ?.toLowerCase()
                                      .includes(searchTerm.toLowerCase()) ||
                                    String(b.id).includes(searchTerm))
                              )
                              .sort((a, b) => {
                                const dateA = new Date(a.start_date);
                                const dateB = new Date(b.start_date);
                                return sortOrder === 'desc'
                                  ? dateB - dateA
                                  : dateA - dateB;
                              });

                            const paginatedBookings = filteredBookings.slice(
                              (currentPageBookings - 1) * itemsPerPage,
                              currentPageBookings * itemsPerPage
                            );

                            if (filteredBookings.length === 0) {
                              return (
                                <tr>
                                  <td
                                    colSpan='5'
                                    className='px-4 py-8 text-center text-gray-500'>
                                    No results found for the current filters.
                                  </td>
                                </tr>
                              );
                            }

                            return paginatedBookings.map((row, i) => (
                              <tr
                                key={i}
                                className='hover:bg-gray-50'>
                                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {row.start_date}
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  #{row.id}
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {row.booking_status}
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {row.trip_status}
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {row.total}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>

                      {/* Pagination Controls for Bookings */}
                      {(() => {
                        const filteredBookings = bookings.filter(
                          (b) =>
                            (!selectedState || b.state === selectedState) &&
                            (!searchTerm ||
                              b.package_name
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              b.booking_status
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              b.trip_status
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              String(b.id).includes(searchTerm))
                        );

                        const totalPagesBookings = Math.ceil(
                          filteredBookings.length / itemsPerPage
                        );

                        return totalPagesBookings > 1 ? (
                          <div className='mt-4 flex justify-center'>
                            <div className='flex space-x-1'>
                              <button
                                onClick={() =>
                                  setCurrentPageBookings((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPageBookings === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                                  currentPageBookings === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}>
                                <span className='sr-only'>Previous</span>
                                <ChevronLeft className='h-5 w-5' />
                              </button>

                              {[...Array(totalPagesBookings)].map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPageBookings(i + 1)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                    currentPageBookings === i + 1
                                      ? 'bg-primary text-white'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  } rounded-md`}>
                                  {i + 1}
                                </button>
                              ))}

                              <button
                                onClick={() =>
                                  setCurrentPageBookings((prev) =>
                                    Math.min(prev + 1, totalPagesBookings)
                                  )
                                }
                                disabled={
                                  currentPageBookings === totalPagesBookings
                                }
                                className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                                  currentPageBookings === totalPagesBookings
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}>
                                <span className='sr-only'>Next</span>
                                <ChevronRight className='h-5 w-5' />
                              </button>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )
                ) : (
                  (() => {
                    // Mock rewards data for demonstration
                    const rewards = user.rewards || [];

                    if (rewards.length === 0) {
                      return (
                        <EmptyState
                          title='No rewards found'
                          description='This user has no rewards yet.'
                          icon='default'
                        />
                      );
                    }

                    const totalPagesRewards = Math.ceil(
                      rewards.length / itemsPerPage
                    );

                    const paginatedRewards = rewards.slice(
                      (currentPageRewards - 1) * itemsPerPage,
                      currentPageRewards * itemsPerPage
                    );

                    return (
                      <div>
                        <div className='overflow-x-auto'>
                          <table className='min-w-full divide-y divide-gray-200'>
                            <thead>
                              <tr>
                                {[
                                  'Reward ID',
                                  'Type',
                                  'Points',
                                  'Date',
                                  'Status',
                                ].map((header) => (
                                  <th
                                    key={header}
                                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                              {paginatedRewards.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan='5'
                                    className='px-4 py-8 text-center text-gray-500'>
                                    No rewards found.
                                  </td>
                                </tr>
                              ) : (
                                paginatedRewards.map((reward, i) => (
                                  <tr
                                    key={i}
                                    className='hover:bg-gray-50'>
                                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                      #{reward.id || i + 1}
                                    </td>
                                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                      {reward.type || 'Loyalty Points'}
                                    </td>
                                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                      {reward.points || '100'}
                                    </td>
                                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                                      {reward.date ||
                                        new Date().toLocaleDateString()}
                                    </td>
                                    <td className='px-4 py-4 whitespace-nowrap text-sm text-green-500'>
                                      {reward.status || 'Active'}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Controls for Rewards */}
                        {totalPagesRewards > 1 && (
                          <div className='mt-4 flex justify-center'>
                            <div className='flex space-x-1'>
                              <button
                                onClick={() =>
                                  setCurrentPageRewards((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPageRewards === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                                  currentPageRewards === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}>
                                <span className='sr-only'>Previous</span>
                                <ChevronLeft className='h-5 w-5' />
                              </button>

                              {[...Array(totalPagesRewards)].map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPageRewards(i + 1)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                    currentPageRewards === i + 1
                                      ? 'bg-primary text-white'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  } rounded-md`}>
                                  {i + 1}
                                </button>
                              ))}

                              <button
                                onClick={() =>
                                  setCurrentPageRewards((prev) =>
                                    Math.min(prev + 1, totalPagesRewards)
                                  )
                                }
                                disabled={
                                  currentPageRewards === totalPagesRewards
                                }
                                className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                                  currentPageRewards === totalPagesRewards
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}>
                                <span className='sr-only'>Next</span>
                                <ChevronRight className='h-5 w-5' />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
