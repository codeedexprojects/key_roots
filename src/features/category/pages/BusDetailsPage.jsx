import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SightCard from '../components/SightCard';
import StayCard from '../components/StayCard';
import MealCard from '../components/MealCard';
import ActivityCard from '../components/ActivityCard';
import { getBusDetails } from '../services/categoryService.js';

export const BusDetailsPage = () => {
  const { busId } = useParams();
  const [busDetails, setBusDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sightseeing');

  const fetchBusDetails = async () => {
    setIsLoading(true);
    try {
      const data = await getBusDetails(busId);
      setBusDetails(data);
    } catch (error) {
      console.error('Error fetching bus details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Sample data for demonstration
  const sampleBusDetails = {
    id: busId,
    name: 'Komban Holidays',
    numberPlate: 'KL 58M 6018',
    packagePlaces: ['Munnar', 'Varkala'],
    guideAvailability: 'Yes',
    type: 'Non-AC',
    duration: {
      days: 2,
      nights: 3,
    },
    image: '/placeholder.svg?height=400&width=600',
    sightseeing: [
      {
        id: 1,
        place: 'Valara waterfall, cheeyappara',
        image: '/placeholder.svg?height=150&width=200',
      },
      {
        id: 2,
        place: 'TATA tea museum, Ernakulam park',
        image: '/placeholder.svg?height=150&width=200',
      },
      {
        id: 3,
        place: 'Chinnakanal waterfalls',
        image: '/placeholder.svg?height=150&width=200',
      },
      {
        id: 4,
        place: 'Mattupetty Dam',
        image: '/placeholder.svg?height=150&width=200',
      },
    ],
    stay: {
      name: 'Deshadan Mountain Resort',
      location: 'Munnar',
      distance: '2.7 km from Centre',
      rating: 4.5,
      facilities: ['Breakfast Included'],
      image: '/placeholder.svg?height=200&width=300',
    },
    meals: {
      type: 'Lunch',
      location: 'Munnar',
      name: 'Backwater Banquet',
      description:
        "Enjoy a taste of Kerala's rich culinary tradition, featuring local spices, seafood, and more. You can enjoy the experience at local hotel.",
      image: '/placeholder.svg?height=200&width=300',
    },
    activity: {
      title: 'Tour manager assistance',
      description:
        'Our experienced tour guides will assist you throughout the trip. They are knowledgeable and attentive at the destination to help navigate and through the tour.',
      image: '/placeholder.svg?height=200&width=300',
    },
  };

  // Use sample data if no bus details are provided
  const details = busDetails || sampleBusDetails;

  return (
    <div className='flex-1 overflow-auto'>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/category'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back to Category</span>
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6'>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <img
                src={details.image || '/placeholder.svg'}
                alt={details.name}
                className='w-full h-64 object-cover rounded-lg'
              />
            </div>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
                {details.name}
              </h1>
              <p className='text-gray-600 mb-4'>{details.numberPlate}</p>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>Package places</p>
                  <p className='font-medium'>
                    {details.packagePlaces.join(', ')}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Guide</p>
                  <p className='font-medium'>{details.guideAvailability}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>AC/Non-AC</p>
                  <p className='font-medium'>{details.type}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Days</p>
                  <p className='font-medium'>
                    {details.duration.days} day, {details.duration.nights} night
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'>
            <TabsList className='mb-6'>
              <TabsTrigger value='sightseeing'>
                Sightseeing in Munnar
              </TabsTrigger>
              <TabsTrigger value='stay'>Stay</TabsTrigger>
              <TabsTrigger value='meals'>Meals</TabsTrigger>
              <TabsTrigger value='activity'>Activity</TabsTrigger>
            </TabsList>

            <TabsContent
              value='sightseeing'
              className='space-y-6'>
              <SightCard sights={details.sightseeing} />
            </TabsContent>

            <TabsContent
              value='stay'
              className='space-y-6'>
              <StayCard stay={details.stay} />
            </TabsContent>

            <TabsContent
              value='meals'
              className='space-y-6'>
              <MealCard meal={details.meals} />
            </TabsContent>

            <TabsContent
              value='activity'
              className='space-y-6'>
              <ActivityCard activity={details.activity} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
