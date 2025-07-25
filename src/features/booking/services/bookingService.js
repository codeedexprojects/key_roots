import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

export const getAllBookings = async () => {
  return apiRequest(
    () => axiosInstance.get('/combined-bookings/'),
    'Error occurred while fetching bookings.'
  );
};

export const getBookingById = async (bookingId, bookingType) => {
  const endpoint =
    bookingType === 'bus'
      ? `/booking-detail/bus/${bookingId}/`
      : `/booking-detail/package/${bookingId}/`;
  return apiRequest(
    () => axiosInstance.get(endpoint),
    `Error occurred while fetching ${bookingType} booking with ID ${bookingId}.`
  );
};

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
    date: booking.created_at
      ? new Date(booking.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A',
     journeyDate: booking.start_date
      ? new Date(booking.start_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A', 
    rawDate: booking.start_date ? booking.start_date : null,
    category: booking.booking_type === 'bus' ? 'Bus' : 'Package',
    trip:
      booking.from_location && booking.to_location
        ? `${booking.from_location} → ${booking.to_location}`
        : 'N/A',
    cost: booking.total_amount
      ? `₹${parseFloat(booking.total_amount).toLocaleString('en-IN')}`
      : 'N/A',
    status: booking.booking_status || 'pending',
    bus_count: booking.bus_count || 0,
    paymentStatus: booking.payment_status || 'pending',
    tripStatus: booking.trip_status || 'not_started',
    totalTravelers: booking.total_travelers || 0,
    balance_amount:booking.total_amount
      ? `₹${parseFloat(booking.balance_amount).toLocaleString('en-IN')}`
      : 'N/A',

  }));
};
