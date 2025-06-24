import { Link } from 'react-router';
import { MapPin, Bus, Package, Calendar } from 'lucide-react';

export const VendorCard = ({ vendor }) => {
  return (
    <Link
      to={`/admin/vendors/${vendor.id}`}
      className='block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
      <div className='p-4'>
        <div className='flex items-center mb-4'>
          <div className='h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0'>
            <img
              src={vendor.image || '/placeholder.svg?height=48&width=48'}
              alt={vendor.name || 'Vendor'}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='ml-3'>
            <h3 className='font-semibold text-gray-900 truncate'>
              {vendor.name || 'Unnamed Vendor'}
            </h3>
            <div className='flex items-center text-gray-500 text-sm'>
              <MapPin className='h-3.5 w-3.5 mr-1' />
              <span>{vendor.location || 'Unknown Location'}</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-2 mb-4'>
          <div className='text-center'>
            <div className='flex items-center justify-center text-gray-500 mb-1'>
              <Bus className='h-4 w-4 mr-1' />
            </div>
            <p className='text-sm font-medium'>{vendor.busesCount}</p>
            <p className='text-xs text-gray-500'>Buses</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center text-gray-500 mb-1'>
              <Package className='h-4 w-4 mr-1' />
            </div>
            <p className='text-sm font-medium'>{vendor.packagesCount}</p>
            <p className='text-xs text-gray-500'>Packages</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center text-gray-500 mb-1'>
              <Calendar className='h-4 w-4 mr-1' />
            </div>
            <p className='text-sm font-medium'>{vendor.bookings}</p>
            <p className='text-xs text-gray-500'>Bookings</p>
          </div>
        </div>

        <div className='flex justify-between text-sm'>
          <div>
            <span className='text-green-500 font-medium'>
              {vendor.availableBuses}
            </span>
            <span className='text-gray-500 ml-1'>Available</span>
          </div>
          <div>
            <span className='text-blue-500 font-medium'>
              {vendor.ongoingBuses}
            </span>
            <span className='text-gray-500 ml-1'>Ongoing</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
