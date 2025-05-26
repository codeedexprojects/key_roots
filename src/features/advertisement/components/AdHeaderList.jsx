import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdHeaderForm } from './AdHeaderForm';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';
import {
  getAdvertisementHeaders,
  deleteAdvertisementHeader,
} from '../services/advertisementService';

export const AdHeaderList = () => {
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadHeaders();
  }, []);

  const loadHeaders = async () => {
    setIsLoading(true);
    try {
      const response = await getAdvertisementHeaders();
      if (response && !response.error) {
        // Handle direct array response or response with data field
        const data = Array.isArray(response) ? response : response.data || [];
        setHeaders(data);
      } else {
        toast.error(
          response?.message || 'Failed to load advertisement headers'
        );
        setHeaders([]);
      }
    } catch (error) {
      console.error('Error fetching headers:', error);
      toast.error('Failed to load headers. Please try again later.');
      setHeaders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const header = headers.find((h) => h.id === id);
    const itemName = header?.title || 'this advertisement';

    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        const response = await deleteAdvertisementHeader(id);
        if (response && response.success) {
          setHeaders(headers.filter((header) => header.id !== id));
          toast.success('Advertisement deleted successfully');
        } else {
          toast.error(response?.message || 'Failed to delete advertisement');
        }
      } catch (error) {
        console.error('Error deleting header:', error);
        toast.error('Failed to delete advertisement');
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
    loadHeaders();
  };

  if (showAddForm) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <AdHeaderForm
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>Advertisement</h3>
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
      ) : headers.length === 0 ? (
        <EmptyState
          title='No advertisement headers found'
          description='Create your first advertisement header to get started.'
          actionLabel='Add Header'
          onAction={handleAddNew}
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {headers.map((header) => (
            <div
              key={header.id}
              className='bg-gray-50 rounded-lg shadow-sm overflow-hidden'>
              <div className='h-48 overflow-hidden'>
                <img
                  src={getImageUrl(header.image) || '/placeholder.svg'}
                  alt={header.title}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <h4 className='font-semibold text-gray-900'>
                    {header.title || 'Untitled'}
                  </h4>
                  <button
                    onClick={() => handleDelete(header.id)}
                    className='text-red-600 hover:text-red-700'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
                {header.subtitle && (
                  <p className='text-sm text-gray-600 mb-1'>
                    {header.subtitle}
                  </p>
                )}
                {header.type && (
                  <span className='inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded'>
                    {header.type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
