import { getImageUrl } from '@/lib/getImageUrl';
import { MapPin, Calendar, Hash, EditIcon } from 'lucide-react';
import { Link } from 'react-router';

export const PackageCard = ({ pkg, vendorId, onEdit }) => {
  console.log('PackageCard:', pkg);
  
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        {onEdit && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(pkg);
            }}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-blue-600"
            aria-label="Edit package"
          >
            <EditIcon className="w-4 h-4" />
          </button>
        )}
       
      </div>
      
      <Link
        to={
          vendorId
            ? `/admin/vendors/${vendorId}/packages/${pkg.id}`
            : `/admin/category/packages/${pkg.id}`
        }
        className='block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'
      >
        <div className='h-48 bg-gray-200 overflow-hidden'>
          <img
            src={
              getImageUrl(pkg.image) ||
              'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
            }
            alt={pkg.destination}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='p-4'>
          <h3 className='font-semibold text-lg mb-2 truncate'>
            {pkg.destination}
          </h3>
  
          <div className='flex items-center text-gray-500 mb-2'>
            <MapPin className='h-4 w-4 mr-2' />
            <span className='text-sm line-clamp-1'>{pkg.route}</span>
          </div>
  
          <div className='flex items-center text-gray-500 mb-2'>
            <Calendar className='h-4 w-4 mr-2' />
            <span className='text-sm'>Available: {pkg.availableDates}</span>
          </div>
  
          <div className='flex items-center text-gray-500'>
            <Hash className='h-4 w-4 mr-2' />
            <span className='text-sm'>Package ID: {pkg.id}</span>
          </div>
  
          <div className='mt-4 pt-3 border-t'>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pkg.status === 'Open'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
              {pkg.status}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};