import { MapPin } from 'lucide-react';

const SightCard = ({ sights }) => {
  return (
    <div className='space-y-4'>
      {sights.map((sight) => (
        <div
          key={sight.id}
          className='flex items-start'>
          <MapPin className='h-5 w-5 text-gray-400 mr-2 mt-0.5 shrink-0' />
          <div className='flex-1'>
            <p className='text-gray-700'>{sight.place}</p>
          </div>
          <div className='ml-4 w-24 h-16 rounded-md overflow-hidden'>
            <img
              src={sight.image || '/placeholder.svg'}
              alt={sight.place}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SightCard;
