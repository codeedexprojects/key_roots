import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/common';
import { createUser } from '../services/userService';
import { toast } from 'sonner';

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    role: 'user', // Default role
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

    // Check required fields
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    }
    if (!formData.role?.trim()) {
      newErrors.role = 'Role is required';
    }

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate mobile number (10 digits)
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    // Validate password length
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please check the form for errors and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createUser(formData);

      if (response?.error) {
        let errorMsg =
          response.message || 'Something went wrong. Please try again.';

        if (response.details && typeof response.details === 'object') {
          const fieldMessages = Object.entries(response.details)
            .map(
              ([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
            )
            .join(' | ');

          if (fieldMessages) errorMsg = fieldMessages;
        }

        toast.error(errorMsg);
      } else {
        toast.success('The user has been created successfully.');
        navigate('/users');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/users'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back to Users</span>
        </Link>
      </div>

      <h1 className='text-2xl font-semibold mb-6'>Create New User</h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-sm overflow-hidden border-0'>
        <div className='p-6'>
          {/* User Information */}
          <div className='mb-8'>
            <h2 className='text-lg font-medium text-gray-800 mb-4'>
              User Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Full Name *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.name
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder='Enter full name'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-500'>{errors.name}</p>
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
                  placeholder='Enter mobile number'
                />
                {errors.mobile && (
                  <p className='mt-1 text-sm text-red-500'>{errors.mobile}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Email Address *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.email
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder='Enter email address'
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
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
                  placeholder='Enter password'
                />
                {errors.password && (
                  <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='role'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Role *
                </label>
                <select
                  id='role'
                  name='role'
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 ${
                    errors.role
                      ? 'border border-red-500'
                      : 'border border-gray-300 bg-white'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}>
                  <option value='user'>User</option>
                  <option value='vendor'>Vendor</option>
                </select>
                {errors.role && (
                  <p className='mt-1 text-sm text-red-500'>{errors.role}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className='px-6 py-4 bg-gray-50 flex justify-end'>
          <button
            type='button'
            onClick={() => navigate('/users')}
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
              'Create User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
