import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

/**
 * Function to get all payments
 * @returns {Promise} Promise that resolves to the payment data
 */
export const getAllPayments = async () => {
  return apiRequest(
    () => axiosInstance.get('/payment-details/'),
    'Error occurred while fetching payments.'
  );
};

/**
 * Function to get payment details by ID and type
 * @param {string|number} paymentId - The ID of the payment to fetch
 * @param {string} type - The type of payment ('bus' or 'package')
 * @returns {Promise} Promise that resolves to the payment details
 */
export const getPaymentById = async (paymentId, type = 'package') => {
  // Validate type parameter
  const validType = type === 'bus' ? 'bus' : 'package';

  return apiRequest(
    () => axiosInstance.get(`/payment-details/${validType}/${paymentId}/`),
    `Error occurred while fetching payment with ID ${paymentId}.`
  );
};

/**
 * Function to format payment data for display
 * @param {Array} payments - Array of payment objects from API
 * @returns {Array} Formatted payment objects for display
 */
export const formatPaymentsForDisplay = (payments) => {
  if (!payments || !Array.isArray(payments)) return [];

  return payments.map((payment) => ({
    id: payment.id,
    vendorName: payment.vendor_name || 'Unknown Vendor',
    trip: payment.bus_or_package || 'N/A',
    totalAmount: payment.total_amount
      ? `₹${parseFloat(payment.total_amount).toLocaleString('en-IN')}`
      : '₹0',
    status: formatPaymentStatus(payment.payment_status),
    income: calculateIncome(payment),
    bookingType: payment.booking_type || 'Unknown',
    advanceAmount: payment.advance_amount
      ? `₹${parseFloat(payment.advance_amount).toLocaleString('en-IN')}`
      : '₹0',
    balanceAmount: payment.balance_amount
      ? `₹${parseFloat(payment.balance_amount).toLocaleString('en-IN')}`
      : '₹0',
    rawStatus: payment.payment_status || 'pending',
  }));
};

/**
 * Helper function to format payment status
 * @param {string} status - The raw payment status from API
 * @returns {string} Formatted payment status
 */
const formatPaymentStatus = (status) => {
  if (!status) return 'Pending';

  // Convert to lowercase for case-insensitive comparison
  const lowerStatus = status.toLowerCase();

  if (lowerStatus === 'completed') return 'Completed';
  if (lowerStatus === 'cancelled' || lowerStatus === 'canceled')
    return 'Cancelled';
  if (lowerStatus === 'pending') return 'Pending';

  // Capitalize first letter for any other status
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Helper function to calculate income from a payment
 * @param {Object} payment - The payment object from API
 * @returns {string} Formatted income string
 */
const calculateIncome = (payment) => {
  // If payment is cancelled, return "Amount Returned"
  if (
    payment.payment_status?.toLowerCase() === 'cancelled' ||
    payment.payment_status?.toLowerCase() === 'canceled'
  ) {
    return 'Amount Returned';
  }

  // For now, we'll return a placeholder value
  // In a real implementation, you would calculate this based on the payment data
  // For example, it might be a percentage of the total amount
  const incomePercentage = 0.1; // 10%
  const totalAmount = parseFloat(payment.total_amount || 0);
  const income = totalAmount * incomePercentage;

  return `₹${income.toLocaleString('en-IN')}`;
};
