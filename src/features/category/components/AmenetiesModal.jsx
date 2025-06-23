import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common';
import {
  getAllAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from '../services/busService';
import { getImageUrl } from '@/lib/getImageUrl';

const AmenitiesModal = ({ isOpen, onClose }) => {
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadAmenities();
    }
  }, [isOpen]);

  const loadAmenities = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAmenities();
      if (response && !response.error) {
        const data = Array.isArray(response) ? response : response.data || [];
        setAmenities(data);
      } else {
        toast.error(response?.message || 'Failed to load amenities');
        setAmenities([]);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
      toast.error('Failed to load amenities. Please try again later.');
      setAmenities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Amenity name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (editingAmenity) {
        response = await updateAmenity(editingAmenity.id, formData);
        toast.success('Amenity updated successfully');
      } else {
        response = await createAmenity(formData);
        toast.success('Amenity created successfully');
      }

      if (response && !response.error) {
        await loadAmenities();
        resetForm();
      } else {
        toast.error(response?.message || 'Failed to save amenity');
      }
    } catch (error) {
      console.error('Error saving amenity:', error);
      toast.error('Failed to save amenity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name || '',
      description: amenity.description || '',
      icon: null, // File inputs can't be prefilled
    });
    setShowForm(true);
  };

  const handleDelete = async (amenityId) => {
    if (!window.confirm('Are you sure you want to delete this amenity?')) {
      return;
    }

    try {
      const response = await deleteAmenity(amenityId);
      if (response && !response.error) {
        toast.success('Amenity deleted successfully');
        await loadAmenities();
      } else {
        toast.error(response?.message || 'Failed to delete amenity');
      }
    } catch (error) {
      console.error('Error deleting amenity:', error);
      toast.error('Failed to delete amenity. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: null });
    setEditingAmenity(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'icon') {
      setFormData((prev) => ({ ...prev, icon: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <Settings className='h-6 w-6 text-red-600' />
            <h2 className='text-xl font-semibold text-gray-800'>
              Manage Amenities
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <X className='h-5 w-5 text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          {/* Add New Button */}
          {!showForm && (
            <div className='mb-6'>
              <button
                onClick={() => setShowForm(true)}
                className='flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'>
                <Plus className='h-4 w-4' />
                Add New Amenity
              </button>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className='mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50'>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>
                {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
              </h3>
              <form
                onSubmit={handleSubmit}
                className='space-y-4'
                encType='multipart/form-data' // Add this
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Name *
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      placeholder='Enter amenity name'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Icon
                    </label>
                    <input
                      type='file' // Change to file input
                      name='icon'
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      accept='image/*' // Restrict to images if ImageField
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    placeholder='Enter amenity description'
                  />
                </div>
                <div className='flex gap-3'>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'>
                    {isSubmitting && <LoadingSpinner size='small' />}
                    {editingAmenity ? 'Update' : 'Create'}
                  </button>
                  <button
                    type='button'
                    onClick={resetForm}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Amenities List */}
          {isLoading ? (
            <div className='flex justify-center items-center py-12'>
              <LoadingSpinner size='large' />
            </div>
          ) : amenities.length === 0 ? (
            <div className='text-center py-12'>
              <Settings className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No amenities found
              </h3>
              <p className='text-gray-500'>
                Start by adding your first amenity.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center gap-3'>
                      {amenity.icon && (
                        <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
                          <img
                            src={getImageUrl(amenity.icon)}
                            alt={amenity.name}
                            className='w-full h-full object-cover rounded-full'
                          />
                        </div>
                      )}
                      <h4 className='font-medium text-gray-800'>
                        {amenity.name}
                      </h4>
                    </div>
                    <div className='flex gap-1'>
                      <button
                        onClick={() => handleEdit(amenity)}
                        className='p-1 text-gray-400 hover:text-blue-600 transition-colors'>
                        <Edit2 className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(amenity.id)}
                        className='p-1 text-gray-400 hover:text-red-600 transition-colors'>
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                  {amenity.description && (
                    <p className='text-sm text-gray-600'>
                      {amenity.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmenitiesModal;
