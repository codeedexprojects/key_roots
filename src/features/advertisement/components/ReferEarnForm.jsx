import { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  saveReferEarn,
  updateReferEarn,
} from '../services/advertisementService';
import { getImageUrl } from '@/lib/getImageUrl';

export const ReferEarnForm = ({
  onCancel,
  onSuccess,
  initialData,
  isEditMode,
}) => {
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: initialData?.image ? initialData.image : null,
    price: initialData?.price || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'image':
        if (!value && !formData.imagePreview) {
          newErrors.image = 'Image is required';
        } else {
          delete newErrors.image;
        }
        break;
      case 'price':
        if (!value.trim()) {
          newErrors.price = 'Price is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors.price = 'Price must be a valid positive number';
        } else if (parseFloat(value) > 999999) {
          newErrors.price = 'Price must not exceed 999,999';
        } else {
          delete newErrors.price;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const fieldsToValidate = ['image', 'price'];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const fieldValue =
        field === 'image'
          ? formData.image || formData.imagePreview
          : formData[field];
      if (!validateField(field, fieldValue)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
        validateField('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const response = isEditMode
        ? await updateReferEarn(initialData.id, formData)
        : await saveReferEarn(formData);
      if (response && !response.error) {
        toast.success(
          `Refer & earn item ${isEditMode ? 'updated' : 'saved'} successfully!`
        );
        onSuccess();
      } else {
        toast.error(
          response?.message ||
            `Failed to ${isEditMode ? 'update' : 'save'} refer & earn item`
        );
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'saving'} item:`, error);
      toast.error(
        `Failed to ${
          isEditMode ? 'update' : 'save'
        } item. Please try again later.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center'>
        <button
          type='button'
          onClick={onCancel}
          className='inline-flex items-center text-gray-600 hover:text-gray-900 mr-4'>
          <ArrowLeft className='h-4 w-4 mr-1' />
          Back
        </button>
        <h3 className='text-lg font-semibold'>
          {isEditMode ? 'Edit Refer & Earn' : 'Add New Refer & Earn'}
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <div
            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer transition-colors ${
              errors.image
                ? 'border-red-300 hover:border-red-500'
                : 'border-gray-300 hover:border-red-500'
            }`}
            onClick={() => document.getElementById('refer-image').click()}>
            {formData.imagePreview ? (
              <img
                src={getImageUrl(formData.imagePreview)}
                alt='Refer & earn preview'
                className='max-h-full object-contain'
              />
            ) : (
              <>
                <Upload className='h-10 w-10 text-gray-400 mb-2' />
                <p className='text-sm text-gray-500'>Add refer & earn image</p>
              </>
            )}
            <input
              type='file'
              id='refer-image'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
          </div>
          {errors.image && (
            <p className='text-red-500 text-sm mt-1'>{errors.image}</p>
          )}
        </div>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='price'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Price <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              id='price'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              required
              min='0'
              step='0.01'
              placeholder='e.g., 500.00'
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className='text-red-500 text-sm mt-1'>{errors.price}</p>
            )}
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onCancel}
              className='px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'>
              {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
