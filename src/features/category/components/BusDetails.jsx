import React, { useState, useEffect, useCallback } from 'react';
import {
  FaArrowLeft,
  FaDownload,
  FaWifi,
  FaMusic,
  FaChargingStation,
  FaSnowflake,
  FaCouch,
  FaVideo,
  FaSolarPanel,
  FaStar,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common';
import {
  getBusById,
  formatPrice,
  getStatusColor,
} from '../services/busService';

const BusDetails = ({ bus, onBack }) => {
  const [busDetails, setBusDetails] = useState(bus);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const loadBusDetails = useCallback(
    async (busId) => {
      setIsLoading(true);
      try {
        const response = await getBusById(busId);
        console.log(response);
        if (response && !response.error) {
          setBusDetails({
            ...bus,
            ...response,
            rawAmenities: response.amenities || [],
            rawFeatures: response.features || [],
            rawImages: response.images || [],
            documents: {
              travels_logo: response.travels_logo,
              rc_certificate: response.rc_certificate,
              license: response.license,
              contract_carriage_permit: response.contract_carriage_permit,
              passenger_insurance: response.passenger_insurance,
              vehicle_insurance: response.vehicle_insurance,
            },
          });
        } else {
          toast.error(response?.message || 'Failed to load bus details');
        }
      } catch (error) {
        console.error('Error fetching bus details:', error);
        toast.error('Failed to load bus details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [bus]
  );

  useEffect(() => {
    if (bus?.id) {
      loadBusDetails(bus.id);
    }
  }, [bus?.id, loadBusDetails]);

  const allImages = [
    ...(busDetails.rawImages?.map((img) => img.bus_view_image) || []),
    busDetails.travels_logo,
    busDetails.image,
  ].filter(Boolean);

  const downloadDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Document not available');
    }
  };

  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='p-4 border-b border-gray-200'>
          <button
            className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
            onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className='flex justify-center items-center min-h-[500px]'>
          <LoadingSpinner size='large' />
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='p-4 border-b border-gray-200'>
        <button
          className='flex items-center gap-2 text-red-700 font-medium focus:outline-none hover:text-red-800 transition-colors'
          onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className='p-5'>
        {/* Enhanced Image Gallery */}
        <div className='mb-6'>
          <div className='w-full h-110 rounded-lg overflow-hidden mb-4 relative'>
            <img
              src={
                allImages[activeImageIndex] ||
                busDetails.image ||
                '/placeholder.svg'
              }
              alt={busDetails.bus_name || busDetails.title}
              className='w-full h-full '
            />
            {busDetails.isPopular && (
              <div className='absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                Popular
              </div>
            )}
            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                busDetails.status
              )}`}>
              {busDetails.status?.charAt(0).toUpperCase() +
                busDetails.status?.slice(1) || 'Available'}
            </div>
          </div>

          {/* Image Thumbnails */}
          {allImages.length > 1 && (
            <div className='flex gap-2 overflow-x-auto pb-2'>
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index
                      ? 'border-red-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bus Header with Rating */}
        <div className='mb-6 pb-6 border-b border-gray-200'>
          <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
            <div className='flex-1'>
              <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                {busDetails.bus_name || busDetails.title}
              </h2>
              <p className='text-lg text-gray-600 mb-2'>
                {busDetails.bus_number || busDetails.vehicleNo}
              </p>
              {busDetails.location && (
                <div className='flex items-center text-gray-600 mb-2'>
                  <FaMapMarkerAlt className='mr-2' />
                  <span>{busDetails.location}</span>
                </div>
              )}
            </div>
            {busDetails.average_rating > 0 && (
              <div className='flex items-center bg-yellow-50 px-4 py-2 rounded-lg'>
                <FaStar className='text-yellow-500 mr-2' />
                <span className='font-semibold text-lg'>
                  {busDetails.average_rating.toFixed(1)}
                </span>
                <span className='text-gray-600 ml-1'>
                  ({busDetails.total_reviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>CAPACITY</h3>
            <p className='text-2xl font-medium text-gray-800'>
              {busDetails.capacity} seats
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>BASE PRICE</h3>
            <p className='text-2xl font-medium text-gray-800'>
              {formatPrice(busDetails.base_price || busDetails.basePrice)}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              PRICE PER KM
            </h3>
            <p className='text-2xl font-medium text-gray-800'>
              {formatPrice(busDetails.price_per_km || busDetails.pricePerKm)}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>
              MINIMUM FARE
            </h3>
            <p className='text-2xl font-medium text-gray-800'>
              {formatPrice(busDetails.minimum_fare || busDetails.minimumFare)}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>BUS TYPE</h3>
            <p className='text-2xl font-medium text-gray-800'>
              {busDetails.bus_type || busDetails.busType || 'Standard'}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='text-xs uppercase text-gray-500 mb-1'>RC NUMBER</h3>
            <p className='text-2xl font-medium text-gray-800'>
              {busDetails.vehicle_rc_number || busDetails.rcNumber}
            </p>
          </div>
        </div>

        <div className='mb-8'>
          <h3 className='text-xs uppercase text-gray-500 mb-2'>
            VEHICLE DESCRIPTION
          </h3>
          <p className='text-gray-700 leading-relaxed'>
            {busDetails.vehicle_description ||
              busDetails.description ||
              'No description available'}
          </p>
        </div>

        {/* Enhanced Amenities & Features */}
        <div className='mb-8'>
          <h3 className='text-xs uppercase text-gray-500 mb-3'>
            AMENITIES & FEATURES
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {/* Render amenities from API */}
            {busDetails.rawAmenities?.map((amenity) => (
              <div
                key={amenity.id}
                className='flex items-center gap-2 text-green-500'>
                {amenity.name.toLowerCase().includes('wifi') && (
                  <FaWifi className='text-lg' />
                )}
                {amenity.name.toLowerCase().includes('music') && (
                  <FaMusic className='text-lg' />
                )}
                {amenity.name.toLowerCase().includes('charger') && (
                  <FaChargingStation className='text-lg' />
                )}
                {amenity.name.toLowerCase().includes('cctv') && (
                  <FaVideo className='text-lg' />
                )}
                {!['wifi', 'music', 'charger', 'cctv'].some((keyword) =>
                  amenity.name.toLowerCase().includes(keyword)
                ) && <span className='text-lg'>✓</span>}
                <span className='capitalize'>{amenity.name}</span>
              </div>
            ))}

            {/* Render features from API */}
            {busDetails.rawFeatures?.map((feature) => (
              <div
                key={feature.id}
                className='flex items-center gap-2 text-blue-500'>
                {feature.name.toLowerCase().includes('ac') && (
                  <FaSnowflake className='text-lg' />
                )}
                {feature.name.toLowerCase().includes('pushback') && (
                  <FaCouch className='text-lg' />
                )}
                {feature.name.toLowerCase().includes('solar') && (
                  <FaSolarPanel className='text-lg' />
                )}
                {!['ac', 'pushback', 'solar'].some((keyword) =>
                  feature.name.toLowerCase().includes(keyword)
                ) && <span className='text-lg'>★</span>}
                <span className='capitalize'>{feature.name}</span>
              </div>
            ))}

            {/* Show message if no amenities/features */}
            {!busDetails.rawAmenities?.length &&
              !busDetails.rawFeatures?.length && (
                <div className='col-span-full text-gray-500 text-center py-4'>
                  No amenities or features listed
                </div>
              )}
          </div>
        </div>

        {/* Documents Section */}
        <div className='space-y-5'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Documents
          </h3>

          {busDetails.documents?.rc_certificate && (
            <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
              <h3 className='text-xs uppercase text-gray-500'>
                RC CERTIFICATE
              </h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.rc_certificate)
                }
                className='flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors'>
                <FaDownload /> View RC Certificate
              </button>
            </div>
          )}

          {busDetails.documents?.license && (
            <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
              <h3 className='text-xs uppercase text-gray-500'>LICENSE</h3>
              <button
                onClick={() => downloadDocument(busDetails.documents.license)}
                className='flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors'>
                <FaDownload /> View Travel License
              </button>
            </div>
          )}

          {busDetails.documents?.contract_carriage_permit && (
            <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
              <h3 className='text-xs uppercase text-gray-500'>
                CONTRACT CARRIAGE PERMIT
              </h3>
              <button
                onClick={() =>
                  downloadDocument(
                    busDetails.documents.contract_carriage_permit
                  )
                }
                className='flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors'>
                <FaDownload /> View Contract Carriage Permit
              </button>
            </div>
          )}

          {busDetails.documents?.passenger_insurance && (
            <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
              <h3 className='text-xs uppercase text-gray-500'>
                PASSENGER INSURANCE
              </h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.passenger_insurance)
                }
                className='flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors'>
                <FaDownload /> View Passenger Insurance
              </button>
            </div>
          )}

          {busDetails.documents?.vehicle_insurance && (
            <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
              <h3 className='text-xs uppercase text-gray-500'>
                VEHICLE INSURANCE
              </h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.vehicle_insurance)
                }
                className='flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors'>
                <FaDownload /> View Vehicle Insurance
              </button>
            </div>
          )}

          {busDetails.documents?.travels_logo && (
            <div className='flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200'>
              <h3 className='text-xs uppercase text-gray-500'>TRAVELS LOGO</h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.travels_logo)
                }
                className='flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors'>
                <FaDownload /> View Travels Logo
              </button>
            </div>
          )}

          {/* Show message if no documents */}
          {!Object.values(busDetails.documents || {}).some(Boolean) && (
            <div className='text-gray-500 text-center py-4'>
              No documents available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
