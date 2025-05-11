import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SightCard from '../components/SightCard';
import StayCard from '../components/StayCard';
import MealCard from '../components/MealCard';
import ActivityCard from '../components/ActivityCard';
import { getPackageDetails } from '../services/categoryService.js';
import { LoadingSpinner, EmptyState } from '@/components/common';

export const PackageDetailsPage = () => {
  const { packageId } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sightseeing');

  const fetchPackageDetails = async () => {
    setIsLoading(true);
    try {
      const data = await getPackageDetails(packageId);
      setPackageDetails(data);
    } catch (error) {
      console.error('Error fetching package details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageDetails();
  }, [packageId]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (!packageDetails && !isLoading) {
    return (
      <EmptyState
        title='Package not found'
        description='The requested package could not be found.'
        icon='package'
      />
    );
  }

  // Sample data for demonstration
  const samplePackageDetails = {
    id: packageId,
    name: 'Komban Holidays',
    numberPlate: 'KL 58M 6018',
    packagePlaces: ['Munnar', 'Varkala'],
    guideAvailability: 'Yes',
    type: 'Non-AC',
    duration: {
      days: 2,
      nights: 3,
    },
    price: '₹5500/person',
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
      facilities: ['Breakfast Included', 'Standard non AC'],
      image: '/placeholder.svg?height=200&width=300',
    },
    meals: {
      type: 'Lunch',
      location: 'Munnar',
      name: 'Backwater Banquet',
      description:
        "Get a taste of Kerala with a delicious, authentic meal at an exotic restaurant. Relish kerala's seafood, curries, and more. You can enjoy the experience en route from Varkala to Munnar.",
      image: '/placeholder.svg?height=200&width=300',
    },
    activity: {
      title: 'Tour manager assistance',
      description:
        'Get personalized on-ground assistance from a tour manager. Our tour manager is multilingual and stationed at the destination to help and guide you through the tour.',
      image: '/placeholder.svg?height=200&width=300',
    },
  };

  // Use sample data if no package details are provided
  const details = packageDetails || samplePackageDetails;

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

                <div>
                  <p className='text-sm text-gray-500'>Price</p>
                  <p className='font-medium text-red-600'>{details.price}</p>
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
