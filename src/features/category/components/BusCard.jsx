import React from 'react';

const BusCard = ({ bus, onClick }) => {
  return (
    <div
      className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer'
      onClick={onClick}>
      <div className='h-48 overflow-hidden'>
        <img
          src={bus.image || '/placeholder.svg'}
          alt={bus.title}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          {bus.title}
        </h3>
        <div className='space-y-1'>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Vehicle No:</span>{' '}
            {bus.vehicleNo}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Bus Type:</span>{' '}
            {bus.busType}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Capacity:</span>{' '}
            {bus.capacity}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Contact:</span>{' '}
            {bus.contactNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
