import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPackageDetails } from '../services/vendorService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const PackageDetailsPage = () => {
  const { packageId, vendorId } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchPackageData = async () => {
      setIsLoading(true);
      try {
        const data = await getPackageDetails(vendorId, packageId);
        if (data) {
          setPackageDetails(data);
        } else {
          // If no data is returned, use sample data for demonstration
          setPackageDetails(samplePackageDetails);
        }
      } catch (error) {
        console.error('Error fetching package details:', error);
        // Use sample data as fallback
        setPackageDetails(samplePackageDetails);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageData();
  }, [packageId, vendorId]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (!packageDetails) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
        <p className='text-gray-500'>Package not found.</p>
        <Link
          to={vendorId ? `/vendors/${vendorId}` : '/vendors'}
          className='mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
          Back to Vendor
        </Link>
      </div>
    );
  }

  // Sample package details data
  const samplePackageDetails = {
    id: packageId,
    places: 'New Delhi, Agra, Jaipur',
    days: 5,
    nights: 4,
    ac_available: true,
    guide_included: true,
    sub_category_name: 'Golden Triangle Tour',
    description:
      "Experience the rich history and culture of India's Golden Triangle. Visit iconic landmarks like the Taj Mahal, Red Fort, and Amber Palace.",
    price: '₹25,000',
    image: '/placeholder.svg?height=400&width=600',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Delhi',
        description:
          "Arrive in Delhi and transfer to your hotel. Evening visit to Qutub Minar and Humayun's Tomb.",
        image: '/placeholder.svg?height=150&width=200',
      },
      {
        day: 2,
        title: 'Delhi City Tour',
        description:
          'Full day sightseeing in Delhi including Red Fort, Jama Masjid, India Gate, and Lotus Temple.',
        image: '/placeholder.svg?height=150&width=200',
      },
      {
        day: 3,
        title: 'Delhi to Agra',
        description:
          'Drive to Agra. Visit Taj Mahal during sunset. Evening at leisure.',
        image: '/placeholder.svg?height=150&width=200',
      },
      {
        day: 4,
        title: 'Agra to Jaipur',
        description:
          'Morning visit to Agra Fort. Drive to Jaipur via Fatehpur Sikri.',
        image: '/placeholder.svg?height=150&width=200',
      },
      {
        day: 5,
        title: 'Jaipur and Departure',
        description:
          'Visit Amber Fort and City Palace. Transfer to airport for departure.',
        image: '/placeholder.svg?height=150&width=200',
      },
    ],
    inclusions: [
      'Accommodation in 3-star hotels',
      'Daily breakfast and dinner',
      'Air-conditioned private vehicle',
      'Professional tour guide',
      'All entrance fees',
      'Airport transfers',
    ],
    exclusions: [
      'Flights',
      'Personal expenses',
      'Travel insurance',
      'Lunch',
      'Optional activities',
    ],
  };

  return (
    <div className='flex-1 overflow-auto'>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to={vendorId ? `/vendors/${vendorId}` : '/vendors'}
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back to {vendorId ? 'Vendor' : 'Vendors'}</span>
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6'>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <img
                src={packageDetails.image || '/placeholder.svg'}
                alt={packageDetails.places}
                className='w-full h-64 object-cover rounded-lg'
              />
            </div>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
                {packageDetails.places}
              </h1>
              <p className='text-gray-600 mb-4'>
                {packageDetails.sub_category_name}
              </p>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>Duration</p>
                  <div className='flex items-center'>
                    <Calendar className='h-4 w-4 mr-2 text-gray-500' />
                    <p className='font-medium'>
                      {packageDetails.days} days, {packageDetails.nights} nights
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Destinations</p>
                  <div className='flex items-center'>
                    <MapPin className='h-4 w-4 mr-2 text-gray-500' />
                    <p className='font-medium'>{packageDetails.places}</p>
                  </div>
                </div>

                <div className='flex space-x-6'>
                  <div>
                    <p className='text-sm text-gray-500'>AC Available</p>
                    <div className='flex items-center'>
                      {packageDetails.ac_available ? (
                        <Check className='h-4 w-4 mr-2 text-green-500' />
                      ) : (
                        <X className='h-4 w-4 mr-2 text-red-500' />
                      )}
                      <p className='font-medium'>
                        {packageDetails.ac_available ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Guide Included</p>
                    <div className='flex items-center'>
                      {packageDetails.guide_included ? (
                        <Check className='h-4 w-4 mr-2 text-green-500' />
                      ) : (
                        <X className='h-4 w-4 mr-2 text-red-500' />
                      )}
                      <p className='font-medium'>
                        {packageDetails.guide_included ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Price</p>
                  <p className='text-xl font-semibold text-blue-600'>
                    {packageDetails.price}{' '}
                    <span className='text-sm font-normal text-gray-500'>
                      per person
                    </span>
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
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='itinerary'>Itinerary</TabsTrigger>
              <TabsTrigger value='inclusions'>
                Inclusions & Exclusions
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='details'
              className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>
                  Package Description
                </h3>
                <p className='text-gray-700'>{packageDetails.description}</p>
              </div>
            </TabsContent>

            <TabsContent
              value='itinerary'
              className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Itinerary</h3>
                <div className='space-y-6'>
                  {packageDetails.itinerary &&
                    packageDetails.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className='flex items-start border-b pb-4'>
                        <div className='bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center font-semibold mr-3 flex-shrink-0'>
                          {day.day}
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-semibold'>{day.title}</h4>
                          <p className='text-sm text-gray-600 mt-1'>
                            {day.description}
                          </p>
                        </div>
                        {day.image && (
                          <div className='ml-4 w-24 h-16 rounded-md overflow-hidden flex-shrink-0'>
                            <img
                              src={day.image}
                              alt={day.title}
                              className='w-full h-full object-cover'
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='inclusions'
              className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-3 flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-2' />
                    Inclusions
                  </h3>
                  <ul className='space-y-2'>
                    {packageDetails.inclusions &&
                      packageDetails.inclusions.map((item, index) => (
                        <li
                          key={index}
                          className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className='text-lg font-semibold mb-3 flex items-center'>
                    <X className='h-5 w-5 text-red-500 mr-2' />
                    Exclusions
                  </h3>
                  <ul className='space-y-2'>
                    {packageDetails.exclusions &&
                      packageDetails.exclusions.map((item, index) => (
                        <li
                          key={index}
                          className='flex items-start'>
                          <X className='h-4 w-4 text-red-500 mr-2 mt-0.5' />
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
