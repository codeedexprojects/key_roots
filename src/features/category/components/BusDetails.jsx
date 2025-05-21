import React from 'react';
import {
  FaArrowLeft,
  FaDownload,
  FaWifi,
  FaMusic,
  FaChargingStation,
  FaSnowflake,
  FaCouch,
} from 'react-icons/fa';

const BusDetails = ({ bus, onBack }) => {
  const renderAmenity = (name, icon, isAvailable) => {
    return (
      <div
        className={`flex items-center gap-2 ${
          isAvailable ? 'text-green-500' : 'text-gray-300'
        }`}>
        {icon}
        <span>{name}</span>
      </div>
    );
  };

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='p-4 border-b border-gray-200'>
        <button
          className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
          onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className='p-5'>
        <div className='w-full h-72 rounded-lg overflow-hidden mb-6'>
          <img
            src={bus.image || '/placeholder.svg'}
            alt={bus.title}
            className='w-full h-full object-cover'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>{bus.title}</h2>
            <p className='text-gray-600'>{bus.vehicleNo}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              NUMBER OF SEATS
            </h3>
            <p className='text-2xl font-medium text-gray-800'>{bus.seats}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>BASE PRICE</h3>
            <p className='text-2xl font-medium text-gray-800'>
              {bus.basePrice}
            </p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>CAPACITY</h3>
            <p className='text-2xl font-medium text-gray-800'>{bus.capacity}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              ENTER PRICE PER KM
            </h3>
            <p className='text-2xl font-medium text-gray-800'>
              {bus.pricePerKm}
            </p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>BUS TYPE</h3>
            <p className='text-2xl font-medium text-gray-800'>{bus.busType}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              VEHICLE RC NUMBER
            </h3>
            <p className='text-2xl font-medium text-gray-800'>{bus.rcNumber}</p>
          </div>
        </div>

        <div className='mb-8'>
          <h3 className='text-xs uppercase text-gray-500 mb-2'>
            VEHICLE DESCRIPTION
          </h3>
          <p className='text-gray-700 leading-relaxed'>{bus.description}</p>
        </div>

        <div className='mb-8'>
          <h3 className='text-xs uppercase text-gray-500 mb-3'>AMENITIES</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {renderAmenity(
              'Air Conditioning',
              <FaSnowflake className='text-lg' />,
              bus.amenities.ac
            )}
            {renderAmenity(
              'Pushback',
              <FaCouch className='text-lg' />,
              bus.amenities.pushback
            )}
            {renderAmenity(
              'Music System',
              <FaMusic className='text-lg' />,
              bus.amenities.music
            )}
            {renderAmenity(
              'Wi-Fi',
              <FaWifi className='text-lg' />,
              bus.amenities.wifi
            )}
            {renderAmenity(
              'Charging',
              <FaChargingStation className='text-lg' />,
              bus.amenities.charging
            )}
          </div>
        </div>

        <div className='mb-8'>
          <h3 className='text-xs uppercase text-gray-500 mb-3'>
            AC & PUSHBACK
          </h3>
          <div className='flex gap-6'>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='ac'
                checked={bus.amenities.ac}
                readOnly
                className='text-red-700 focus:ring-red-700'
              />
              <span>AC</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='pushback'
                checked={bus.amenities.pushback}
                readOnly
                className='text-red-700 focus:ring-red-700'
              />
              <span>Pushback</span>
            </label>
          </div>
        </div>

        <div className='space-y-5'>
          <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
            <h3 className='text-xs uppercase text-gray-500'>RC CERTIFICATE</h3>
            <button className='flex items-center gap-2 text-blue-500 mt-2 md:mt-0'>
              <FaDownload /> Download RC Certificate File
            </button>
          </div>

          <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
            <h3 className='text-xs uppercase text-gray-500'>LICENSE</h3>
            <button className='flex items-center gap-2 text-blue-500 mt-2 md:mt-0'>
              <FaDownload /> Download Travel License
            </button>
          </div>

          <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
            <h3 className='text-xs uppercase text-gray-500'>
              CONTRACT CARRIAGE PERMIT
            </h3>
            <button className='flex items-center gap-2 text-blue-500 mt-2 md:mt-0'>
              <FaDownload /> Download Contract carriage permit
            </button>
          </div>

          <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
            <h3 className='text-xs uppercase text-gray-500'>
              INSURANCE CERTIFICATE FOR PASSENGER
            </h3>
            <button className='flex items-center gap-2 text-blue-500 mt-2 md:mt-0'>
              <FaDownload /> Download Certificate for passenger insurance
            </button>
          </div>

          <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
            <h3 className='text-xs uppercase text-gray-500'>
              INSURANCE CERTIFICATE FOR VEHICLE
            </h3>
            <button className='flex items-center gap-2 text-blue-500 mt-2 md:mt-0'>
              <FaDownload /> Download Vehicle Insurance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
