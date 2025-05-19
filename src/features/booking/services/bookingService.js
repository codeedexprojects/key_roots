import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

/**
 * Function to get all bookings
 * @returns {Promise} Promise that resolves to the booking data
 */
export const getAllBookings = async () => {
  return apiRequest(
    () => axiosInstance.get('/combined-bookings/'),
    'Error occurred while fetching bookings.'
  );
};

/**
 * Function to get booking details by ID
 * @param {string|number} bookingId - The ID of the booking to fetch
 * @returns {Promise} Promise that resolves to the booking details
 */
export const getBookingById = async (bookingId) => {
  return apiRequest(
    () => axiosInstance.get(`/booking-detail/package/${bookingId}/`),
    `Error occurred while fetching booking with ID ${bookingId}.`
  );
};

/**
 * Function to format booking data for display
 * @param {Array} bookings - Array of booking objects from API
 * @returns {Array} Formatted booking objects for display
 */
export const formatBookingsForDisplay = (bookings) => {
  if (!bookings || !Array.isArray(bookings)) return [];

  return bookings.map((booking) => ({
    id: booking.id,
    name:
      booking.travelers && booking.travelers.length > 0
        ? `${booking.travelers[0].first_name} ${
            booking.travelers[0].last_name || ''
          }`
        : 'Unknown',
    date: booking.start_date
      ? new Date(booking.start_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A',
    category: booking.booking_type === 'bus' ? 'Bus' : 'Package',
    trip:
      booking.from_location && booking.to_location
        ? `${booking.from_location} → ${booking.to_location}`
        : 'N/A',
    cost: booking.total_amount
      ? `₹${parseFloat(booking.total_amount).toLocaleString('en-IN')}`
      : 'N/A',
    status: booking.booking_status || 'pending',
    paymentStatus: booking.payment_status || 'pending',
    tripStatus: booking.trip_status || 'not_started',
    totalTravelers: booking.total_travelers || 0,
  }));
};
