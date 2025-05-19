import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { getAllVendors } from '../services/vendorService';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { useToast } from '@/components/ui/toast-provider';
import { getImageUrl } from '@/lib/getImageUrl';

export const VendorsListPage = () => {
  const { addToast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterState, setFilterState] = useState('all');

  // Data state
  const [vendors, setVendors] = useState([]);
  const [vendorStats, setVendorStats] = useState({
    total_vendors: 0,
    active_vendors: 0,
    inactive_vendors: 0,
    total_buses: 0,
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendors data
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        // Fetch vendors
        const response = await getAllVendors();
        console.log(response);
        if (response && response.data) {
          const transformedVendors = response.data.map((vendor) => ({
            id: vendor.user_id,
            name: vendor.travels_name,
            location: vendor.location || vendor.city,
            state: vendor.state || 'Unknown',
            busesCount: vendor.bus_count || 0,
            packagesCount: vendor.package_count || 0,
            availableBuses: vendor.buses?.length || 0,
            ongoingBuses: vendor.ongoing_buses?.length || 0,
            bookings: vendor.buses?.length || 0,
            earnings: vendor.earnings || 0,
            status: vendor.is_active ? 'active' : 'inactive',
            image:
              vendor.buses?.[0]?.travels_logo ||
              '/placeholder.svg?height=48&width=48',
          }));
          setVendors(transformedVendors);

          // Calculate stats
          const totalVendors = transformedVendors.length;
          const activeVendors = transformedVendors.filter(
            (v) => v.status === 'active'
          ).length;
          const inactiveVendors = transformedVendors.filter(
            (v) => v.status === 'inactive'
          ).length;
          const totalBuses = transformedVendors.reduce(
            (sum, v) => sum + v.busesCount,
            0
          );

          setVendorStats({
            total_vendors: totalVendors,
            active_vendors: activeVendors,
            inactive_vendors: inactiveVendors,
            total_buses: totalBuses,
          });
        } else {
          setError('Failed to load vendors');
          addToast({
            title: 'Error',
            message: 'Failed to load vendors',
            type: 'error',
          });
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors. Please try again later.');
        addToast({
          title: 'Error',
          message: 'Failed to load vendors. Please try again later.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [addToast]);

  // Process vendors with filtering and sorting
  let processedVendors = [...vendors];

  // Apply search filter
  if (searchTerm.trim() !== '') {
    processedVendors = processedVendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply state filter
  if (filterState !== 'all') {
    processedVendors = processedVendors.filter(
      (vendor) => vendor.state.toLowerCase() === filterState.toLowerCase()
    );
  }

  // Apply sorting
  processedVendors.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'location') return a.location.localeCompare(b.location);
    if (sortBy === 'state') return a.state.localeCompare(b.state);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    if (sortBy === 'earnings') return b.earnings - a.earnings;
    if (sortBy === 'buses') return b.busesCount - a.busesCount;
    return 0;
  });

  // Pagination
  const vendorsPerPage = 6;
  const totalPages = Math.ceil(processedVendors.length / vendorsPerPage);
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = processedVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>Vendors</h1>
        <Link
          to='/vendors/create'
          className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          <Plus className='h-4 w-4 mr-2' />
          Add Vendor
        </Link>
      </div>

      {/* Vendor Stats */}
      {loading ? (
        <div className='flex justify-center items-center min-h-[100px]'>
          <LoadingSpinner size='medium' />
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {[
            {
              label: 'Total Vendors',
              value: vendorStats.total_vendors,
              icon: 'vendor',
            },
            {
              label: 'Active Vendors',
              value: vendorStats.active_vendors,
              icon: 'active',
            },
            {
              label: 'Inactive Vendors',
              value: vendorStats.inactive_vendors,
              icon: 'inactive',
            },
            {
              label: 'Total Buses',
              value: vendorStats.total_buses,
              icon: 'bus',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className='bg-white p-4 rounded-md shadow-sm'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-gray-500 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d={
                      stat.icon === 'vendor'
                        ? 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                        : stat.icon === 'active'
                        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : stat.icon === 'inactive'
                        ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                    }
                  />
                </svg>
                <h3 className='text-gray-600 text-sm'>{stat.label}</h3>
              </div>
              <div className='mt-2 flex items-baseline'>
                <p className='text-2xl font-semibold'>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='bg-white rounded-md shadow-sm p-4'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4'>
          <h2 className='text-lg font-semibold'>Vendor List</h2>
          <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto'>
            <div className='relative w-full md:w-64'>
              <input
                type='text'
                placeholder='Search Vendors'
                className='pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm w-full'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
            </div>
            <div className='flex gap-2'>
              <div className='relative'>
                <select
                  className='appearance-none pl-4 pr-10 py-2 border rounded-md text-sm'
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  <option value='name'>Sort by: Name</option>
                  <option value='location'>Sort by: Location</option>
                  <option value='state'>Sort by: State</option>
                  <option value='status'>Sort by: Status</option>
                  <option value='buses'>Sort by: Buses</option>
                </select>
                <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
              </div>

              {/* State Filter Dropdown */}
              <div className='relative'>
                <select
                  className='appearance-none pl-4 pr-10 py-2 border rounded-md text-sm'
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}>
                  <option value='all'>Filter by: All States</option>
                  {Array.from(
                    new Set(vendors.map((v) => v.state).filter(Boolean))
                  ).map((state) => (
                    <option
                      key={state}
                      value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className='flex justify-center items-center min-h-[100px]'>
            <LoadingSpinner size='medium' />
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : processedVendors.length === 0 ? (
          <EmptyState
            title='No vendors found'
            description='There are no vendors matching your criteria.'
            icon='default'
          />
        ) : (
          <div className='overflow-x-auto min-h-[400px]'>
            <table className='min-w-full lg:table-fixed divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-16'>
                    ID
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-48'>
                    Vendor
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-40'>
                    Location
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-40 hidden md:table-cell'>
                    State
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-32'>
                    Buses
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto lg:w-32'>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-gray-200'>
                {currentVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className='hover:bg-gray-50 cursor-pointer'
                    onClick={() =>
                      (window.location.href = `/vendors/${vendor.id}`)
                    }>
                    <td className='px-4 py-4 text-sm text-gray-500 w-auto lg:w-16'>
                      {vendor.id}
                    </td>
                    {console.log('vendor', vendor)}
                    <td className='px-4 py-4 w-auto lg:w-48 truncate'>
                      <div className='flex items-center'>
                        <img
                          className='h-10 w-10 rounded-md flex-shrink-0'
                          src={
                            vendor.image !==
                            '/placeholder.svg?height=48&width=48'
                              ? getImageUrl(vendor.image)
                              : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
                          }
                          alt={vendor.name}
                        />
                        <div className='ml-4 w-full'>
                          <div
                            className='text-sm font-medium text-gray-900 truncate'
                            title={vendor.name}>
                            {vendor.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className='px-4 py-4 text-sm text-gray-500 truncate w-auto lg:w-40'
                      title={vendor.location}>
                      {vendor.location || 'Not specified'}
                    </td>
                    <td
                      className='px-4 py-4 text-sm text-gray-500 truncate hidden md:table-cell w-auto lg:w-40'
                      title={vendor.state}>
                      {vendor.state || 'Not specified'}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500 w-auto lg:w-32'>
                      {vendor.busesCount}
                    </td>
                    <td className='px-4 py-4 w-auto lg:w-32'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vendor.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {vendor.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {processedVendors.length > 0 && (
          <div className='flex justify-between items-center border-t border-gray-200 px-4 py-3 mt-4'>
            <p className='text-sm text-gray-700'>
              Showing {indexOfFirstVendor + 1}–
              {Math.min(indexOfLastVendor, processedVendors.length)} of{' '}
              {processedVendors.length} vendors
            </p>

            <div className='flex items-center space-x-2'>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <ChevronLeft className='h-5 w-5' />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <ChevronRight className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
