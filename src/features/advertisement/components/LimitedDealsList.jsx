import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { LimitedDealForm } from './LimitedDealForm';
import {
  getLimitedDeals,
  deleteLimitedDeal,
} from '../services/advertisementService';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';

export const LimitedDealsList = () => {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setIsLoading(true);
    try {
      const response = await getLimitedDeals();
      if (response && !response.error) {
        // Handle direct array response or response with data field
        const data = Array.isArray(response) ? response : response.data || [];
        setDeals(data);
      } else {
        toast.error(response?.message || 'Failed to load limited deals');
        setDeals([]);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals. Please try again later.');
      setDeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const deal = deals.find((d) => d.id === id);
    const itemName = deal?.title || 'this limited deal';

    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        const response = await deleteLimitedDeal(id);
        if (response && response.success) {
          setDeals(deals.filter((deal) => deal.id !== id));
          toast.success('Limited deal deleted successfully');
        } else {
          toast.error(response?.message || 'Failed to delete limited deal');
        }
      } catch (error) {
        console.error('Error deleting deal:', error);
        toast.error('Failed to delete limited deal');
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
    loadDeals();
  };

  if (showAddForm) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <LimitedDealForm
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold'>Limited deal section</h3>
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
      ) : deals.length === 0 ? (
        <EmptyState
          title='No limited deals found'
          description='Create your first limited deal to get started.'
          actionLabel='Add Deal'
          onAction={handleAddNew}
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {deals.map((deal) => (
            <div
              key={deal.id}
              className='bg-gray-50 rounded-lg shadow-sm overflow-hidden'>
              <div className='h-48 overflow-hidden'>
                <img
                  src={
                    getImageUrl(deal.images?.[0]?.image) || '/placeholder.svg'
                  }
                  alt={deal.title}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <h4 className='font-semibold text-gray-900'>
                    {deal.title || 'Untitled'}
                  </h4>
                  <button
                    onClick={() => handleDelete(deal.id)}
                    className='text-red-600 hover:text-red-700'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
                {deal.subtitle && (
                  <p className='text-sm text-gray-600 mb-1'>{deal.subtitle}</p>
                )}
                {deal.terms_and_conditions && (
                  <p className='text-sm text-gray-600 line-clamp-2 mb-2'>
                    {deal.terms_and_conditions}
                  </p>
                )}
                {deal.offer && (
                  <span className='inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded'>
                    {deal.offer}
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
