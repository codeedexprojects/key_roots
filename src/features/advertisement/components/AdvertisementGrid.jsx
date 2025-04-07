import { Plus } from 'lucide-react';

export const AdvertisementGrid = ({ items, isLoading, onEdit, onAddNew }) => {
  // Sample data for demonstration
  const sampleItems = [
    {
      id: 1,
      banner: {
        image: '/placeholder.svg?height=200&width=300',
        title: 'Summer Special Offers',
        description:
          'Enjoy amazing discounts on all summer destinations. Book now for the best deals!',
      },
      deals: [
        {
          image: '/placeholder.svg?height=150&width=150',
          title: 'Beach Getaway',
          description: 'Relax on pristine beaches',
          offer: '20% OFF',
        },
        {
          image: '/placeholder.svg?height=150&width=150',
          title: 'Mountain Retreat',
          description: 'Escape to the mountains',
          offer: '15% OFF',
        },
      ],
      footers: [
        {
          image: '/placeholder.svg?height=150&width=150',
          title: 'Premium Bus Service',
          phone: '+91 9876543210',
          description: 'Luxury travel experience',
          price: '₹5000',
          offerPrice: '₹4200',
        },
      ],
    },
    {
      id: 2,
      banner: {
        image: '/placeholder.svg?height=200&width=300',
        title: 'Monsoon Packages',
        description:
          'Experience the beauty of rain with our special monsoon packages. Limited time offers!',
      },
      deals: [
        {
          image: '/placeholder.svg?height=150&width=150',
          title: 'Waterfall Tour',
          description: 'Visit stunning waterfalls',
          offer: '25% OFF',
        },
      ],
      footers: [
        {
          image: '/placeholder.svg?height=150&width=150',
          title: 'Deluxe Accommodation',
          phone: '+91 9876543211',
          description: 'Stay in comfort',
          price: '₹3500',
          offerPrice: '₹2800',
        },
      ],
    },
    {
      id: 3,
      banner: {
        image: '/placeholder.svg?height=200&width=300',
        title: 'Festival Special',
        description:
          'Celebrate festivals with our special travel packages. Book early for best rates!',
      },
      deals: [
        {
          image: '/placeholder.svg?height=150&width=150',
          title: 'Cultural Tour',
          description: 'Immerse in local culture',
          offer: '10% OFF',
        },
        {
          image: '/placeholder.svg?height=150&width=150',
          title: 'Food Festival',
          description: 'Taste local cuisines',
          offer: '15% OFF',
        },
      ],
      footers: [],
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
                src={item.banner.image || '/placeholder.svg'}
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
