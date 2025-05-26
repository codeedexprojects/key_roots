import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import BusCard from '../components/BusCard';
import BusDetails from '../components/BusDetails';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getAllBuses, transformBusData } from '../services/busService';

const BusesTab = () => {
  const [busesData, setBusesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

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

  return (
    <div className='w-full'>
      {selectedBus ? (
        <BusDetails
          bus={selectedBus}
          onBack={handleBackClick}
        />
      ) : (
        <>
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
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5'>
              {busesData.map((bus) => (
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
