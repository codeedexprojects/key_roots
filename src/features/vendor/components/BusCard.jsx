import { getImageUrl } from '@/lib/getImageUrl';
import { Users, FileText, EditIcon } from 'lucide-react';
import { Link } from 'react-router';

export const BusCard = ({ bus, vendorId, onEdit }) => {
  return (
     <div className="relative block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {onEdit && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(bus);
          }}
          className="absolute top-2 right-2 z-10 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
          aria-label="Edit bus"
        >
          <EditIcon className="w-4 h-4" />
        </button>
      )}
    <Link
      to={
        vendorId
          ? `/admin/vendors/${vendorId}/buses/${bus.id}`
          : `/admin/category/buses/${bus.id}`
      }
      className='block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
      <div className='h-48 bg-gray-200 overflow-hidden'>
        
        <img
          src={
            getImageUrl(bus.image) ||
            'https://upload.wikimedia.org/wikipedia/commons/3/32/Icon-mode-bus-default.svg'
          }
          alt={bus.title}
          className='h-full w-full object-cover'
        />
      </div>
      <div className='p-4'>
        <h3 className='font-semibold text-lg mb-2 truncate'>{bus.title}</h3>

        <div className='flex items-center text-gray-500 mb-2'>
          <span className='text-sm font-medium mr-2'>Type:</span>
          <span className='text-sm'>{bus.type}</span>
        </div>

        <div className='flex items-center text-gray-500 mb-2'>
          <Users className='h-4 w-4 mr-2' />
          <span className='text-sm'>Capacity: {bus.capacity} seats</span>
        </div>

        <div className='flex items-center text-gray-500'>
          <FileText className='h-4 w-4 mr-2' />
          <span className='text-sm'>RC: {bus.vehicleRC}</span>
        </div>

        <div className='mt-4 pt-3 border-t'>
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              bus.status === 'Available'
                ? 'bg-green-100 text-green-800'
                : bus.status === 'Ongoing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
            {bus.status}
          </div>
        </div>
      </div>
      
    </Link>
    </div>
    
  );
};
