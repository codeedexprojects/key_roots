import { Search, X } from 'lucide-react';

const BusSearch = ({
  searchQuery,
  setSearchQuery,
  searchFields,
  setSearchFields,
  busCount,
}) => {
  const handleFieldToggle = (field) => {
    setSearchFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className='mb-6'>
      <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search buses by name, number, location...'
            className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          {Object.entries(searchFields).map(([field, enabled]) => (
            <button
              key={field}
              onClick={() => handleFieldToggle(field)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                enabled
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}>
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-3 text-sm text-gray-500'>
        {searchQuery ? (
          <p>
            Found {busCount} {busCount === 1 ? 'bus' : 'buses'} matching
            {searchQuery}
          </p>
        ) : (
          <p>Showing all {busCount} buses</p>
        )}
      </div>
    </div>
  );
};

export default BusSearch;
