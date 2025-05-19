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
        const data = await getPackageDetails(vendorId, packageId);
        console.log('Package details data:', data);

        if (data) {
          setPackageDetails(data);
        }
      } catch (error) {
        console.error('Error fetching package details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId && packageId) {
      fetchPackageDetails();
    }
  }, [vendorId, packageId]);

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
                    ₹{packageDetails.price_per_person}{' '}
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
                <h3 className='text-lg font-semibold mb-3'>Package Details</h3>
                <div className='space-y-2'>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Travels Name:</span>{' '}
                    {packageDetails.travels_name}
                  </p>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Location:</span>{' '}
                    {packageDetails.travels_location}
                  </p>
                  {packageDetails.average_rating && (
                    <p className='text-gray-700'>
                      <span className='font-medium'>Rating:</span>{' '}
                      {packageDetails.average_rating}/5 (
                      {packageDetails.total_reviews} reviews)
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='itinerary'
              className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Itinerary</h3>
                <p className='text-gray-500 italic'>
                  Itinerary details not available.
                </p>
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
