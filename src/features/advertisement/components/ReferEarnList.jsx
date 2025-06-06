import { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReferEarnForm } from './ReferEarnForm';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';
import {
  getReferEarn,
  deleteReferEarn,
} from '../services/advertisementService';

export const ReferEarnList = () => {
  const [referItem, setReferItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadReferItem();
  }, []);

  const loadReferItem = async () => {
    setIsLoading(true);
    try {
      const response = await getReferEarn();
      if (response && !response.error) {
        const data = Array.isArray(response) ? response : response.data || [];
        setReferItem(data[0] || null);
      } else {
        toast.error(response?.message || 'Failed to load refer & earn item');
        setReferItem(null);
      }
    } catch (error) {
      console.error('Error fetching refer item:', error);
      toast.error('Failed to load refer item. Please try again later.');
      setReferItem(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm('Are you sure you want to delete this refer & earn item?')
    ) {
      try {
        const response = await deleteReferEarn(id);
        if (response && response.success) {
          setReferItem(null);
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
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadReferItem();
  };

  if (showForm) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <ReferEarnForm
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
          initialData={isEditMode ? referItem : null}
          isEditMode={isEditMode}
        />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>Refer & Earn</h3>
        {!referItem && (
          <button
            onClick={handleAddNew}
            className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Plus className='h-4 w-4 mr-2' />
            Add New
          </button>
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center min-h-[200px]'>
          <LoadingSpinner size='large' />
        </div>
      ) : !referItem ? (
        <EmptyState
          title='No refer & earn item found'
          description='Create your first refer & earn item to get started.'
          actionLabel='Add Item'
          onAction={handleAddNew}
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-gray-50 rounded-lg shadow-sm overflow-hidden'>
            <div className='h-48 overflow-hidden'>
              <img
                src={getImageUrl(referItem.image) || '/placeholder.svg'}
                alt='Refer & Earn'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h4 className='font-semibold text-gray-900'>Refer & Earn</h4>
                <div className='flex space-x-2'>
                  <button
                    onClick={handleEdit}
                    className='text-blue-600 hover:text-blue-700'>
                    <Edit2 className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(referItem.id)}
                    className='text-red-600 hover:text-red-700'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
              {referItem.price && (
                <p className='text-lg font-semibold text-green-600 mb-2'>
                  ₹{referItem.price}
                </p>
              )}
              {referItem.created_at && (
                <p className='text-xs text-gray-500'>
                  Created: {new Date(referItem.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
