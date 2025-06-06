import { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { saveLimitedDeal } from '../services/advertisementService';

export const LimitedDealForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    title: '',
    offer: '',
    terms_and_conditions: '',
    subtitle: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'image':
        if (!value) {
          newErrors.image = 'Image is required';
        } else {
          delete newErrors.image;
        }
        break;
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.trim().length < 2) {
          newErrors.title = 'Title must be at least 2 characters long';
        } else if (value.trim().length > 100) {
          newErrors.title = 'Title must not exceed 100 characters';
        } else {
          delete newErrors.title;
        }
        break;
      case 'subtitle':
        if (value.trim() && value.trim().length < 2) {
          newErrors.subtitle = 'Subtitle must be at least 2 characters long';
        } else if (value.trim().length > 100) {
          newErrors.subtitle = 'Subtitle must not exceed 100 characters';
        } else {
          delete newErrors.subtitle;
        }
        break;
      case 'offer':
        if (!value.trim()) {
          newErrors.offer = 'Offer is required';
        } else if (value.trim().length < 2) {
          newErrors.offer = 'Offer must be at least 2 characters long';
        } else if (value.trim().length > 50) {
          newErrors.offer = 'Offer must not exceed 50 characters';
        } else {
          delete newErrors.offer;
        }
        break;
      case 'terms_and_conditions':
        if (!value.trim()) {
          newErrors.terms_and_conditions = 'Terms and conditions are required';
        } else if (value.trim().length < 10) {
          newErrors.terms_and_conditions =
            'Terms and conditions must be at least 10 characters long';
        } else if (value.trim().length > 500) {
          newErrors.terms_and_conditions =
            'Terms and conditions must not exceed 500 characters';
        } else {
          delete newErrors.terms_and_conditions;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const fieldsToValidate = [
      'image',
      'title',
      'subtitle',
      'offer',
      'terms_and_conditions',
    ];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const fieldValue = field === 'image' ? formData.image : formData[field];
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
      const response = await saveLimitedDeal(formData);
      console.log(response);
      if (response && !response.error) {
        toast.success('Limited deal saved successfully!');
        onSuccess();
      } else {
        toast.error(response?.message || 'Failed to save limited deal');
      }
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error('Failed to save deal. Please try again later.');
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
        <h3 className='text-lg font-semibold'>Add New Limited Deal</h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-sm p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer transition-colors ${
                errors.image
                  ? 'border-red-300 hover:border-red-500'
                  : 'border-gray-300 hover:border-red-500'
              }`}
              onClick={() => document.getElementById('deal-image').click()}>
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt='Deal preview'
                  className='max-h-full object-contain'
                />
              ) : (
                <>
                  <Upload className='h-10 w-10 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>Add deal image</p>
                </>
              )}
              <input
                type='file'
                id='deal-image'
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
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder='e.g., 50% Discount'
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='subtitle'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Subtitle
              </label>
              <input
                type='text'
                id='subtitle'
                name='subtitle'
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder='Optional subtitle'
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.subtitle ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.subtitle && (
                <p className='text-red-500 text-sm mt-1'>{errors.subtitle}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='offer'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Offer <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='offer'
                name='offer'
                value={formData.offer}
                onChange={handleInputChange}
                placeholder='e.g., 50% OFF'
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.offer ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.offer && (
                <p className='text-red-500 text-sm mt-1'>{errors.offer}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='terms_and_conditions'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Terms and Conditions <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='terms_and_conditions'
                name='terms_and_conditions'
                value={formData.terms_and_conditions}
                onChange={handleInputChange}
                rows={4}
                placeholder='e.g., 50% off on selected items!'
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.terms_and_conditions
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
              />
              {errors.terms_and_conditions && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.terms_and_conditions}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-end mt-6 space-x-3'>
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
            {isLoading ? 'Saving...' : 'Save Deal'}
          </button>
        </div>
      </form>
    </div>
  );
};
