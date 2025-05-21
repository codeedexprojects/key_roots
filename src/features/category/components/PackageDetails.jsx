import React from 'react';
import { FaArrowLeft, FaStar, FaRegStar } from 'react-icons/fa';

const PackageDetails = ({ packageData, onBack }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FaStar
            key={i}
            className='text-yellow-400'
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className='text-gray-300'
          />
        );
      }
    }
    return stars;
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
            src={packageData.image || '/placeholder.svg'}
            alt={packageData.title}
            className='w-full h-full object-cover'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>
              {packageData.title}
            </h2>
            <p className='text-gray-600'>{packageData.vehicleNo}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>Days</h3>
            <p className='text-lg font-medium text-gray-800'>
              {packageData.duration}
            </p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              Package places
            </h3>
            <p className='text-gray-700'>{packageData.places.join(', ')}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>Guide</h3>
            <p className='text-gray-700'>{packageData.guide ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>AC/Non-AC</h3>
            <p className='text-gray-700'>{packageData.ac ? 'AC' : 'Non-AC'}</p>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200'>
              <h3 className='font-medium text-gray-800'>Stay</h3>
              <span className='bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded'>
                1 Night
              </span>
            </div>
            <div className='p-4'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0'>
                  <img
                    src={packageData.stay.image || '/placeholder.svg'}
                    alt={packageData.stay.resortName}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h4 className='text-lg font-medium text-gray-800 mb-1'>
                    {packageData.stay.resortName}
                  </h4>
                  <div className='flex items-center gap-1 mb-2'>
                    {renderStars(packageData.stay.rating)}
                    <span className='text-sm text-gray-600 ml-1'>
                      {packageData.stay.rating}
                    </span>
                  </div>
                  <p className='text-gray-700 mb-2'>
                    {packageData.stay.description}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {packageData.stay.amenities.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200'>
              <h3 className='font-medium text-gray-800'>Meals</h3>
              <span className='bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded'>
                3 Meals
              </span>
            </div>
            <div className='p-4'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0'>
                  <img
                    src={packageData.meals.image || '/placeholder.svg'}
                    alt='Meals'
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h4 className='text-lg font-medium text-gray-800 mb-2'>
                    {packageData.meals.title}
                  </h4>
                  <p className='text-gray-700'>
                    {packageData.meals.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200'>
              <h3 className='font-medium text-gray-800'>Activity</h3>
              <span className='bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded'>
                4 Hours
              </span>
            </div>
            <div className='p-4'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0'>
                  <img
                    src={packageData.activity.image || '/placeholder.svg'}
                    alt={packageData.activity.title}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h4 className='text-lg font-medium text-gray-800 mb-2'>
                    {packageData.activity.title}
                  </h4>
                  <p className='text-gray-700'>
                    {packageData.activity.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
              <h3 className='font-medium text-gray-800'>Sightseeing</h3>
            </div>
            <div className='p-4'>
              <div className='space-y-6'>
                {packageData.sightseeing.map((sight, index) => (
                  <div
                    key={index}
                    className='flex flex-col md:flex-row gap-4'>
                    <div className='w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0'>
                      <img
                        src={sight.image || '/placeholder.svg'}
                        alt={sight.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h4 className='text-lg font-medium text-gray-800 mb-2'>
                        {sight.name}
                      </h4>
                      <p className='text-gray-700'>{sight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
