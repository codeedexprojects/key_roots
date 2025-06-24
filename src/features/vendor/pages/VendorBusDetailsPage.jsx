import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Users, FileText, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBusDetails } from '../services/vendorService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getImageUrl } from '@/lib/getImageUrl';

export const VendorBusDetailsPage = () => {
  const { busId, vendorId } = useParams();
  const [busDetails, setBusDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchBusData = async () => {
      setIsLoading(true);
      try {
        const response = await getBusDetails(busId);

        if (response) {
          const data = response;
          const documents = [
            {
              name: 'RC Certificate',
              path: data.rc_certificate,
              status: 'Verified',
            },
            {
              name: 'License',
              path: data.license,
              status: 'Verified',
            },
            {
              name: 'Contract Carriage Permit',
              path: data.contract_carriage_permit,
              status: 'Verified',
            },
            {
              name: 'Passenger Insurance',
              path: data.passenger_insurance,
              status: 'Verified',
            },
            {
              name: 'Vehicle Insurance',
              path: data.vehicle_insurance,
              status: 'Verified',
            },
          ];

          setBusDetails({ ...data, documents });
        }
      } catch (error) {
        console.error('Error fetching bus details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusData();
  }, [busId]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (!busDetails) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
        <p className='text-gray-500'>Bus not found.</p>
        <Link
          to={vendorId ? `/admin/vendors/${vendorId}` : '/vendors'}
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
          to={vendorId ? `/admin/vendors/${vendorId}` : '/vendors'}
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
                  getImageUrl(busDetails.images?.[0]?.bus_view_image) ||
                  getImageUrl(busDetails.travels_logo) ||
                  'https://upload.wikimedia.org/wikipedia/commons/3/32/Icon-mode-bus-default.svg'
                }
                alt={busDetails.bus_name}
                className='w-full h-64 object-cover rounded-lg'
              />
            </div>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
                {busDetails.bus_name}
              </h1>
              <p className='text-gray-600 mb-4'>{busDetails.bus_number}</p>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>Description</p>
                  <p className='font-medium'>
                    {busDetails.vehicle_description}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Capacity</p>
                  <div className='flex items-center'>
                    <Users className='h-4 w-4 mr-2 text-gray-500' />
                    <p className='font-medium'>{busDetails.capacity} seats</p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>RC Number</p>
                  <div className='flex items-center'>
                    <FileText className='h-4 w-4 mr-2 text-gray-500' />
                    <p className='font-medium'>
                      {busDetails.vehicle_rc_number}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Bus Type</p>
                  <p className='font-medium'>{busDetails.bus_type}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Location</p>
                  <p className='font-medium'>{busDetails.location}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Status</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      busDetails.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {busDetails.status}
                  </span>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Rating</p>
                  <p className='font-medium'>
                    {busDetails.average_rating}/5 ({busDetails.total_reviews}{' '}
                    reviews)
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Base Price</p>
                    <p className='text-lg font-semibold text-blue-600'>
                      ₹{busDetails.base_price}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Price per KM</p>
                    <p className='text-lg font-semibold text-blue-600'>
                      ₹{busDetails.price_per_km}
                    </p>
                  </div>
                </div>

                {busDetails.minimum_fare && (
                  <div>
                    <p className='text-sm text-gray-500'>Minimum Fare</p>
                    <p className='text-lg font-semibold text-blue-600'>
                      ₹{busDetails.minimum_fare}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'>
            <TabsList className='mb-6'>
              <TabsTrigger value='details'>Features</TabsTrigger>
              <TabsTrigger value='amenities'>Amenities</TabsTrigger>
              <TabsTrigger value='documents'>Documents</TabsTrigger>
            </TabsList>

            <TabsContent
              value='details'
              className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Bus Features</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {busDetails.features.map((feature) => (
                    <div
                      key={feature.id}
                      className='flex items-center'>
                      <Check className='h-4 w-4 text-green-500 mr-2' />
                      <span className='text-gray-700'>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='amenities'
              className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Bus Amenities</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {busDetails.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className='flex items-center'>
                      <img
                        src={getImageUrl(amenity.icon)}
                        alt={amenity.name}
                        className='w-5 h-5 mr-2 object-contain'
                      />
                      <span className='text-gray-700'>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='documents'
              className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-3'>Bus Documents</h3>
                <div className='space-y-4'>
                  {busDetails.documents &&
                    busDetails.documents.map((doc, index) => (
                      <div
                        key={index}
                        className='flex items-start border-b pb-4'>
                        <div className='w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4'>
                          <img
                            src={getImageUrl(doc.path)}
                            alt={doc.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-semibold'>{doc.name}</h4>
                          <div className='flex items-center mt-1'>
                            <div
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                doc.status === 'Verified'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {doc.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
