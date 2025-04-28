import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { VendorCard } from '../components/VendorCard';
import { getAllVendors } from '../services/vendorService';
import { LoadingSpinner } from '@/components/common';

export const VendorsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await getAllVendors();
        if (response && response.data) {
          const transformedVendors = response.data.map((vendor) => ({
            id: vendor.user_id,
            name: vendor.travels_name,
            location: vendor.location || vendor.city,
            busesCount: vendor.bus_count || 0,
            packagesCount: vendor.package_count || 0,
            availableBuses: vendor.buses?.length || 0,
            ongoingBuses: vendor.ongoing_buses?.length || 0,
            bookings: vendor.buses?.length || 0,
            earnings: 0,
            image:
              vendor.buses?.[0]?.travels_logo ||
              '/placeholder.svg?height=48&width=48',
          }));
          setVendors(transformedVendors);
          console.log(vendors);
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Use the fetched vendors
  const allVendors = vendors;

  // Filter and sort vendors
  const filteredVendors = allVendors
    .filter((vendor) => {
      if (searchTerm) {
        return (
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterBy === 'all') return true;
      if (filterBy === 'highBookings') return vendor.bookings > 25;
      if (filterBy === 'highEarnings') return vendor.earnings > 2500;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'location') return a.location.localeCompare(b.location);
      if (sortBy === 'earnings') return b.earnings - a.earnings;
      if (sortBy === 'bookings') return b.bookings - a.bookings;

      return 0;
    });

  // Pagination
  const vendorsPerPage = 6;
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>Vendors</h1>
        <Link
          to='/vendors/create'
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center'>
          <Plus className='h-4 w-4 mr-2' />
          Add Vendor
        </Link>
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div className='relative w-full md:w-64'>
          <input
            type='text'
            placeholder='Search vendors...'
            className='w-full pl-10 pr-4 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-10 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-sm'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value='name'>Sort by: Name</option>
              <option value='location'>Sort by: Location</option>
              <option value='earnings'>Sort by: Earnings</option>
              <option value='bookings'>Sort by: Bookings</option>
            </select>
            <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
          </div>

          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-10 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-sm'
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}>
              <option value='all'>Filter by: All</option>
              <option value='highBookings'>High Bookings</option>
              <option value='highEarnings'>High Earnings</option>
            </select>
            <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center min-h-[200px]'>
          <LoadingSpinner size='large' />
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6'>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : currentVendors.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
          {currentVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
            />
          ))}
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-sm p-8 text-center mb-6'>
          <p className='text-gray-500'>
            No vendors found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredVendors.length > 0 && (
        <div className='flex justify-between items-center sticky bottom-0 py-4mt-4'>
          <p className='text-sm text-gray-500'>
            Showing {indexOfFirstVendor + 1}-
            {Math.min(indexOfLastVendor, filteredVendors.length)} of{' '}
            {filteredVendors.length} vendors
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
    </>
  );
};
