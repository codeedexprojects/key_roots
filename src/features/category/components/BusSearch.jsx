import { useState } from 'react';
import { Search, Filter, Settings } from 'lucide-react';
import AmenitiesModal from '../components/AmenetiesModal';

const BusSearch = ({
  searchQuery,
  setSearchQuery,
  searchFields,
  setSearchFields,
  busCount,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);

  const handleFieldToggle = (field) => {
    setSearchFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const searchFieldOptions = [
    { key: 'name', label: 'Bus Name' },
    { key: 'number', label: 'Vehicle Number' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Bus Type' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search Input */}
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
              <input
                type='text'
                placeholder='Search buses...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
              <Filter className='h-4 w-4' />
              Filters
            </button>

            <button
              onClick={() => setShowAmenities(true)}
              className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
              <Settings className='h-4 w-4' />
              Amenities
            </button>
          </div>
        </div>

        {/* Search Filters */}
        {showFilters && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <h4 className='text-sm font-medium text-gray-700 mb-3'>
              Search in fields:
            </h4>
            <div className='flex flex-wrap gap-2'>
              {searchFieldOptions.map(({ key, label }) => (
                <label
                  key={key}
                  className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={searchFields[key] || false}
                    onChange={() => handleFieldToggle(key)}
                    className='rounded border-gray-300 text-red-600 focus:ring-red-500'
                  />
                  <span className='text-sm text-gray-600'>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {searchQuery && (
          <div className='mt-3 pt-3 border-t border-gray-200'>
            <p className='text-sm text-gray-600'>
              Found <span className='font-medium'>{busCount}</span> buses
              {searchQuery && <span> matching {searchQuery}</span>}
            </p>
          </div>
        )}
      </div>

      {/* Amenities Modal */}
      <AmenitiesModal
        isOpen={showAmenities}
        onClose={() => setShowAmenities(false)}
      />
    </>
  );
};

export default BusSearch;
