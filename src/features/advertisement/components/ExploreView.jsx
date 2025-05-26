import { ArrowLeft, Edit2 } from 'lucide-react';
import { getImageUrl } from '@/lib/getImageUrl';

export const ExploreView = ({ item, onEdit, onCancel }) => {
  if (!item) return null;

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <button
            type='button'
            onClick={onCancel}
            className='inline-flex items-center text-gray-600 hover:text-gray-900 mr-4'>
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back
          </button>
          <h2 className='text-lg font-semibold'>
            View Explore Item (ID: {item.id})
          </h2>
        </div>

        <button
          onClick={onEdit}
          className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          <Edit2 className='h-4 w-4 mr-2' />
          Edit
        </button>
      </div>

      {/* Main Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='font-semibold text-gray-900 mb-4'>{item.title}</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            {item.images && item.images.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {item.images.map((image, index) => (
                  <div
                    key={index}
                    className='h-64 rounded-lg overflow-hidden bg-gray-100'>
                    <img
                      src={getImageUrl(image) || '/placeholder.svg'}
                      alt={`Main Image ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className='h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center'>
                <p className='text-gray-500'>No images available</p>
              </div>
            )}
          </div>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <p className='text-gray-900'>
                {item.description || 'No description'}
              </p>
            </div>
          </div>
        </div>

        {/* Perfect Season to Go Section */}
        <div className='mb-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>
            Perfect season to go
          </h3>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {item.seasons && item.seasons.length > 0 ? (
              item.seasons.map((season, seasonIndex) => (
                <div
                  key={seasonIndex}
                  className='border border-gray-200 rounded-lg p-6'>
                  <h4 className='font-medium text-gray-900 mb-4'>
                    Season {seasonIndex + 1}
                  </h4>

                  <div className='flex items-center space-x-3 mb-6'>
                    <span className='text-gray-600'>
                      {season.seasonStartMonth || 'Jan'}
                    </span>
                    <span className='text-gray-600'>To</span>
                    <span className='text-gray-600'>
                      {season.seasonEndMonth || 'Dec'}
                    </span>
                  </div>

                  <div className='mb-4'>
                    <h5 className='font-medium text-gray-900'>
                      {season.seasonHeading || 'No heading'}
                    </h5>
                  </div>

                  <div className='space-y-4'>
                    {season.seasonTags && season.seasonTags.length > 0 ? (
                      season.seasonTags.map((tag, tagIndex) => (
                        <div
                          key={tagIndex}
                          className='flex items-center space-x-3'>
                          <div className='w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0'>
                            <img
                              src={getImageUrl(tag.image) || '/placeholder.svg'}
                              alt={`Tag ${tagIndex + 1}`}
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <p className='text-gray-900'>
                            {tag.description || 'No description'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className='text-gray-500'>No season tags available</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No seasons available</p>
            )}
          </div>
        </div>

        {/* Experiences Section */}
        {item.experiences && item.experiences.length > 0 ? (
          <div>
            <h3 className='font-semibold text-gray-900 mb-4'>
              Sights and Experience
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {item.experiences.map((experience, index) => (
                <div
                  key={index}
                  className='border border-gray-200 rounded-lg p-4'>
                  {experience.images && experience.images.length > 0 ? (
                    <div className='grid grid-cols-1 gap-2 mb-3'>
                      {experience.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className='h-32 rounded-lg overflow-hidden bg-gray-100'>
                          <img
                            src={getImageUrl(image) || '/placeholder.svg'}
                            alt={`Experience ${index + 1} Image ${
                              imgIndex + 1
                            }`}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-3'>
                      <p className='text-gray-500'>No images available</p>
                    </div>
                  )}
                  <div className='space-y-2'>
                    <h5 className='font-medium text-gray-900'>
                      {experience.header || 'No header'}
                    </h5>
                    <p className='text-sm text-gray-600'>
                      {experience.subHeader || 'No subheader'}
                    </p>
                    <p className='text-sm text-gray-900'>
                      {experience.description || 'No description'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className='text-gray-500'>No experiences available</p>
        )}
      </div>
    </div>
  );
};
