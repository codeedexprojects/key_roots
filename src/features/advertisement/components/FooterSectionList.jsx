import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { FooterSectionForm } from './FooterSectionForm';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';
import {
  getFooterSections,
  deleteFooterSection,
} from '../services/advertisementService';

export const FooterSectionList = () => {
  const [footerItems, setFooterItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadFooterItems();
  }, []);

  const loadFooterItems = async () => {
    setIsLoading(true);
    try {
      const response = await getFooterSections();
      if (response && !response.error) {
        // Handle direct array response or response with data field
        const data = Array.isArray(response) ? response : response.data || [];
        setFooterItems(data);
      } else {
        toast.error(response?.message || 'Failed to load footer sections');
        setFooterItems([]);
      }
    } catch (error) {
      console.error('Error fetching footer items:', error);
      toast.error('Failed to load footer items. Please try again later.');
      setFooterItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const item = footerItems.find((i) => i.id === id);
    const itemName = item?.title || item?.package || 'this footer section';

    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        const response = await deleteFooterSection(id);
        if (response && response.success) {
          setFooterItems(footerItems.filter((item) => item.id !== id));
          toast.success('Footer section deleted successfully');
        } else {
          toast.error(response?.message || 'Failed to delete footer section');
        }
      } catch (error) {
        console.error('Error deleting footer section:', error);
        toast.error('Failed to delete footer section');
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
    loadFooterItems();
  };

  if (showAddForm) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <FooterSectionForm
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>Footer section</h3>
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
      ) : footerItems.length === 0 ? (
        <EmptyState
          title='No footer sections found'
          description='Create your first footer section to get started.'
          actionLabel='Add Section'
          onAction={handleAddNew}
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {footerItems.map((item) => (
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
                  <h4 className='font-semibold text-gray-900'>
                    Footer Section
                  </h4>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className='text-red-600 hover:text-red-700'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
                {item.package && (
                  <p className='text-sm text-gray-600'>
                    Package: {item.package}
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
