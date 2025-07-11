import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import { getAllVendors } from '../services/vendorService';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/getImageUrl';

export const VendorsListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(searchParams.get('page')) || 1;
  });

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterState, setFilterState] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');

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
        const response = await getAllVendors();

        console.log(response);
        if (response && response.data) {
          const transformedVendors = response.data.map((vendor) => ({
            id: vendor.user_id,
            name: vendor.travels_name,
            location: vendor.location || vendor.city,
            state: vendor.state || 'Unknown',
            district: vendor.district || 'Not specified',
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
            created_at: vendor.created_at || new Date().toISOString(), // Fallback for created_at
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
          toast.error('Failed to load vendors');
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors. Please try again later.');
        toast.error('Failed to load vendors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Reset district filter when state filter or sorting changes
  useEffect(() => {
    if (filterState === 'all' && sortBy !== 'state') {
      setFilterDistrict('all');
    }
  }, [filterState, sortBy]);

  // Process vendors with filtering and sorting
  let processedVendors = [...vendors];

  // Apply search filter
  if (searchTerm.trim() !== '') {
    processedVendors = processedVendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply state filter
  if (filterState !== 'all') {
    processedVendors = processedVendors.filter(
      (vendor) => vendor.state.toLowerCase() === filterState.toLowerCase()
    );
  }

  // Apply district filter
  if (
    filterDistrict !== 'all' &&
    (filterState !== 'all' || sortBy === 'state')
  ) {
    processedVendors = processedVendors.filter(
      (vendor) => vendor.district.toLowerCase() === filterDistrict.toLowerCase()
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
    if (sortBy === 'newest')
      return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'bookings')
      return (b.bookings > 0 ? 1 : 0) - (a.bookings > 0 ? 1 : 0);
    if (sortBy === 'packages')
      return (b.packagesCount > 0 ? 1 : 0) - (a.packagesCount > 0 ? 1 : 0);
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
      setSearchParams({ page: pageNumber });
    }
  };

  // Get unique districts for the selected state or all districts if sorted by state
  const availableDistricts = Array.from(
    new Set(
      vendors
        .filter((vendor) =>
          filterState !== 'all'
            ? vendor.state.toLowerCase() === filterState.toLowerCase()
            : sortBy === 'state'
        )
        .map((vendor) => vendor.district)
        .filter(Boolean)
    )
  ).sort();

  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>All Vendors</h1>
        <Link
          to='/admin/vendors/create'
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
        <div className='bg-red-50 border border-gray-200 rounded-lg p-6 text-center'>
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

      <div className='bg-white rounded-md shadow-sm p-6'>
        {/* Search and Filter Controls */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div className='relative w-full md:w-80'>
            <input
              type='text'
              placeholder='Search vendors'
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm w-full'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
          </div>

          <div className='flex gap-3'>
            <div className='relative'>
              <select
                className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value='name'>Sort by: Name</option>
                <option value='location'>Sort by: Location</option>
                <option value='state'>Sort by: State</option>
                <option value='status'>Sort by: Status</option>
                <option value='buses'>Sort by: Buses</option>
                <option value='newest'>Sort by: Newest</option>
                <option value='bookings'>Sort by: Bookings</option>
                <option value='packages'>Sort by: Packages</option>
              </select>
              <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
            </div>

            <div className='relative'>
              <select
                className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white'
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}>
                <option value='all'>Filter by: State</option>
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

            {/* District Filter Dropdown (Conditional) */}
            {(filterState !== 'all' || sortBy === 'state') &&
              availableDistricts.length > 0 && (
                <div className='relative'>
                  <select
                    className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white'
                    value={filterDistrict}
                    onChange={(e) => setFilterDistrict(e.target.value)}>
                    <option value='all'>Filter by: District</option>
                    {availableDistricts.map((district) => (
                      <option
                        key={district}
                        value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
                </div>
              )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className='flex justify-center items-center min-h-[400px]'>
            <LoadingSpinner size='medium' />
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-gray-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : processedVendors.length === 0 ? (
          <EmptyState
            title='No vendors found'
            description='There are no vendors matching your criteria.'
            icon='default'
          />
        ) : (
          /* Vendor Cards Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]'>
            {currentVendors.map((vendor) => (
              <div
                key={vendor.id}
                className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative'
                onClick={() =>
                  navigate(`/admin/vendors/${vendor.id}?page=${currentPage}`)
                }>
                {/* Three dots menu */}
                <button className='absolute top-3 right-3 p-1 hover:bg-gray-100 rounded'>
                  <MoreHorizontal className='h-4 w-4 text-gray-400' />
                </button>

                {/* Vendor Profile */}
                <div className='flex flex-col items-center mb-4'>
                  <img
                    className='h-12 w-12 rounded-full mb-2'
                    src={
                      vendor.image !== '/placeholder.svg?height=48&width=48'
                        ? getImageUrl(vendor.image)
                        : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
                    }
                    alt={vendor.name}
                  />
                  <h3
                    className='text-sm font-medium text-gray-900 text-center leading-tight truncate w-full'
                    title={vendor.name}>
                    {vendor.name}
                  </h3>
                  <p
                    className='text-xs text-gray-500 mt-1 truncate w-full text-center'
                    title={vendor.location}>
                    Located in {vendor.location || 'Not specified'}
                  </p>
                  <p
                    className='text-xs text-gray-500 mt-1 truncate w-full text-center'
                    title={vendor.district}>
                    District: {vendor.district || 'Not specified'}
                  </p>
                  <p className='text-xs text-gray-600 mt-1'>
                    Amount earned [₹{vendor.earnings.toLocaleString()}]
                  </p>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-3 gap-3 mb-3'>
                  <div className='text-center'>
                    <div className='text-xs font-medium text-gray-500'>
                      Buses
                    </div>
                    <div className='text-lg font-semibold text-gray-900'>
                      {vendor.busesCount.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-xs font-medium text-gray-500'>
                      Packages
                    </div>
                    <div className='text-lg font-semibold text-gray-900'>
                      {vendor.packagesCount.toString().padStart(2, '0')}+
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-xs font-medium text-gray-500'>
                      Booked
                    </div>
                    <div className='text-lg font-semibold text-gray-900'>
                      {vendor.bookings.toString().padStart(2, '0')}+
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className='space-y-2 pt-3 border-t border-gray-100'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-600'>
                      Available Buses / Packages
                    </span>
                    <span className='text-xs font-medium text-gray-900'>
                      {vendor.availableBuses}/{vendor.packagesCount}+
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-600'>
                      Ongoing Buses / Packages
                    </span>
                    <span className='text-xs font-medium text-gray-900'>
                      {vendor.ongoingBuses}/3
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {processedVendors.length > 0 && (
          <div className='px-6 py-4 bg-white border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-medium'>{indexOfFirstVendor + 1}</span> to{' '}
                <span className='font-medium'>
                  {Math.min(indexOfLastVendor, processedVendors.length)}
                </span>{' '}
                of{' '}
                <span className='font-medium'>{processedVendors.length}</span>{' '}
                vendors
              </div>

              <div className='flex space-x-1'>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span className='sr-only'>Previous</span>
                  <ChevronLeft className='h-5 w-5' />
                </button>

                {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
                  <>
                    <button
                      onClick={() => paginate(1)}
                      className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md'>
                      1
                    </button>
                    {currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
                      <span className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700'>
                        ...
                      </span>
                    )}
                  </>
                )}

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    } rounded-md`}>
                    {page}
                  </button>
                ))}

                {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
                  <>
                    {currentPage <
                      totalPages - Math.floor(maxVisiblePages / 2) - 1 && (
                      <span className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700'>
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => paginate(totalPages)}
                      className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md'>
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span className='sr-only'>Next</span>
                  <ChevronRight className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
