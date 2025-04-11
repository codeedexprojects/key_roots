import { Building2, MapPin, Star } from 'lucide-react';

const StayCard = ({ stay }) => {
  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <div className='md:w-2/3'>
        <h3 className='text-lg font-semibold mb-2'>{stay.name}</h3>

        <div className='flex items-center mb-2'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(stay.rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className='ml-2 text-sm text-gray-600'>{stay.rating}</span>
        </div>

        <div className='flex items-center text-sm text-gray-600 mb-2'>
          <MapPin className='h-4 w-4 mr-1' />
          <span>
            {stay.location} • {stay.distance}
          </span>
        </div>

        <div className='space-y-2 mt-4'>
          {stay.facilities.map((facility, index) => (
            <div
              key={index}
              className='flex items-center text-sm'>
              <Building2 className='h-4 w-4 text-gray-400 mr-2' />
              <span>{facility}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='md:w-1/3'>
        <div className='rounded-lg overflow-hidden h-40'>
          <img
            src={stay.image || '/placeholder.svg'}
            alt={stay.name}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default StayCard;
