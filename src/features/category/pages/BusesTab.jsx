import React, { useState } from 'react';
import BusCard from '../components/BusCard';
import BusDetails from '../components/BusDetails';

const BusesTab = () => {
  // Mock data for buses
  const busesData = [
    {
      id: 1,
      title: 'Komban Travels',
      vehicleNo: 'KL 51M 6013',
      busType: 'Coach',
      capacity: 32,
      contactNumber: '+91 9876543210',
      image:
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      seats: 45,
      basePrice: 1500,
      pricePerKm: 150,
      rcNumber: '808221',
      description:
        'Luxury coach with all modern amenities for comfortable travel. Well-maintained and regularly serviced for safety and comfort.',
      amenities: {
        ac: true,
        pushback: true,
        music: true,
        wifi: true,
        charging: true,
      },
    },
    {
      id: 2,
      title: 'Kerala Travels',
      vehicleNo: 'KL 10N 7845',
      busType: 'Sleeper',
      capacity: 28,
      contactNumber: '+91 9876543211',
      image:
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      seats: 28,
      basePrice: 1800,
      pricePerKm: 180,
      rcNumber: '765432',
      description:
        'Premium sleeper coach for overnight journeys. Comfortable berths and excellent service.',
      amenities: {
        ac: true,
        pushback: true,
        music: true,
        wifi: true,
        charging: true,
      },
    },
    {
      id: 3,
      title: 'Malabar Express',
      vehicleNo: 'KL 14P 3421',
      busType: 'Semi-Sleeper',
      capacity: 36,
      contactNumber: '+91 9876543212',
      image:
        'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      seats: 36,
      basePrice: 1600,
      pricePerKm: 160,
      rcNumber: '654321',
      description:
        'Semi-sleeper coach with reclining seats for comfortable long journeys.',
      amenities: {
        ac: true,
        pushback: true,
        music: true,
        wifi: false,
        charging: true,
      },
    },
    {
      id: 4,
      title: 'Wayanad Travels',
      vehicleNo: 'KL 73K 9087',
      busType: 'Coach',
      capacity: 40,
      contactNumber: '+91 9876543213',
      image:
        'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      seats: 40,
      basePrice: 1400,
      pricePerKm: 140,
      rcNumber: '543210',
      description: 'Standard coach for group travel with basic amenities.',
      amenities: {
        ac: false,
        pushback: true,
        music: true,
        wifi: false,
        charging: false,
      },
    },
    {
      id: 5,
      title: 'Munnar Travels',
      vehicleNo: 'KL 05J 6754',
      busType: 'Luxury',
      capacity: 30,
      contactNumber: '+91 9876543214',
      image:
        'https://images.unsplash.com/photo-1551361415-69c87624334f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      seats: 30,
      basePrice: 2000,
      pricePerKm: 200,
      rcNumber: '432109',
      description: 'Ultra-luxury coach with premium amenities for VIP travel.',
      amenities: {
        ac: true,
        pushback: true,
        music: true,
        wifi: true,
        charging: true,
      },
    },
    {
      id: 6,
      title: 'Thekkady Express',
      vehicleNo: 'KL 33F 4532',
      busType: 'Mini Coach',
      capacity: 20,
      contactNumber: '+91 9876543215',
      image:
        'https://images.unsplash.com/photo-1556122071-e404cb6f31d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      seats: 20,
      basePrice: 1200,
      pricePerKm: 120,
      rcNumber: '321098',
      description:
        'Compact mini coach ideal for small groups and narrow hill roads.',
      amenities: {
        ac: true,
        pushback: false,
        music: true,
        wifi: false,
        charging: true,
      },
    },
  ];

  const [selectedBus, setSelectedBus] = useState(null);

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
    </div>
  );
};

export default BusesTab;
