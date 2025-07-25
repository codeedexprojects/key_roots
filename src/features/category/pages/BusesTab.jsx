import { useState, useEffect,useRef } from 'react';
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
  const [sortOption, setSortOption] = useState('newest');
  const [searchFields, setSearchFields] = useState({
    name: true,
    number: true,
    location: true,
  });
  const [lastClickedBusId, setLastClickedBusId] = useState(null);
   const busCardRefs = useRef({});

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    setIsLoading(true);
    try {
      const response = await getAllBuses();
      console.log('Fetched buses:', response);
      
      if (response && !response.error) {
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

 const sortBuses = (buses, option) => {
  const sortedBuses = [...buses];
  
  switch (option) {
    case 'new':
      // Sort by newest (assuming newer buses have higher IDs or a `createdAt` field)
      return sortedBuses.sort((a, b) => b.id - a.id);
    
    case 'joining-date':
      // Sort by joining date (requires `joiningDate` in API response)
      return sortedBuses.sort((a, b) => 
        new Date(b.joiningDate) - new Date(a.joiningDate)
      );
    
    case 'state':
      // Sort alphabetically by state
      return sortedBuses.sort((a, b) => 
        (a.state || '').localeCompare(b.state || '')
      );
    
    case 'district':
      // Sort alphabetically by district
      return sortedBuses.sort((a, b) => 
        (a.district || '').localeCompare(b.district || '')
      );
    
   
    
    default:
      return sortedBuses;
  }
};

  const handleBusClick = (bus) => {
      setLastClickedBusId(bus.id);
    setSelectedBus(bus);
  };

  const handleBackClick = () => {
    setSelectedBus(null);
    // Scroll to the last clicked bus after the component re-renders
    setTimeout(() => {
      if (lastClickedBusId && busCardRefs.current[lastClickedBusId]) {
        busCardRefs.current[lastClickedBusId].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Optional: Add highlight effect
        const element = busCardRefs.current[lastClickedBusId];
        element.classList.add('highlight-bus');
        setTimeout(() => {
          element.classList.remove('highlight-bus');
        }, 1000);
      }
    }, 0);
  };

  const handlePopularityToggle = (busId, newPopularityStatus) => {
    setBusesData((prevBuses) =>
      prevBuses.map((bus) =>
        bus.id === busId ? { ...bus, isPopular: newPopularityStatus } : bus
      )
    );
  };

  // Filter and sort buses
  const filteredBuses = filterBuses(busesData, searchQuery, searchFields);
  const sortedBuses = sortBuses(filteredBuses, sortOption);

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
              busCount={sortedBuses.length}
              sortOption={sortOption}
              setSortOption={setSortOption}
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
          ) : sortedBuses.length === 0 ? (
            <EmptyState
              title='No matching buses'
              description={`No buses match your search for "${searchQuery}". Try different keywords or filters.`}
              actionLabel='Clear Search'
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5'>
              {sortedBuses.map((bus) => (
                <BusCard
                  key={bus.id}
                  ref={(el) => (busCardRefs.current[bus.id] = el)}

                  bus={bus}
                  onClick={() => handleBusClick(bus)}
                  onPopularityToggle={handlePopularityToggle}
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