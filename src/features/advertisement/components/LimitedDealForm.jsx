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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer hover:border-red-500 transition-colors'
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
          </div>

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder='e.g., 50% Discount'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
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
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>

            <div>
              <label
                htmlFor='offer'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Offer
              </label>
              <input
                type='text'
                id='offer'
                name='offer'
                value={formData.offer}
                onChange={handleInputChange}
                placeholder='e.g., 50% OFF'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>

            <div>
              <label
                htmlFor='terms_and_conditions'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Terms and Conditions
              </label>
              <textarea
                id='terms_and_conditions'
                name='terms_and_conditions'
                value={formData.terms_and_conditions}
                onChange={handleInputChange}
                rows={4}
                placeholder='e.g., 50% off on selected items!'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
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
