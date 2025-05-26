import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPackageDetails } from '../services/vendorService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getImageUrl } from '@/lib/getImageUrl';

export const PackageDetailsPage = () => {
  const { packageId, vendorId } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getPackageDetails(packageId);
        console.log(response);

        if (response && response.data) {
          setPackageDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching package details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

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
                src={
                  getImageUrl(packageDetails.header_image) || '/placeholder.svg'
                }
                alt={packageDetails.places}
                className='w-full h-64 object-cover rounded-lg'
              />
            </div>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
                {packageDetails.places}
              </h1>
              <p className='text-gray-600 mb-4'>
                {packageDetails.sub_category?.name}
              </p>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>Duration</p>
                  <div className='flex items-center'>
                    <Calendar className='h-4 w-4 mr-2 text-gray-500' />
                    <p className='font-medium'>{packageDetails.days} days</p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Destinations</p>
                  <div className='flex items-center'>
                    <MapPin className='h-4 w-4 mr-2 text-gray-500' />
                    <p className='font-medium'>{packageDetails.places}</p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Travels Name</p>
                  <p className='font-medium'>
                    {Array.isArray(packageDetails.travels_name)
                      ? packageDetails.travels_name.join(', ')
                      : packageDetails.travels_name}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>AC Available</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        packageDetails.ac_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {packageDetails.ac_available ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Guide Included</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        packageDetails.guide_included
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {packageDetails.guide_included ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Price per Person</p>
                    <p className='text-xl font-semibold text-blue-600'>
                      ₹{packageDetails.price_per_person}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Extra Charge per KM</p>
                    <p className='text-lg font-semibold text-blue-600'>
                      ₹{packageDetails.extra_charge_per_km}
                    </p>
                  </div>
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
                <h3 className='text-lg font-semibold mb-3'>Package Details</h3>
                <div className='space-y-2'>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Category:</span>{' '}
                    {packageDetails.sub_category?.name}
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Travels Name:</span>{' '}
                    {Array.isArray(packageDetails.travels_name)
                      ? packageDetails.travels_name.join(', ')
                      : packageDetails.travels_name}
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Places:</span>{' '}
                    {packageDetails.places}
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Duration:</span>{' '}
                    {packageDetails.days} days
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>AC Available:</span>{' '}
                    {packageDetails.ac_available ? 'Yes' : 'No'}
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Guide Included:</span>{' '}
                    {packageDetails.guide_included ? 'Yes' : 'No'}
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Created:</span>{' '}
                    {new Date(packageDetails.created_at).toLocaleDateString()}
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Updated:</span>{' '}
                    {new Date(packageDetails.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='itinerary'
              className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Itinerary</h3>
                {packageDetails.day_plans &&
                packageDetails.day_plans.length > 0 ? (
                  <div className='space-y-6'>
                    {packageDetails.day_plans.map((dayPlan) => (
                      <div
                        key={dayPlan.id}
                        className='border rounded-lg p-4'>
                        <h4 className='text-lg font-semibold mb-3'>
                          Day {dayPlan.day_number}
                        </h4>
                        <p className='text-gray-700 mb-4'>
                          {dayPlan.description}
                        </p>

                        {/* Places */}
                        {dayPlan.places && dayPlan.places.length > 0 && (
                          <div className='mb-4'>
                            <h5 className='font-medium mb-2'>
                              Places to Visit:
                            </h5>
                            <div className='space-y-2'>
                              {dayPlan.places.map((place) => (
                                <div
                                  key={place.id}
                                  className='bg-gray-50 p-3 rounded'>
                                  <h6 className='font-medium'>{place.name}</h6>
                                  <p className='text-sm text-gray-600'>
                                    {place.description}
                                  </p>
                                  {place.images && place.images.length > 0 && (
                                    <div className='flex space-x-2 mt-2'>
                                      {place.images.slice(0, 3).map((img) => (
                                        <img
                                          key={img.id}
                                          src={getImageUrl(img.image)}
                                          alt='Place'
                                          className='w-16 h-16 object-cover rounded'
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stay */}
                        {dayPlan.stay && (
                          <div className='mb-4'>
                            <h5 className='font-medium mb-2'>Accommodation:</h5>
                            <div className='bg-gray-50 p-3 rounded'>
                              <h6 className='font-medium'>
                                {dayPlan.stay.hotel_name}
                              </h6>
                              <p className='text-sm text-gray-600'>
                                {dayPlan.stay.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Meals */}
                        {dayPlan.meals && dayPlan.meals.length > 0 && (
                          <div className='mb-4'>
                            <h5 className='font-medium mb-2'>Meals:</h5>
                            <div className='space-y-2'>
                              {dayPlan.meals.map((meal) => (
                                <div
                                  key={meal.id}
                                  className='bg-gray-50 p-3 rounded'>
                                  <h6 className='font-medium capitalize'>
                                    {meal.type}
                                  </h6>
                                  <p className='text-sm text-gray-600'>
                                    {meal.description}
                                  </p>
                                  {meal.images && meal.images.length > 0 && (
                                    <div className='flex space-x-2 mt-2'>
                                      {meal.images.slice(0, 3).map((img) => (
                                        <img
                                          key={img.id}
                                          src={getImageUrl(img.image)}
                                          alt='Meal'
                                          className='w-16 h-16 object-cover rounded'
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        {dayPlan.activities &&
                          dayPlan.activities.length > 0 && (
                            <div className='mb-4'>
                              <h5 className='font-medium mb-2'>Activities:</h5>
                              <div className='space-y-2'>
                                {dayPlan.activities.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className='bg-gray-50 p-3 rounded'>
                                    <h6 className='font-medium'>
                                      {activity.name}
                                    </h6>
                                    <p className='text-sm text-gray-600'>
                                      {activity.description}
                                    </p>
                                    {activity.images &&
                                      activity.images.length > 0 && (
                                        <div className='flex space-x-2 mt-2'>
                                          {activity.images
                                            .slice(0, 3)
                                            .map((img) => (
                                              <img
                                                key={img.id}
                                                src={getImageUrl(img.image)}
                                                alt='Activity'
                                                className='w-16 h-16 object-cover rounded'
                                              />
                                            ))}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 italic'>
                    No itinerary details available.
                  </p>
                )}
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
                  <p className='text-gray-500 italic'>
                    Inclusion details not available.
                  </p>
                </div>
                <div>
                  <h3 className='text-lg font-semibold mb-3 flex items-center'>
                    <X className='h-5 w-5 text-red-500 mr-2' />
                    Exclusions
                  </h3>
                  <p className='text-gray-500 italic'>
                    Exclusion details not available.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
