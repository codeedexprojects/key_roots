import { getImageUrl } from '@/lib/getImageUrl';
import { Plus } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';

export const AdvertisementGrid = ({
  items,
  isLoading,
  onEdit,
  onView,
  onAddNew,
}) => {
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
            className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
            <div className='h-48 overflow-hidden'>
              <img
                src={getImageUrl(item.banner?.image) || '/placeholder.svg'}
                alt={item.banner?.title || 'Advertisement'}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-4'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                {item.banner?.title || 'Untitled Advertisement'}
              </h3>
              <p className='text-sm text-gray-600 line-clamp-2 mb-4'>
                {item.banner?.description || 'No description available'}
              </p>
              <div className='flex space-x-2'>
                <button
                  onClick={() => onView(item)}
                  className='flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                  View
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className='flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
