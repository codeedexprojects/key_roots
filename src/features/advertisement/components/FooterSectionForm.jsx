import { useState, useEffect } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { saveFooterSection } from '../services/advertisementService';
import { axiosInstance } from '@/lib/axiosInstance'; // Assuming this exists for API calls

export const FooterSectionForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    mainImage: null,
    mainImagePreview: null,
    extraImages: [],
    extraImagePreviews: [],
    package: '',
  });
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'mainImage':
        if (!value) {
          newErrors.mainImage = 'Main image is required';
        } else {
          delete newErrors.mainImage;
        }
        break;
      case 'extraImages':
        if (value && value.length > 2) {
          newErrors.extraImages = 'Maximum 2 extra images allowed';
        } else {
          delete newErrors.extraImages;
        }
        break;
      case 'package':
        if (!value) {
          newErrors.package = 'Package selection is required';
        } else {
          delete newErrors.package;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const fieldsToValidate = ['mainImage', 'extraImages', 'package'];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      let fieldValue;
      if (field === 'mainImage') {
        fieldValue = formData.mainImage;
      } else if (field === 'extraImages') {
        fieldValue = formData.extraImages;
      } else {
        fieldValue = formData[field];
      }

      if (!validateField(field, fieldValue)) {
        isValid = false;
      }
    });

    return isValid;
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosInstance.get('/packages/');
        setPackages(response.data || []);
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to load packages.');
      }
    };
    fetchPackages();
  }, []);

  const handleMainImageChange = (e) => {
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
          mainImage: file,
          mainImagePreview: reader.result,
        }));
        validateField('mainImage', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate number of files
    if (files.length > 2) {
      toast.error('Maximum 2 extra images allowed');
      return;
    }

    // Validate each file
    for (const file of files) {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select valid image files (JPEG, PNG, or GIF)');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Each image size must be less than 5MB');
        return;
      }
    }

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((previews) => {
      setFormData((prev) => ({
        ...prev,
        extraImages: files,
        extraImagePreviews: previews,
      }));
      validateField('extraImages', files);
    });
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

    console.log(formData);
    try {
      const response = await saveFooterSection(formData);
      if (response && !response.error) {
        toast.success('Footer section saved successfully!');
        onSuccess();
      } else {
        toast.error(response?.message || 'Failed to save footer section');
      }
    } catch (error) {
      console.error('Error saving footer section:', error);
      toast.error('Failed to save footer section. Please try again later.');
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
        <h3 className='text-lg font-semibold'>Add New Footer Section</h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Main Image <span className='text-red-500'>*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer transition-colors ${
                errors.mainImage
                  ? 'border-red-300 hover:border-red-500'
                  : 'border-gray-300 hover:border-red-500'
              }`}
              onClick={() => document.getElementById('main-image').click()}>
              {formData.mainImagePreview ? (
                <img
                  src={formData.mainImagePreview}
                  alt='Main preview'
                  className='max-h-full object-contain'
                />
              ) : (
                <>
                  <Upload className='h-10 w-10 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>Add main image</p>
                </>
              )}
              <input
                type='file'
                id='main-image'
                accept='image/*'
                className='hidden'
                onChange={handleMainImageChange}
              />
            </div>
            {errors.mainImage && (
              <p className='text-red-500 text-sm mt-1'>{errors.mainImage}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Extra Images (Optional - Max 2)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer transition-colors ${
                errors.extraImages
                  ? 'border-red-300 hover:border-red-500'
                  : 'border-gray-300 hover:border-red-500'
              }`}
              onClick={() => document.getElementById('extra-images').click()}>
              {formData.extraImagePreviews.length > 0 ? (
                <div className='grid grid-cols-2 gap-2'>
                  {formData.extraImagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Extra preview ${index + 1}`}
                      className='max-h-32 object-contain'
                    />
                  ))}
                </div>
              ) : (
                <>
                  <Upload className='h-10 w-10 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>
                    Add extra images (up to 2)
                  </p>
                </>
              )}
              <input
                type='file'
                id='extra-images'
                accept='image/*'
                multiple
                className='hidden'
                onChange={handleExtraImagesChange}
              />
            </div>
            {errors.extraImages && (
              <p className='text-red-500 text-sm mt-1'>{errors.extraImages}</p>
            )}
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='package'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Package <span className='text-red-500'>*</span>
            </label>
            <select
              id='package'
              name='package'
              value={formData.package}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.package ? 'border-red-300' : 'border-gray-300'
              }`}>
              <option
                value=''
                disabled>
                Select a package
              </option>
              {packages.map((pkg) => (
                <option
                  key={pkg.id}
                  value={pkg.id}>
                  {pkg.places} ({pkg.days} days)
                </option>
              ))}
            </select>
            {errors.package && (
              <p className='text-red-500 text-sm mt-1'>{errors.package}</p>
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
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
