import { Plus } from 'lucide-react';
import { getImageUrl } from '@/lib/getImageUrl';
import { LoadingSpinner, EmptyState } from '@/components/common';

export const AdvertisementGrid = ({ items, isLoading, onEdit, onAddNew }) => {
  // Use provided items
  const displayItems = items || [];

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>Advertisements</h2>
          <button
            onClick={onAddNew}
            className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Plus className='h-4 w-4 mr-2' />
            Add New
          </button>
        </div>

        <EmptyState
          title='No advertisements found'
          description='Create your first advertisement to get started.'
          actionLabel='Add Advertisement'
          onAction={onAddNew}
          icon='default'
        />
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>Advertisements</h2>
        <button
          onClick={onAddNew}
          className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          <Plus className='h-4 w-4 mr-2' />
          Add New
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {displayItems.map((item) => (
          <div
            key={item.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => onEdit(item)}>
            <div className='h-48 overflow-hidden'>
              <img
                src={getImageUrl(item.banner.image) || '/placeholder.svg'}
                alt={item.banner.title}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-4'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                {item.banner.title}
              </h3>
              <p className='text-sm text-gray-600 line-clamp-2'>
                {item.banner.description}
              </p>

              {item.deals.length > 0 && (
                <div className='mt-3'>
                  <p className='text-xs font-medium text-gray-500 uppercase mb-1'>
                    Deals
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {item.deals.map((deal, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800'>
                        {deal.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.footers.length > 0 && (
                <div className='mt-2'>
                  <p className='text-xs font-medium text-gray-500 uppercase mb-1'>
                    Footer Items
                  </p>
                  <p className='text-xs text-gray-600'>
                    {item.footers.length} item(s)
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
