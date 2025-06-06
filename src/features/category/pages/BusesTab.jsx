import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import BusCard from '../components/BusCard';
import BusDetails from '../components/BusDetails';
import BusSearch from '../components/BusSearch';
import { LoadingSpinner, EmptyState } from '@/components/common';
import {
  getAllBuses,
  transformBusData,
  filterBuses,
} from '../services/busService';

const BusesTab = () => {
  const [busesData, setBusesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFields, setSearchFields] = useState({
    name: true,
    number: true,
    location: true,
    type: true,
    capacity: false,
    price: false,
    status: false,
  });

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    setIsLoading(true);
    try {
      const response = await getAllBuses();
      if (response && !response.error) {
        // Handle direct array response or response with data field
        const data = Array.isArray(response) ? response : response.data || [];
        const transformedBuses = transformBusData(data);
        setBusesData(transformedBuses);
      } else {
        toast.error(response?.message || 'Failed to load buses');
        setBusesData([]);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      toast.error('Failed to load buses. Please try again later.');
      setBusesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusClick = (bus) => {
    setSelectedBus(bus);
  };

  const handleBackClick = () => {
    setSelectedBus(null);
  };

  // Filter buses based on search query
  const filteredBuses = filterBuses(busesData, searchQuery, searchFields);

  return (
    <div className='w-full'>
      {selectedBus ? (
        <BusDetails
          bus={selectedBus}
          onBack={handleBackClick}
        />
      ) : (
        <>
          {!isLoading && (
            <BusSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
              busCount={filteredBuses.length}
            />
          )}

          {isLoading ? (
            <div className='flex justify-center items-center min-h-[500px]'>
              <LoadingSpinner size='large' />
            </div>
          ) : busesData.length === 0 ? (
            <EmptyState
              title='No buses found'
              description='No buses are currently available. Please check back later.'
              actionLabel='Refresh'
              onAction={loadBuses}
            />
          ) : filteredBuses.length === 0 ? (
            <EmptyState
              title='No matching buses'
              description={`No buses match your search for "${searchQuery}". Try different keywords or filters.`}
              actionLabel='Clear Search'
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5'>
              {filteredBuses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  onClick={() => handleBusClick(bus)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusesTab;
