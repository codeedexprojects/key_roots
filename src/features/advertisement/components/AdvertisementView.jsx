import { ArrowLeft, Edit2 } from 'lucide-react';
import { getImageUrl } from '@/lib/getImageUrl';

export const AdvertisementView = ({ item, onEdit, onCancel }) => {
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
          <h2 className='text-lg font-semibold'>View Advertisement</h2>
        </div>

        <button
          onClick={onEdit}
          className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          <Edit2 className='h-4 w-4 mr-2' />
          Edit
        </button>
      </div>

      {/* Banner Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='font-semibold text-gray-900 mb-4'>Banner</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <div className='h-64 rounded-lg overflow-hidden bg-gray-100'>
              <img
                src={getImageUrl(item.banner?.image) || '/placeholder.svg'}
                alt='Banner'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Banner Title
              </label>
              <p className='text-gray-900'>
                {item.banner?.title || 'No title'}
              </p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Banner Description
              </label>
              <p className='text-gray-900'>
                {item.banner?.description || 'No description'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Limited Deals Section */}
      {item.deals && item.deals.length > 0 && (
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>Limited Deals</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {item.deals.map((deal, index) => (
              <div
                key={deal.id || index}
                className='border border-gray-200 rounded-lg p-4'>
                <div className='h-32 rounded-lg overflow-hidden bg-gray-100 mb-3'>
                  <img
                    src={getImageUrl(deal.image) || '/placeholder.svg'}
                    alt={`Deal ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='space-y-2'>
                  <h4 className='font-medium text-gray-900'>
                    {deal.title || 'No title'}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    {deal.description || 'No description'}
                  </p>
                  <p className='text-sm font-medium text-red-600'>
                    {deal.offer || 'No offer'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Section */}
      {item.footers && item.footers.length > 0 && (
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>Footer Section</h3>
          <div className='space-y-4'>
            {item.footers.map((footer, index) => (
              <div
                key={footer.id || index}
                className='border border-gray-200 rounded-lg p-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='h-32 rounded-lg overflow-hidden bg-gray-100'>
                    <img
                      src={getImageUrl(footer.image) || '/placeholder.svg'}
                      alt={`Footer ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Title
                        </label>
                        <p className='text-gray-900'>
                          {footer.title || 'No title'}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Phone
                        </label>
                        <p className='text-gray-900'>
                          {footer.phone || 'No phone'}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Description
                        </label>
                        <p className='text-gray-900'>
                          {footer.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Price
                        </label>
                        <p className='text-gray-900'>
                          {footer.price || 'No price'}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Offer Price
                        </label>
                        <p className='text-gray-900'>
                          {footer.offerPrice || 'No offer price'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
