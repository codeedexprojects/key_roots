import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getAllReviews } from '../services';
import { toast } from 'sonner';

export const ReviewsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(null);

  // API state
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform API data to match table structure
  const transformReviewData = (apiData) => {
    const allReviews = [];
    console.log(apiData);
    // Add bus reviews
    if (apiData.bus_reviews) {
      apiData.bus_reviews.forEach((review) => {
        allReviews.push({
          id: `bus_${review.id}`,
          customerName: review.user_name,
          avatar: '/placeholder.svg?height=40&width=40',
          tripProvider: `Bus ID: ${review.bus}`,
          type: 'Bus',
          rating: review.rating,
          review: review.comment,
          date: new Date(review.created_at)
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            .toUpperCase(),
          created_at: review.created_at,
        });
      });
    }

    // Add package reviews
    if (apiData.package_reviews) {
      apiData.package_reviews.forEach((review) => {
        allReviews.push({
          id: `package_${review.id}`,
          customerName: review.user_name,
          avatar: '/placeholder.svg?height=40&width=40',
          tripProvider: `Package ID: ${review.package}`,
          type: 'Package',
          rating: review.rating,
          review: review.comment,
          date: new Date(review.created_at)
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            .toUpperCase(),
          created_at: review.created_at,
        });
      });
    }

    // Add app reviews
    if (apiData.app_reviews) {
      apiData.app_reviews.forEach((review) => {
        allReviews.push({
          id: `app_${review.id}`,
          customerName: review.user_name,
          avatar: '/placeholder.svg?height=40&width=40',
          tripProvider: 'App Review',
          type: 'App',
          rating: review.rating,
          review: review.comment,
          date: new Date(review.created_at)
            .toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            .toUpperCase(),
          created_at: review.created_at,
        });
      });
    }

    return allReviews;
  };

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllReviews();
        console.log('Reviews API response:', response);

        if (response && !response.error) {
          const transformedReviews = transformReviewData(response);
          setReviews(transformedReviews);
        } else {
          setError(response?.message || 'Failed to load reviews');
          toast.error('Failed to load reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      if (filterRating !== null) {
        return Math.round(review.rating) === filterRating;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
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

      {/* Filters */}
      <div className='flex justify-end items-center mb-6 gap-4'>
        <div className='flex gap-2'>
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
        {loading ? (
          <div className='flex justify-center items-center min-h-[500px]'>
            <LoadingSpinner size='large' />
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <EmptyState
            title='No reviews found'
            description='There are no reviews matching your criteria.'
            icon='reviews'
          />
        ) : (
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
                    Type
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
                    <td className='px-6 py-4 whitespace-nowrap'>
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
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          review.type === 'Bus'
                            ? 'bg-blue-100 text-blue-800'
                            : review.type === 'Package'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                        {review.type}
                      </span>
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
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
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
      )}
    </div>
  );
};
