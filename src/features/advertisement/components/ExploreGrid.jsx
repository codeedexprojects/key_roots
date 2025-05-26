import { getImageUrl } from '@/lib/getImageUrl';
import { Plus, Trash2 } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/common';

export const ExploreGrid = ({
  items,
  isLoading,
  onEdit,
  onView,
  onDelete,
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
          <h2 className='text-lg font-semibold'>Explore Items</h2>
          <button
            onClick={onAddNew}
            className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Plus className='h-4 w-4 mr-2' />
            Add New
          </button>
        </div>

        <EmptyState
          title='No explore items found'
          description='Create your first explore item to get started.'
          actionLabel='Add Explore Item'
          onAction={onAddNew}
          icon='default'
        />
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>Explore Items</h2>
        <button
          onClick={onAddNew}
          className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          <Plus className='h-4 w-4 mr-2' />
          Add New
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {displayItems.map((item) => {
          // Flatten seasonTags from all seasons
          const allSeasonTags =
            item.seasons?.flatMap((season) => season.seasonTags) || [];

          return (
            <div
              key={item.id}
              className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
              {/* Clickable card area for navigation to details */}
              <div
                onClick={() => onView(item)}
                className='cursor-pointer'>
                <div className='h-48 overflow-hidden'>
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? getImageUrl(item.images[0])
                        : '/placeholder.svg'
                    }
                    alt={item.title}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='p-4 pb-2'>
                  <h3 className='font-semibold text-gray-900 mb-2'>
                    {item.title}
                  </h3>
                  <p className='text-sm text-gray-600 line-clamp-2 mb-4'>
                    {item.description}
                  </p>

                  {/* Season Tags */}
                  {allSeasonTags.length > 0 ? (
                    <div className='flex flex-wrap gap-1 mb-4'>
                      {allSeasonTags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          {tag.description?.substring(0, 15)}...
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className='text-sm text-gray-500 mb-4'>
                      No season tags available
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons - not clickable for card navigation */}
              <div className='px-4 pb-4'>
                <div className='flex space-x-2'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                    className='flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center'>
                    <Trash2 className='h-4 w-4 mr-1' />
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className='flex-1 px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
