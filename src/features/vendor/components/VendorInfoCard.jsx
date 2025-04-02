import { MapPin, Mail, Phone, User, Hash } from 'lucide-react';

export const VendorInfoCard = ({ vendor }) => {
  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
      <div className='p-6'>
        <div className='flex flex-col sm:flex-row items-center sm:items-start mb-6'>
          <div className='h-24 w-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 mb-4 sm:mb-0'>
            <img
              src={vendor.image || '/placeholder.svg?height=96&width=96'}
              alt={vendor.name}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='sm:ml-6 text-center sm:text-left'>
            <h2 className='text-xl font-semibold text-gray-900'>
              {vendor.name}
            </h2>
            <div className='flex items-center justify-center sm:justify-start text-gray-500 mt-1'>
              <Hash className='h-4 w-4 mr-1' />
              <span className='text-sm'>Vendor ID: {vendor.id}</span>
            </div>
            <div className='flex items-center justify-center sm:justify-start text-gray-500 mt-1'>
              <MapPin className='h-4 w-4 mr-1' />
              <span className='text-sm'>{vendor.location}</span>
            </div>
          </div>
        </div>

        <div className='border-t pt-4'>
          <h3 className='font-semibold text-gray-900 mb-4'>
            Contact Information
          </h3>

          <div className='space-y-3'>
            <div className='flex items-start'>
              <User className='h-5 w-5 text-gray-500 mr-3 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500'>Contact Person</p>
                <p className='font-medium'>
                  {vendor.contactPerson || vendor.name}
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <Phone className='h-5 w-5 text-gray-500 mr-3 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500'>Phone Number</p>
                <p className='font-medium'>{vendor.phone}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <Mail className='h-5 w-5 text-gray-500 mr-3 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500'>Email Address</p>
                <p className='font-medium'>{vendor.email}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <MapPin className='h-5 w-5 text-gray-500 mr-3 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500'>Address</p>
                <p className='font-medium'>{vendor.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
