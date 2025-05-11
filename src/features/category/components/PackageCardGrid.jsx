import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';

const PackageCardGrid = ({
  packages,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  const navigate = useNavigate();

  // Use provided packages or empty array
  const displayPackages = packages || [];

  const handlePackageClick = (packageId) => {
    navigate(`/category/packages/${packageId}`);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (displayPackages.length === 0) {
    return (
      <EmptyState
        title='No packages found'
        description='There are no packages to display.'
        icon='package'
      />
    );
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {displayPackages.map((pkg) => (
          <div
            key={pkg.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => handlePackageClick(pkg.id)}>
            <div className='relative'>
              <img
                src={pkg.image || '/placeholder.svg?height=150&width=300'}
                alt={pkg.title}
                className='w-full h-48 object-cover'
              />
            </div>
            <div className='p-4'>
              <h3 className='font-semibold text-gray-900'>{pkg.title}</h3>
              <p className='text-sm text-gray-600 mb-2'>{pkg.numberPlate}</p>

              <div className='grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-2'>
                <div className='flex items-center text-gray-500'>
                  <MapPin className='h-3 w-3 mr-1' />
                  Location
                </div>
                <div className='font-medium truncate'>{pkg.location}</div>

                <div className='flex items-center text-gray-500'>
                  <CalendarDays className='h-3 w-3 mr-1' />
                  Duration
                </div>
                <div className='font-medium'>{pkg.duration}</div>

                <div className='text-gray-500'>Price</div>
                <div className='font-medium text-red-600'>{pkg.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-8'>
          <div className='flex space-x-1'>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
              <span className='sr-only'>Previous</span>
              <ChevronLeft className='h-5 w-5' />
              <span className='ml-1'>PREV</span>
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                  currentPage === i + 1
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                } rounded-md`}>
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
              <span className='mr-1'>NEXT</span>
              <span className='sr-only'>Next</span>
              <ChevronRight className='h-5 w-5' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageCardGrid;
