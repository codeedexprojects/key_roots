import { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { VendorCard } from '../components/VendorCard';

export const VendorsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // Sample data for vendors
  const allVendors = [
    {
      id: 1,
      name: 'Skyway Travels',
      location: 'Palakkad',
      earnings: 2500,
      bookings: 25,
      busesCount: 5,
      packagesCount: 7,
      availableBuses: 4,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 2,
      name: 'Kerala Tours',
      location: 'Kochi',
      earnings: 3200,
      bookings: 32,
      busesCount: 8,
      packagesCount: 12,
      availableBuses: 6,
      ongoingBuses: 2,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 3,
      name: 'Malabar Travels',
      location: 'Kozhikode',
      earnings: 1800,
      bookings: 18,
      busesCount: 4,
      packagesCount: 5,
      availableBuses: 3,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 4,
      name: 'Wayanad Explorers',
      location: 'Wayanad',
      earnings: 2100,
      bookings: 21,
      busesCount: 6,
      packagesCount: 9,
      availableBuses: 5,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 5,
      name: 'Trivandrum Tours',
      location: 'Trivandrum',
      earnings: 2800,
      bookings: 28,
      busesCount: 7,
      packagesCount: 10,
      availableBuses: 5,
      ongoingBuses: 2,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 6,
      name: 'Munnar Holidays',
      location: 'Munnar',
      earnings: 3500,
      bookings: 35,
      busesCount: 9,
      packagesCount: 14,
      availableBuses: 7,
      ongoingBuses: 2,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 7,
      name: 'Alleppey Backwaters',
      location: 'Alleppey',
      earnings: 2900,
      bookings: 29,
      busesCount: 6,
      packagesCount: 8,
      availableBuses: 4,
      ongoingBuses: 2,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 8,
      name: 'Thekkady Wildlife Tours',
      location: 'Thekkady',
      earnings: 2200,
      bookings: 22,
      busesCount: 5,
      packagesCount: 7,
      availableBuses: 4,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 9,
      name: 'Varkala Beach Travels',
      location: 'Varkala',
      earnings: 1900,
      bookings: 19,
      busesCount: 4,
      packagesCount: 6,
      availableBuses: 3,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 10,
      name: 'Kovalam Express',
      location: 'Kovalam',
      earnings: 2400,
      bookings: 24,
      busesCount: 6,
      packagesCount: 8,
      availableBuses: 5,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 11,
      name: 'Kannur Adventures',
      location: 'Kannur',
      earnings: 2000,
      bookings: 20,
      busesCount: 5,
      packagesCount: 7,
      availableBuses: 4,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
    {
      id: 12,
      name: 'Kasaragod Tours',
      location: 'Kasaragod',
      earnings: 1700,
      bookings: 17,
      busesCount: 4,
      packagesCount: 5,
      availableBuses: 3,
      ongoingBuses: 1,
      image:
        'https://media.istockphoto.com/id/177447843/photo/house-boat-in-backwaters.jpg?s=612x612&w=0&k=20&c=9RnNr22SKJiNKuOukgfo82TtSgvSLMIZALXNf4m_VPM=',
    },
  ];

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
      <h1 className='text-2xl font-semibold mb-6'>Vendors</h1>

      {/* Search and Filters */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div className='relative w-full md:w-64'>
          <input
            type='text'
            placeholder='Search vendors...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
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
              className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
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

      {/* Vendors Grid */}
      {currentVendors.length > 0 ? (
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
        <div className='flex justify-between items-center'>
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
