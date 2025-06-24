import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { loginAdmin } from '../services/loginService';
import { useAuth } from '@/hooks/useAuth';
import Logo from '../../../../public/Logo.png';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email or phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await loginAdmin({
        email_or_phone: formData.email,
        password: formData.password,
      });

      login(res.access);
      navigate('/admin');
    } catch (err) {
      console.log('Error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className='flex h-screen w-full'>
      {/* Left side with logo and wavy edge */}
      <div className='hidden md:flex md:w-1/2  bg-primary-red relative items-center justify-center'>
        <div className='absolute top-0 right-0 h-full overflow-hidden'>
          <svg
            className='absolute h-full w-auto -right-1'
            viewBox='0 0 100 800'
            preserveAspectRatio='none'
            fill='white'>
            <path
              d='M100,0 
                     L100,800 
                     L0,800 
                     C30,720 10,680 40,640 
                     C70,600 20,560 50,520 
                     C80,480 30,440 60,400 
                     C90,360 40,320 70,280 
                     C100,240 50,200 80,160 
                     C110,120 60,80 90,40 
                     C120,0 70,0 100,0 Z'
            />
          </svg>
        </div>
        <div className='z-10 text-white text-center'>
          <img
            src={Logo}
            alt='Keyroute'
            className='mx-auto mb-3 w-sm '
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className='w-full md:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <h2 className='text-3xl font-bold mb-8 text-gray-800'>Admin login</h2>

          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            <div>
              <input
                type='text'
                name='email'
                placeholder='Email or phone'
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 ${
                  errors.email ? 'ring-1 ring-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
              )}
            </div>

            <div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-0 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 ${
                    errors.password ? 'ring-1 ring-red-500' : ''
                  }`}
                />

                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'>
              {isSubmitting ? (
                <LoadingSpinner size='small' />
              ) : (
                <>
                  LOGIN
                  <ArrowRight className='ml-2 h-5 w-5' />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
