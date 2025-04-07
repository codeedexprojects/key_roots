import { Plus } from 'lucide-react';

export const ExploreGrid = ({ items, isLoading, onEdit, onAddNew }) => {
  // Sample data for demonstration
  const sampleItems = [
    {
      id: 1,
      image: '/placeholder.svg?height=200&width=300',
      title: 'Discover the magic of varkala cliff',
      description:
        'Experience the breathtaking views and serene atmosphere of Varkala Cliff, a paradise for beach lovers and nature enthusiasts.',
    },
    {
      id: 2,
      image: '/placeholder.svg?height=200&width=300',
      title: 'Wayanad - Serenity',
      description:
        'Immerse yourself in the tranquil beauty of Wayanad, where lush forests and misty mountains create a perfect retreat.',
    },
    {
      id: 3,
      image: '/placeholder.svg?height=200&width=300',
      title: 'Why is Munnar a must?',
      description:
        'Discover the enchanting tea plantations and cool climate that make Munnar a must-visit destination in Kerala.',
    },
    {
      id: 4,
      image: '/placeholder.svg?height=200&width=300',
      title: 'Shimla, more than just winter retreat',
      description:
        'Explore the colonial charm and natural beauty of Shimla that makes it a year-round destination.',
    },
    {
      id: 5,
      image: '/placeholder.svg?height=200&width=300',
      title: 'Taj Mahal - Wonder of the World',
      description:
        'Behold the beauty of the Taj Mahal, a testament to eternal love and architectural brilliance.',
    },
    {
      id: 6,
      image: '/placeholder.svg?height=200&width=300',
      title: 'Why do foreigners visit Ladakh?',
      description:
        'Discover the rugged landscapes, Buddhist monasteries, and unique culture that attract visitors from around the world.',
    },
  ];

  // Use sample data if no items are provided
  const displayItems = items.length > 0 ? items : sampleItems;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
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
        {displayItems.map((item) => (
          <div
            key={item.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => onEdit(item)}>
            <div className='h-48 overflow-hidden'>
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.title}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-4'>
              <h3 className='font-semibold text-gray-900 mb-2'>{item.title}</h3>
              <p className='text-sm text-gray-600 line-clamp-2'>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
