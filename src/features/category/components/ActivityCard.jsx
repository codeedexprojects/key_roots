import { Users } from 'lucide-react';

const ActivityCard = ({ activity }) => {
  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <div className='md:w-2/3'>
        <div className='flex items-center mb-2'>
          <Users className='h-5 w-5 text-gray-400 mr-2' />
          <span className='text-sm text-gray-600'>Tour</span>
        </div>

        <h3 className='text-lg font-semibold mb-2'>{activity.title}</h3>
        <p className='text-sm text-gray-600'>{activity.description}</p>
      </div>

      <div className='md:w-1/3'>
        <div className='rounded-lg overflow-hidden h-40'>
          <img
            src={activity.image || '/placeholder.svg'}
            alt={activity.title}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
