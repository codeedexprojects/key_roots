import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

export const getAllBuses = async () => {
  return apiRequest(
    () => axiosInstance.get('/buses/'),
    'Error occurred while fetching buses.'
  );
};

export const getBusById = async (busId) => {
  return apiRequest(
    () => axiosInstance.get(`/bus/${busId}/`),
    `Error occurred while fetching bus with ID ${busId}.`
  );
};

export const deleteBus = async (busId) => {
  return apiRequest(
    () => axiosInstance.delete(`/bus/delete/${busId}/`),
    `Error occurred while deleting bus with ID ${busId}.`
  );
};

export const toggleBusPopularity = async (busId) => {
  return apiRequest(
    () => axiosInstance.post(`/bus/${busId}/toggle-popular/`),
    `Error occurred while toggling popularity for bus with ID ${busId}.`
  );
};

export const getAllAmenities = async () => {
  return apiRequest(
    () => axiosInstance.get('/amenities/'),
    'Error occurred while fetching amenities.'
  );
};

export const createAmenity = async (amenityData) => {
  const formData = new FormData();
  formData.append('name', amenityData.name);
  formData.append('description', amenityData.description || '');
  if (amenityData.icon) {
    formData.append('icon', amenityData.icon);
  }
  return apiRequest(
    () =>
      axiosInstance.post('/amenities/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    'Error occurred while creating amenity.'
  );
};

export const updateAmenity = async (amenityId, amenityData) => {
  const formData = new FormData();
  formData.append('name', amenityData.name);
  formData.append('description', amenityData.description || '');
  if (amenityData.icon) {
    formData.append('icon', amenityData.icon);
  }
  return apiRequest(
    () =>
      axiosInstance.put(`/amenities/${amenityId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    `Error occurred while updating amenity with ID ${amenityId}.`
  );
};

export const deleteAmenity = async (amenityId) => {
  return apiRequest(
    () => axiosInstance.delete(`/amenities/${amenityId}/`),
    `Error occurred while deleting amenity with ID ${amenityId}.`
  );
};

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
    basePrice: Number.parseFloat(bus.base_price || 0),
    pricePerKm: Number.parseFloat(bus.price_per_km || 0),
    minimumFare: Number.parseFloat(bus.minimum_fare || 0),
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

const transformAmenities = (amenities, features) => {
  const amenityNames = amenities.map((a) => a.name?.toLowerCase());
  const featureNames = features.map((f) => f.name?.toLowerCase());
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

export const formatPrice = (price) => {
  const numPrice = Number.parseFloat(price || 0);
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

export const filterBuses = (buses, searchQuery, searchFields) => {
  if (!searchQuery) return buses;

  const query = searchQuery.toLowerCase().trim();

  return buses.filter((bus) => {
    // Check each enabled search field
    return Object.entries(searchFields).some(([field, enabled]) => {
      if (!enabled) return false;

      switch (field) {
        case 'name':
          return bus.title.toLowerCase().includes(query);
        case 'number':
          return bus.vehicleNo.toLowerCase().includes(query);
        case 'location':
          return bus.location.toLowerCase().includes(query);
        case 'type':
          return bus.busType?.toLowerCase().includes(query);
        case 'capacity':
          return String(bus.capacity).includes(query);
        case 'price':
          return (
            bus.basePrice.includes(query) || bus.pricePerKm.includes(query)
          );
        case 'status':
          return bus.status.toLowerCase().includes(query);
        default:
          return false;
      }
    });
  });
};

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
