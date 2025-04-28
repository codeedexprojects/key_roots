import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { EmptyState } from '@/components/common/EmptyState';
import {
  getVendorById,
  getVendorBuses,
  getVendorPackages,
} from '../services/vendorService';
import { LoadingSpinner } from '@/components/common';

export const VendorInventoryPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab =
    searchParams.get('tab') === 'packages' ? 'packages' : 'buses';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [vendor, setVendor] = useState(null);
  const [buses, setBuses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      setLoading(true);
      try {
        // Fetch vendor details
        const vendorResponse = await getVendorById(vendorId);

        if (vendorResponse?.error) {
          console.error(
            'Error fetching vendor details:',
            vendorResponse.message
          );
          setVendor(null);
          setLoading(false);
          return;
        }

        if (vendorResponse && vendorResponse.data) {
          const vendorData = vendorResponse.data;

          // Transform vendor data
          const transformedVendor = {
            id: vendorData.user_id,
            name: vendorData.travels_name,
            location: vendorData.location || vendorData.city,
            email: vendorData.email_address,
            fullName: vendorData.full_name,
          };

          setVendor(transformedVendor);

          // Fetch buses
          const busesResponse = await getVendorBuses(vendorId);

          if (busesResponse && !busesResponse.error && busesResponse.data) {
            // Transform buses data
            const transformedBuses = busesResponse.data.map((bus) => ({
              id: bus.id,
              title: bus.bus_name,
              type:
                bus.features?.length > 0 ? bus.features.join(', ') : 'Standard',
              capacity: bus.capacity,
              vehicleRC: bus.vehicle_rc_number,
              status: 'Available',
              image:
                bus.travels_logo || '/placeholder.svg?height=192&width=384',
              description: bus.vehicle_description,
              basePrice: bus.base_price,
              pricePerKm: bus.price_per_km,
            }));

            setBuses(transformedBuses);
          } else {
            setBuses([]);
          }

          // Fetch packages
          const packagesResponse = await getVendorPackages(vendorId);

          if (
            packagesResponse &&
            !packagesResponse.error &&
            packagesResponse.data
          ) {
            // Transform packages data
            const transformedPackages = packagesResponse.data.map((pkg) => ({
              id: pkg.id,
              destination: pkg.places || 'Package Tour',
              route: pkg.places || 'Tour Package',
              availableDates: `${pkg.days} days, ${pkg.nights} nights`,
              status: pkg.ac_available ? 'Open' : 'Closed',
              image:
                pkg.header_image || '/placeholder.svg?height=192&width=384',
              acAvailable: pkg.ac_available,
              guideIncluded: pkg.guide_included,
              subCategoryName: pkg.sub_category_name,
              days: pkg.days,
              nights: pkg.nights,
            }));

            setPackages(transformedPackages);
          } else {
            setPackages([]);
          }
        } else {
          setVendor(null);
          setBuses([]);
          setPackages([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setVendor(null);
        setBuses([]);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(
      `/vendors/${vendorId}/inventory${
        tab === 'packages' ? '?tab=packages' : ''
      }`
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[600px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (!vendor) {
    return (
      <EmptyState
        title='Vendor Not Found'
        description="We couldn't find the vendor you're looking for."
        action={{
          label: 'Back to Vendors',
          onClick: () => navigate('/vendors'),
        }}
      />
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className='mb-6 flex flex-row justify-between items-center'>
        <div>
          <h1 className='text-2xl font-semibold mb-2'>
            {vendor.name} Inventory
          </h1>
          <p className='text-gray-500'>{vendor.location}</p>
        </div>
        <Link
          to={`/vendors/${vendorId}`}
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Go Back</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200 mb-6'>
        <div className='flex -mb-px'>
          <button
            className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'buses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('buses')}>
            Buses ({buses.length})
          </button>
          <button
            className={`ml-8 py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'packages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('packages')}>
            Packages ({packages.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'buses' ? (
        <div className='space-y-6'>
          {buses.length > 0 ? (
            buses.map((bus) => (
              <div
                key={bus.id}
                className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='md:flex'>
                  <div className='md:w-1/3 h-48 md:h-auto bg-gray-200'>
                    <img
                      src={bus.image || '/placeholder.svg?height=192&width=384'}
                      alt={bus.title}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='p-6 md:w-2/3'>
                    <h3 className='font-semibold text-lg mb-2'>{bus.title}</h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      <div>
                        <p className='text-sm text-gray-500'>Type</p>
                        <p className='font-medium'>{bus.type}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Capacity</p>
                        <p className='font-medium'>{bus.capacity} seats</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Vehicle RC</p>
                        <p className='font-medium'>{bus.vehicleRC}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Status</p>
                        <p
                          className={`font-medium ${
                            bus.status === 'Available'
                              ? 'text-green-600'
                              : bus.status === 'Ongoing'
                              ? 'text-blue-600'
                              : 'text-gray-600'
                          }`}>
                          {bus.status}
                        </p>
                      </div>
                      {bus.basePrice && (
                        <div>
                          <p className='text-sm text-gray-500'>Base Price</p>
                          <p className='font-medium'>₹{bus.basePrice}</p>
                        </div>
                      )}
                      {bus.pricePerKm && (
                        <div>
                          <p className='text-sm text-gray-500'>Price per KM</p>
                          <p className='font-medium'>₹{bus.pricePerKm}</p>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/vendors/${vendorId}/buses/${bus.id}`}
                      className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-block'>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title='No Buses Found'
              description="This vendor doesn't have any buses yet."
            />
          )}
        </div>
      ) : (
        <div className='space-y-6'>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='md:flex'>
                  <div className='md:w-1/3 h-48 md:h-auto bg-gray-200'>
                    <img
                      src={pkg.image || '/placeholder.svg?height=192&width=384'}
                      alt={pkg.destination}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='p-6 md:w-2/3'>
                    <h3 className='font-semibold text-lg mb-2'>
                      {pkg.destination}
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      <div>
                        <p className='text-sm text-gray-500'>Route</p>
                        <p className='font-medium'>{pkg.route}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Duration</p>
                        <p className='font-medium'>{pkg.availableDates}</p>
                      </div>
                      {pkg.subCategoryName && (
                        <div>
                          <p className='text-sm text-gray-500'>Category</p>
                          <p className='font-medium'>{pkg.subCategoryName}</p>
                        </div>
                      )}
                      <div>
                        <p className='text-sm text-gray-500'>Status</p>
                        <p
                          className={`font-medium ${
                            pkg.status === 'Open'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                          {pkg.status}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>AC Available</p>
                        <p className='font-medium'>
                          {pkg.acAvailable ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Guide Included</p>
                        <p className='font-medium'>
                          {pkg.guideIncluded ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/vendors/${vendorId}/packages/${pkg.id}`}
                      className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-block'>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title='No Packages Found'
              description="This vendor doesn't have any packages yet."
            />
          )}
        </div>
      )}
    </>
  );
};
