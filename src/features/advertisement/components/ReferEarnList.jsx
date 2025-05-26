import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReferEarnForm } from './ReferEarnForm';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';
import {
  getReferEarn,
  deleteReferEarn,
} from '../services/advertisementService';

export const ReferEarnList = () => {
  const [referItems, setReferItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadReferItems();
  }, []);

  const loadReferItems = async () => {
    setIsLoading(true);
    try {
      const response = await getReferEarn();
      if (response && !response.error) {
        // Handle direct array response or response with data field
        const data = Array.isArray(response) ? response : response.data || [];
        setReferItems(data);
      } else {
        toast.error(response?.message || 'Failed to load refer & earn items');
        setReferItems([]);
      }
    } catch (error) {
      console.error('Error fetching refer items:', error);
      toast.error('Failed to load refer items. Please try again later.');
      setReferItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const item = referItems.find((i) => i.id === id);
    const itemName = item?.title || 'this refer & earn item';

    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        const response = await deleteReferEarn(id);
        if (response && response.success) {
          setReferItems(referItems.filter((item) => item.id !== id));
          toast.success('Refer & earn item deleted successfully');
        } else {
          toast.error(
            response?.message || 'Failed to delete refer & earn item'
          );
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete refer & earn item');
      }
    }
  };

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    loadReferItems();
  };

  if (showAddForm) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <ReferEarnForm
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>Refer & earn</h3>
        <button
          onClick={handleAddNew}
          className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          <Plus className='h-4 w-4 mr-2' />
          Add New
        </button>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center min-h-[200px]'>
          <LoadingSpinner size='large' />
        </div>
      ) : referItems.length === 0 ? (
        <EmptyState
          title='No refer & earn items found'
          description='Create your first refer & earn item to get started.'
          actionLabel='Add Item'
          onAction={handleAddNew}
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {referItems.map((item) => (
            <div
              key={item.id}
              className='bg-gray-50 rounded-lg shadow-sm overflow-hidden'>
              <div className='h-48 overflow-hidden'>
                <img
                  src={getImageUrl(item.image) || '/placeholder.svg'}
                  alt={item.title}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <h4 className='font-semibold text-gray-900'>Refer & Earn</h4>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className='text-red-600 hover:text-red-700'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
                {item.price && (
                  <p className='text-lg font-semibold text-green-600 mb-2'>
                    ₹{item.price}
                  </p>
                )}
                {item.created_at && (
                  <p className='text-xs text-gray-500'>
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
