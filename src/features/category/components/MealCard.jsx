import { Utensils, MapPin } from 'lucide-react';

const MealCard = ({ meal }) => {
  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <div className='md:w-2/3'>
        <div className='flex items-center mb-2'>
          <Utensils className='h-5 w-5 text-gray-400 mr-2' />
          <span className='text-sm text-gray-600'>{meal.type}</span>
          <span className='mx-2'>•</span>
          <MapPin className='h-4 w-4 text-gray-400 mr-1' />
          <span className='text-sm text-gray-600'>{meal.location}</span>
        </div>

        <h3 className='text-lg font-semibold mb-2'>{meal.name}</h3>
        <p className='text-sm text-gray-600'>{meal.description}</p>
      </div>

      <div className='md:w-1/3'>
        <div className='rounded-lg overflow-hidden h-40'>
          <img
            src={meal.image || '/placeholder.svg'}
            alt={meal.name}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default MealCard;
