import { useState } from 'react';
import { Star, StarOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  formatPrice,
  getStatusColor,
  toggleBusPopularity,
  deleteBus,
} from '../services/busService';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const BusCard = ({ bus, onClick, onPopularityToggle, onBusDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePopularityToggle = async (e) => {
    e.stopPropagation(); // Prevent card click
    setIsToggling(true);

    try {
      const response = await toggleBusPopularity(bus.id);
      if (response && !response.error) {
        toast.success(
          bus.isPopular
            ? 'Bus removed from popular list'
            : 'Bus marked as popular'
        );
        // Call parent callback to refresh data
        if (onPopularityToggle) {
          onPopularityToggle(bus.id, !bus.isPopular);
        }
      } else {
        toast.error(response?.message || 'Failed to update bus popularity');
      }
    } catch (error) {
      console.error('Error toggling bus popularity:', error);
      toast.error('Failed to update bus popularity. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteBus(bus.id);
      if (response && !response.error) {
        toast.success('Bus deleted successfully');
        // Call parent callback to remove bus from list
        if (onBusDelete) {
          onBusDelete(bus.id);
        }
      } else {
        toast.error(response?.message || 'Failed to delete bus');
      }
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast.error('Failed to delete bus. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border border-gray-100'
        onClick={onClick}>
        <div className='h-48 overflow-hidden relative'>
          <img
            src={bus.image || '/placeholder.svg'}
            alt={bus.title}
            className='w-full h-full object-cover'
          />
          {bus.isPopular && (
            <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
              Popular
            </div>
          )}
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              bus.status
            )}`}>
            {bus.status?.charAt(0).toUpperCase() + bus.status?.slice(1) ||
              'Available'}
          </div>

          {/* Action Buttons */}
          <div className='absolute bottom-2 right-2 flex gap-2'>
            {/* Popularity Toggle Button */}
            <button
              onClick={handlePopularityToggle}
              disabled={isToggling}
              className={`p-2 rounded-full transition-all duration-200 ${
                bus.isPopular
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-white text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              } ${
                isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
              title={bus.isPopular ? 'Remove from popular' : 'Mark as popular'}>
              {bus.isPopular ? (
                <Star className='h-4 w-4 fill-current' />
              ) : (
                <StarOff className='h-4 w-4' />
              )}
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`p-2 rounded-full transition-all duration-200 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 ${
                isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
              title='Delete bus'>
              <Trash2 className='h-4 w-4' />
            </button>
          </div>
        </div>
        <div className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-lg font-semibold text-gray-800 truncate flex-1'>
              {bus.title}
            </h3>
            {bus.averageRating > 0 && (
              <div className='flex items-center ml-2'>
                <span className='text-yellow-500 text-sm'>★</span>
                <span className='text-sm text-gray-600 ml-1'>
                  {bus.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <div className='space-y-1 mb-3'>
            <p className='text-sm text-gray-600'>
              <span className='font-medium text-gray-700'>Vehicle No:</span>{' '}
              {bus.vehicleNo}
            </p>
            <p className='text-sm text-gray-600'>
              <span className='font-medium text-gray-700'>Bus Type:</span>{' '}
              {bus.busType || 'Standard'}
            </p>
            <p className='text-sm text-gray-600'>
              <span className='font-medium text-gray-700'>Capacity:</span>{' '}
              {bus.capacity} seats
            </p>
            <p className='text-sm text-gray-600'>
                <span className='font-medium text-gray-700'>Contact NO:</span>{' '}
                {bus.contactNumber}
              </p>
            {bus.location && (
              <p className='text-sm text-gray-600'>
                <span className='font-medium text-gray-700'>Location:</span>{' '}
                {bus.location}
              </p>
            )}
          </div>
          <div className='flex justify-between items-center pt-2 border-t border-gray-100'>
            <div className='text-sm'>
              <span className='text-gray-500'>Base Price:</span>
              <span className='font-semibold text-gray-800 ml-1'>
                {formatPrice(bus.basePrice)}
              </span>
            </div>
            <div className='text-sm'>
              <span className='text-gray-500'>Per KM:</span>
              <span className='font-semibold text-gray-800 ml-1'>
                {formatPrice(bus.pricePerKm)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
        isLoading={isDeleting}
        title='Delete Bus'
        message={`Are you sure you want to delete "${bus.title}"? This action cannot be undone.`}
        itemName={bus.title}
        itemDetails={[
          { label: 'Vehicle No', value: bus.vehicleNo },
          { label: 'Bus Type', value: bus.busType },
          { label: 'Capacity', value: `${bus.capacity} seats` },
        ]}
      />
    </>
  );
};

export default BusCard;
