const PackageCardGrid = ({ packages, isLoading }) => {
  // Sample data for demonstration
  const samplePackages = [
    {
      id: 1,
      title: 'Packages',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 2,
      title: '1 Day trip',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 3,
      title: 'Pilgrimage',
      image: '/placeholder.svg?height=200&width=300',
    },
  ];

  // Use sample data if no packages are provided
  const displayPackages = packages.length > 0 ? packages : samplePackages;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {displayPackages.map((pkg) => (
        <div
          key={pkg.id}
          className='bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center p-6'>
          <div className='h-48 w-48 mb-4'>
            <img
              src={pkg.image || '/placeholder.svg'}
              alt={pkg.title}
              className='h-full w-full object-contain'
            />
          </div>
          <h3 className='text-lg font-semibold text-center text-gray-900'>
            {pkg.title}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default PackageCardGrid;
