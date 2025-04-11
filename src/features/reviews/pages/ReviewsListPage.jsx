import { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from 'lucide-react';

export const ReviewsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(null);

  // Sample data for reviews
  const reviews = [
    {
      id: 1,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 2,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 3,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 4,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 5,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 6,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 7,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 8,
      customerName: 'Praveen TP',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Komban Travels',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '03 MAR 2025',
    },
    {
      id: 9,
      customerName: 'Rahul Singh',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Package: Kerala Explorer',
      rating: 3.5,
      review:
        'Good experience overall, but there were some issues with the accommodation. The tour guide was excellent though.',
      date: '28 FEB 2025',
    },
    {
      id: 10,
      customerName: 'Meera Patel',
      avatar: '/placeholder.svg?height=40&width=40',
      tripProvider: 'Bus: Royal Travels',
      rating: 5.0,
      review:
        'Exceptional service! The bus was clean, comfortable, and the driver was very professional. Would definitely recommend.',
      date: '25 FEB 2025',
    },
  ];

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      // Apply search filter
      if (searchTerm) {
        return (
          review.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.review.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply rating filter
      if (filterRating !== null) {
        // Round to nearest integer for filtering
        return Math.round(review.rating) === filterRating;
      }

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

  // Pagination
  const reviewsPerPage = 8;
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const clearRatingFilter = () => {
    setFilterRating(null);
  };

  return (
    <div className='flex-1 overflow-auto'>
      <h1 className='text-2xl font-semibold mb-6'>Customer Review</h1>

      {/* Search and Filters */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div className='relative w-full md:w-64'>
          <input
            type='text'
            placeholder='Search reviews...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value='newest'>Sort by: Newest</option>
              <option value='oldest'>Sort by: Oldest</option>
            </select>
            <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
          </div>

          <div className='flex items-center gap-2'>
            <div className='text-sm text-gray-600'>Filter by:</div>
            {filterRating !== null ? (
              <div className='flex items-center bg-gray-100 px-2 py-1 rounded-md'>
                <span className='text-sm mr-1'>{filterRating} STAR</span>
                <button
                  onClick={clearRatingFilter}
                  className='text-gray-500 hover:text-gray-700'>
                  <X className='h-4 w-4' />
                </button>
              </div>
            ) : (
              <div className='relative'>
                <select
                  className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm'
                  value=''
                  onChange={(e) => setFilterRating(Number(e.target.value))}>
                  <option
                    value=''
                    disabled>
                    Select Rating
                  </option>
                  <option value='5'>5 Stars</option>
                  <option value='4'>4 Stars</option>
                  <option value='3'>3 Stars</option>
                  <option value='2'>2 Stars</option>
                  <option value='1'>1 Star</option>
                </select>
                <ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none' />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  SL NO
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Customer
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Rating & Review
                </th>
                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {currentReviews.map((review, index) => (
                <tr
                  key={review.id}
                  className='hover:bg-gray-50'>
                  <td className='px-6  py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {indexOfFirstReview + index + 1}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center'>
                      <div className='h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0'>
                        <img
                          src={review.avatar || '/placeholder.svg'}
                          alt={review.customerName}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='ml-3'>
                        <div className='text-sm font-medium text-gray-900'>
                          {review.customerName}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {review.tripProvider}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center mb-1'>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(review.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : i < review.rating
                                ? 'text-yellow-400 fill-yellow-400 opacity-50'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='ml-2 text-sm text-gray-600'>
                        {review.rating}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                      {review.review}
                    </p>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>{review.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='px-6 py-4 bg-white border-t border-gray-200'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-700'>
              Showing{' '}
              <span className='font-medium'>{indexOfFirstReview + 1}</span> to{' '}
              <span className='font-medium'>
                {Math.min(indexOfLastReview, filteredReviews.length)}
              </span>{' '}
              of <span className='font-medium'>{filteredReviews.length}</span>{' '}
              reviews
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

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } rounded-md`}>
                  {i + 1}
                </button>
              ))}

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
      </div>
    </div>
  );
};
