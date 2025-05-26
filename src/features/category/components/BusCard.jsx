import React from 'react';
import { formatPrice, getStatusColor } from '../services/busService';

const BusCard = ({ bus, onClick }) => {
  return (
    <div
      className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border border-gray-100'
      onClick={onClick}>
      <div className='h-48 overflow-hidden relative'>
        <img
          src={bus.image || '/placeholder.svg'}
          alt={bus.title}
          className='w-full h-full object-cover'
        />
        {bus.isPopular && (
          <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            Popular
          </div>
        )}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            bus.status
          )}`}>
          {bus.status?.charAt(0).toUpperCase() + bus.status?.slice(1) ||
            'Available'}
        </div>
      </div>
      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-lg font-semibold text-gray-800 truncate flex-1'>
            {bus.title}
          </h3>
          {bus.averageRating > 0 && (
            <div className='flex items-center ml-2'>
              <span className='text-yellow-500 text-sm'>★</span>
              <span className='text-sm text-gray-600 ml-1'>
                {bus.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className='space-y-1 mb-3'>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Vehicle No:</span>{' '}
            {bus.vehicleNo}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Bus Type:</span>{' '}
            {bus.busType || 'Standard'}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Capacity:</span>{' '}
            {bus.capacity} seats
          </p>
          {bus.location && (
            <p className='text-sm text-gray-600'>
              <span className='font-medium text-gray-700'>Location:</span>{' '}
              {bus.location}
            </p>
          )}
        </div>
        <div className='flex justify-between items-center pt-2 border-t border-gray-100'>
          <div className='text-sm'>
            <span className='text-gray-500'>Base Price:</span>
            <span className='font-semibold text-gray-800 ml-1'>
              {formatPrice(bus.basePrice)}
            </span>
          </div>
          <div className='text-sm'>
            <span className='text-gray-500'>Per KM:</span>
            <span className='font-semibold text-gray-800 ml-1'>
              {formatPrice(bus.pricePerKm)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
