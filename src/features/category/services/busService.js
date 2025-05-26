import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

/**
 * Function to get all buses
 * @returns {Promise} Promise that resolves to the buses data
 */
export const getAllBuses = async () => {
  return apiRequest(
    () => axiosInstance.get('/buses/'),
    'Error occurred while fetching buses.'
  );
};

/**
 * Function to get bus details by ID
 * @param {string|number} busId - The ID of the bus to fetch
 * @returns {Promise} Promise that resolves to the bus details
 */
export const getBusById = async (busId) => {
  return apiRequest(
    () => axiosInstance.get(`/bus/${busId}/`),
    `Error occurred while fetching bus with ID ${busId}.`
  );
};

/**
 * Transform bus data from API response to component format
 * @param {Array} buses - Array of bus objects from API
 * @returns {Array} Transformed bus data
 */
export const transformBusData = (buses) => {
  if (!Array.isArray(buses)) return [];

  return buses.map((bus) => ({
    id: bus.id,
    title: bus.bus_name || 'Unknown Bus',
    vehicleNo: bus.bus_number || 'N/A',
    busType: bus.bus_type || 'Standard',
    capacity: bus.capacity || 0,
    contactNumber: 'N/A', // Not provided in API response
    image: bus.images?.[0]?.bus_view_image || bus.travels_logo || null,
    seats: bus.capacity || 0, // Using capacity as seats
    basePrice: parseFloat(bus.base_price || 0),
    pricePerKm: parseFloat(bus.price_per_km || 0),
    minimumFare: parseFloat(bus.minimum_fare || 0),
    rcNumber: bus.vehicle_rc_number || 'N/A',
    description: bus.vehicle_description || 'No description available',
    status: bus.status || 'available',
    location: bus.location || 'N/A',
    latitude: bus.latitude || 0,
    longitude: bus.longitude || 0,
    isPopular: bus.is_popular || false,
    averageRating: bus.average_rating || 0,
    totalReviews: bus.total_reviews || 0,
    vendor: bus.vendor,
    // Transform amenities array to object format
    amenities: transformAmenities(bus.amenities || [], bus.features || []),
    // Document URLs
    documents: {
      travels_logo: bus.travels_logo,
      rc_certificate: bus.rc_certificate,
      license: bus.license,
      contract_carriage_permit: bus.contract_carriage_permit,
      passenger_insurance: bus.passenger_insurance,
      vehicle_insurance: bus.vehicle_insurance,
    },
    // Raw data for detailed view
    rawAmenities: bus.amenities || [],
    rawFeatures: bus.features || [],
    rawImages: bus.images || [],
  }));
};

/**
 * Transform amenities and features arrays to object format
 * @param {Array} amenities - Array of amenity objects
 * @param {Array} features - Array of feature objects
 * @returns {Object} Transformed amenities object
 */
const transformAmenities = (amenities, features) => {
  const amenityNames = amenities.map(a => a.name?.toLowerCase());
  const featureNames = features.map(f => f.name?.toLowerCase());
  const allItems = [...amenityNames, ...featureNames];

  return {
    ac: allItems.includes('ac') || allItems.includes('air conditioning'),
    pushback: allItems.includes('pushback') || allItems.includes('push back'),
    music: allItems.includes('music') || allItems.includes('music system'),
    wifi: allItems.includes('wifi') || allItems.includes('wi-fi'),
    charging: allItems.includes('charger') || allItems.includes('charging'),
    cctv: allItems.includes('cctv'),
    solar: allItems.includes('solar'),
  };
};

/**
 * Format price for display
 * @param {string|number} price - Price value
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  const numPrice = parseFloat(price || 0);
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

/**
 * Get status badge color
 * @param {string} status - Bus status
 * @returns {string} CSS class for status badge
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'unavailable':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
