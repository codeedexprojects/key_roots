import React from 'react';
import { FaArrowLeft, FaStar, FaRegStar } from 'react-icons/fa';
import { LoadingSpinner } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';

const PackageDetails = ({ packageData, onBack, isLoading }) => {
  // const renderStars = (rating) => {
  //   const stars = [];
  //   for (let i = 1; i <= 5; i++) {
  //     if (i <= rating) {
  //       stars.push(
  //         <FaStar
  //           key={i}
  //           className='text-yellow-400'
  //         />
  //       );
  //     } else {
  //       stars.push(
  //         <FaRegStar
  //           key={i}
  //           className='text-gray-300'
  //         />
  //       );
  //     }
  //   }
  //   return stars;
  // };

  console.log(packageData);

  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='p-4 border-b border-gray-200'>
          <button
            className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
            onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className='flex justify-center items-center min-h-[400px]'>
          <LoadingSpinner size='large' />
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='p-4 border-b border-gray-200'>
          <button
            className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
            onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className='p-5 text-center'>
          <p className='text-gray-500'>Package details not found.</p>
        </div>
      </div>
    );
  }

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
            src={getImageUrl(packageData.header_image) || '/placeholder.svg'}
            alt={packageData.title || packageData.places}
            className='w-full h-full object-cover'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>
              {packageData.places || packageData.title}
            </h2>
            <p className='text-gray-600'>{packageData.sub_category?.name}</p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>Duration</h3>
            <p className='text-lg font-medium text-gray-800'>
              {packageData.days} days
            </p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              Price per Person
            </h3>
            <p className='text-lg font-semibold text-blue-600'>
              ₹{packageData.price_per_person}
            </p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>Guide</h3>
            <p className='text-gray-700'>
              {packageData.guide_included ? 'Yes' : 'No'}
            </p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              AC Available
            </h3>
            <p className='text-gray-700'>
              {packageData.ac_available ? 'Yes' : 'No'}
            </p>
          </div>

          <div>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              Extra Charge per KM
            </h3>
            <p className='text-gray-700'>₹{packageData.extra_charge_per_km}</p>
          </div>
        </div>

        {/* Day Plans Section */}
        {packageData.day_plans && packageData.day_plans.length > 0 && (
          <div className='space-y-6'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              Itinerary
            </h3>
            {packageData.day_plans.map((dayPlan) => (
              <div
                key={dayPlan.id}
                className='border border-gray-200 rounded-lg overflow-hidden'>
                <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                  <h3 className='font-medium text-gray-800'>
                    Day {dayPlan.day_number}
                  </h3>
                </div>
                <div className='p-4'>
                  <p className='text-gray-700 mb-4'>{dayPlan.description}</p>

                  {/* Places */}
                  {dayPlan.places && dayPlan.places.length > 0 && (
                    <div className='mb-6'>
                      <h4 className='font-medium text-gray-800 mb-3'>
                        Places to Visit
                      </h4>
                      <div className='space-y-4'>
                        {dayPlan.places.map((place) => (
                          <div
                            key={place.id}
                            className='flex flex-col md:flex-row gap-4 bg-gray-50 p-3 rounded'>
                            {place.images && place.images.length > 0 && (
                              <div className='w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0'>
                                <img
                                  src={
                                    getImageUrl(place.images[0].image) ||
                                    '/placeholder.svg'
                                  }
                                  alt={place.name}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            )}
                            <div>
                              <h5 className='font-medium text-gray-800'>
                                {place.name}
                              </h5>
                              <p className='text-sm text-gray-600'>
                                {place.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stay */}
                  {dayPlan.stay && (
                    <div className='mb-6'>
                      <h4 className='font-medium text-gray-800 mb-3'>
                        Accommodation
                      </h4>
                      <div className='bg-gray-50 p-3 rounded'>
                        <h5 className='font-medium text-gray-800'>
                          {dayPlan.stay.hotel_name}
                        </h5>
                        <p className='text-sm text-gray-600'>
                          {dayPlan.stay.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Meals */}
                  {dayPlan.meals && dayPlan.meals.length > 0 && (
                    <div className='mb-6'>
                      <h4 className='font-medium text-gray-800 mb-3'>Meals</h4>
                      <div className='space-y-3'>
                        {dayPlan.meals.map((meal) => (
                          <div
                            key={meal.id}
                            className='flex flex-col md:flex-row gap-4 bg-gray-50 p-3 rounded'>
                            {meal.images && meal.images.length > 0 && (
                              <div className='w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0'>
                                <img
                                  src={
                                    getImageUrl(meal.images[0].image) ||
                                    '/placeholder.svg'
                                  }
                                  alt={meal.type}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            )}
                            <div>
                              <h5 className='font-medium text-gray-800 capitalize'>
                                {meal.type}
                              </h5>
                              <p className='text-sm text-gray-600'>
                                {meal.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  {dayPlan.activities && dayPlan.activities.length > 0 && (
                    <div className='mb-6'>
                      <h4 className='font-medium text-gray-800 mb-3'>
                        Activities
                      </h4>
                      <div className='space-y-3'>
                        {dayPlan.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className='flex flex-col md:flex-row gap-4 bg-gray-50 p-3 rounded'>
                            {activity.images && activity.images.length > 0 && (
                              <div className='w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0'>
                                <img
                                  src={
                                    getImageUrl(activity.images[0].image) ||
                                    '/placeholder.svg'
                                  }
                                  alt={activity.name}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            )}
                            <div>
                              <h5 className='font-medium text-gray-800'>
                                {activity.name}
                              </h5>
                              <p className='text-sm text-gray-600'>
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Travels Information */}
        {packageData.travels_name && packageData.travels_name.length > 0 && (
          <div className='border border-gray-200 rounded-lg overflow-hidden mt-6'>
            <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
              <h3 className='font-medium text-gray-800'>Travel Partners</h3>
            </div>
            <div className='p-4'>
              <p className='text-gray-700'>
                {Array.isArray(packageData.travels_name)
                  ? packageData.travels_name.join(', ')
                  : packageData.travels_name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;
