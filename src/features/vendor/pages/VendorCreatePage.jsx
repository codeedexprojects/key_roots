import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/common';
import { createVendor } from '../services/vendorService';
import { useToast } from '@/components/ui/toast-provider';

export const VendorCreatePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    email_address: '',
    password: '',
    full_name: '',
    travels_name: '',
    location: '',
    landmark: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    district: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing in a field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]?.trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    if (
      formData.email_address &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)
    ) {
      newErrors.email_address = 'Please enter a valid email address';
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        title: 'Form Validation Error',
        message: 'Please check the form for errors and try again.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createVendor(formData);

      if (response?.error) {
        addToast({
          title: 'Error Creating Vendor',
          message:
            response?.message || 'Something went wrong. Please try again.',
          type: 'error',
        });
      } else {
        addToast({
          title: 'Vendor Created',
          message: 'The vendor has been created successfully.',
          type: 'success',
        });

        navigate('/vendors');
      }
    } catch (error) {
      addToast({
        title: 'Error Creating Vendor',
        message: error?.message || 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/vendors'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back to Vendors</span>
        </Link>
      </div>

      <h1 className='text-2xl font-semibold mb-6'>Create New Vendor</h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-sm overflow-hidden border-0'>
        <div className='p-6'>
          {/* Identity & Contact Information */}
          <div className='mb-8'>
            <h2 className='text-lg font-medium text-gray-800 mb-4'>
              Vendor Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='full_name'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Full Name *
                </label>
                <input
                  type='text'
                  id='full_name'
                  name='full_name'
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.full_name
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.full_name && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='travels_name'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Travels Name *
                </label>
                <input
                  type='text'
                  id='travels_name'
                  name='travels_name'
                  value={formData.travels_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.travels_name
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.travels_name && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.travels_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='mobile'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Mobile Number *
                </label>
                <input
                  type='text'
                  id='mobile'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.mobile
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.mobile && (
                  <p className='mt-1 text-sm text-red-500'>{errors.mobile}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='email_address'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Email Address *
                </label>
                <input
                  type='email'
                  id='email_address'
                  name='email_address'
                  value={formData.email_address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.email_address
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.email_address && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.email_address}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Password *
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.password
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.password && (
                  <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className='text-lg font-medium text-gray-800 mb-4'>
              Address Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='location'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Location *
                </label>
                <input
                  type='text'
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.location
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.location && (
                  <p className='mt-1 text-sm text-red-500'>{errors.location}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='landmark'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Landmark *
                </label>
                <input
                  type='text'
                  id='landmark'
                  name='landmark'
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.landmark
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.landmark && (
                  <p className='mt-1 text-sm text-red-500'>{errors.landmark}</p>
                )}
              </div>

              <div className='md:col-span-2'>
                <label
                  htmlFor='address'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Address *
                </label>
                <textarea
                  id='address'
                  name='address'
                  rows='3'
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.address
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}></textarea>
                {errors.address && (
                  <p className='mt-1 text-sm text-red-500'>{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  City *
                </label>
                <input
                  type='text'
                  id='city'
                  name='city'
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.city
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.city && (
                  <p className='mt-1 text-sm text-red-500'>{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='district'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  District *
                </label>
                <input
                  type='text'
                  id='district'
                  name='district'
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.district
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.district && (
                  <p className='mt-1 text-sm text-red-500'>{errors.district}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='state'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  State *
                </label>
                <input
                  type='text'
                  id='state'
                  name='state'
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.state
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.state && (
                  <p className='mt-1 text-sm text-red-500'>{errors.state}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='pincode'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Pincode *
                </label>
                <input
                  type='text'
                  id='pincode'
                  name='pincode'
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.pincode
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                />
                {errors.pincode && (
                  <p className='mt-1 text-sm text-red-500'>{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className='px-6 py-4 bg-gray-50 flex justify-end'>
          <button
            type='button'
            onClick={() => navigate('/vendors')}
            className='px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 mr-3'>
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'>
            {isSubmitting ? (
              <>
                <span className='w-4 h-4 mr-2'>
                  <LoadingSpinner size='small' />
                </span>
                Creating...
              </>
            ) : (
              'Create Vendor'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
