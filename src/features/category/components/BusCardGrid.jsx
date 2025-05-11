import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, BusFront } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';

const BusCardGrid = ({
  buses,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  // Use provided buses or empty array
  const displayBuses = buses || [];

  const handleBusClick = (busId) => {
    navigate(`/category/buses/${busId}`);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (displayBuses.length === 0) {
    return (
      <EmptyState
        title='No buses found'
        description='There are no buses to display.'
        icon='bus'
      />
    );
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {displayBuses.map((bus) => (
          <div
            key={bus.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => handleBusClick(bus.id)}>
            <div className='flex'>
              <div className='w-1/3 h-40 relative'>
                {bus.image ? (
                  <img
                    src={bus.image || '/placeholder.svg'}
                    alt={bus.name}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='h-full w-full flex items-center justify-center bg-gray-100'>
                    <BusFront className='h-12 w-12 text-gray-400' />
                  </div>
                )}
              </div>
              <div className='w-2/3 p-4'>
                <h3 className='font-semibold text-gray-900'>{bus.name}</h3>
                <p className='text-sm text-gray-600 mb-2'>{bus.numberPlate}</p>

                <div className='grid grid-cols-2 gap-x-2 gap-y-1 text-xs'>
                  <div className='text-gray-500'>Bus type</div>
                  <div className='font-medium'>{bus.busType}</div>

                  <div className='text-gray-500'>Capacity</div>
                  <div className='font-medium'>{bus.capacity}</div>

                  <div className='text-gray-500'>Vehicle ID</div>
                  <div className='font-medium truncate'>{bus.vehicleId}</div>
                </div>
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

export default BusCardGrid;
