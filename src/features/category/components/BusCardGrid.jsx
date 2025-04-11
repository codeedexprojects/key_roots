import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BusCardGrid = ({
  buses,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  // Sample data for demonstration
  const sampleBuses = [
    {
      id: 1,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 2,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 3,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 4,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 5,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 6,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 7,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 8,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 9,
      name: 'Komban Travels',
      numberPlate: 'KL 58M 6018',
      busType: 'Coach',
      capacity: '45',
      vehicleId: '45DDXXXXXXXXX18',
      image: '/placeholder.svg?height=200&width=300',
    },
  ];

  // Use sample data if no buses are provided
  const displayBuses = buses.length > 0 ? buses : sampleBuses;

  const handleBusClick = (busId) => {
    navigate(`/category/buses/${busId}`);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
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
              <div className='w-1/3'>
                <img
                  src={bus.image || '/placeholder.svg'}
                  alt={bus.name}
                  className='h-full w-full object-cover'
                />
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
    </div>
  );
};

export default BusCardGrid;
