import { getImageUrl } from '@/lib/getImageUrl';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';

export const ExploreForm = ({ item, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    id: null,
    image: null,
    imagePreview: null,
    title: '',
    description: '',
    seasonDescription: '',
    sights: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        image: null,
        imagePreview: item.image,
        title: item.title || '',
        description: item.description || '',
        seasonDescription: item.seasonDescription || '',
        sights:
          item.sights?.map((sight) => ({
            ...sight,
            image: null,
            imagePreview: sight.image,
          })) || [],
      });
    }
  }, [item]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSightImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedSights = [...formData.sights];
        updatedSights[index] = {
          ...updatedSights[index],
          image: file,
          imagePreview: reader.result,
        };
        setFormData({
          ...formData,
          sights: updatedSights,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSightChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSights = [...formData.sights];
    updatedSights[index] = {
      ...updatedSights[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      sights: updatedSights,
    });
  };

  const addSight = () => {
    setFormData({
      ...formData,
      sights: [
        ...formData.sights,
        { image: null, imagePreview: null, description: '' },
      ],
    });
  };

  const removeSight = (index) => {
    const updatedSights = [...formData.sights];
    updatedSights.splice(index, 1);
    setFormData({
      ...formData,
      sights: updatedSights,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-8'>
      <div className='flex items-center mb-4'>
        <button
          type='button'
          onClick={onCancel}
          className='inline-flex items-center text-gray-600 hover:text-gray-900 mr-4'>
          <ArrowLeft className='h-4 w-4 mr-1' />
          Back
        </button>
        <h2 className='text-lg font-semibold'>
          {item ? 'Edit Explore Item' : 'Add New Explore Item'}
        </h2>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer hover:border-primary transition-colors'
              onClick={() => document.getElementById('main-image').click()}>
              {formData.imagePreview ? (
                <img
                  src={getImageUrl(formData.imagePreview) || '/placeholder.svg'}
                  alt='Main preview'
                  className='max-h-full object-contain'
                />
              ) : (
                <>
                  <Upload className='h-10 w-10 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>
                    Add image for Explore section
                  </p>
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
          </div>

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Ad Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Ad Description
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            <div>
              <label
                htmlFor='seasonDescription'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Ad Season Description
              </label>
              <textarea
                id='seasonDescription'
                name='seasonDescription'
                value={formData.seasonDescription}
                onChange={handleInputChange}
                rows={2}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>
          </div>
        </div>

        {/* Sights Section */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-semibold text-gray-900'>
              Sights and experience
            </h3>
            <button
              type='button'
              onClick={addSight}
              className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
              <Plus className='h-4 w-4 mr-1' />
              Add More
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {formData.sights.map((sight, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4 relative'>
                <button
                  type='button'
                  onClick={() => removeSight(index)}
                  className='absolute top-2 right-2 text-red-500 hover:text-red-700'>
                  <Trash2 className='h-4 w-4' />
                </button>

                <div
                  className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary transition-colors mb-3'
                  onClick={() =>
                    document.getElementById(`sight-image-${index}`).click()
                  }>
                  {sight.imagePreview ? (
                    <img
                      src={
                        getImageUrl(sight.imagePreview) || '/placeholder.svg'
                      }
                      alt={`Sight ${index + 1} preview`}
                      className='max-h-full object-contain'
                    />
                  ) : (
                    <>
                      <Upload className='h-8 w-8 text-gray-400 mb-1' />
                      <p className='text-xs text-gray-500'>
                        Add image for Explore section
                      </p>
                    </>
                  )}
                  <input
                    type='file'
                    id={`sight-image-${index}`}
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => handleSightImageChange(index, e)}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`sight-description-${index}`}
                    className='block text-sm font-medium text-gray-700 mb-1'>
                    Ad Description
                  </label>
                  <textarea
                    id={`sight-description-${index}`}
                    name='description'
                    value={sight.description}
                    onChange={(e) => handleSightChange(index, e)}
                    rows={2}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                  />
                </div>
              </div>
            ))}

            {formData.sights.length === 0 && (
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary transition-colors'
                onClick={addSight}>
                <Plus className='h-8 w-8 text-gray-400 mb-1' />
                <p className='text-sm text-gray-500'>Add sight</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={onCancel}
          className='px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-3'>
          Cancel
        </button>
        <button
          type='submit'
          disabled={isLoading}
          className='px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};
