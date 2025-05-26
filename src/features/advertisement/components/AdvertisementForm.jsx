import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';

export const AdvertisementForm = ({ item, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    id: null,
    banner: {
      image: null,
      imagePreview: null,
      title: '',
      description: '',
    },
    deals: [],
    footers: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        banner: {
          image: null,
          imagePreview: item.banner?.image,
          title: item.banner?.title || '',
          description: item.banner?.description || '',
        },
        deals:
          item.deals?.map((deal) => ({
            ...deal,
            image: null,
            imagePreview: deal.image,
          })) || [],
        footers:
          item.footers?.map((footer) => ({
            ...footer,
            image: null,
            imagePreview: footer.image,
          })) || [],
      });
    } else {
      setFormData({
        id: null,
        banner: {
          image: null,
          imagePreview: null,
          title: '',
          description: '',
        },
        deals: [],
        footers: [],
      });
    }
  }, [item]);

  const handleBannerImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          banner: {
            ...prev.banner,
            image: file,
            imagePreview: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleBannerInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        [name]: value,
      },
    }));
  }, []);

  const handleDealImageChange = useCallback((index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const updatedDeals = [...prev.deals];
          updatedDeals[index] = {
            ...updatedDeals[index],
            image: file,
            imagePreview: reader.result,
          };
          return {
            ...prev,
            deals: updatedDeals,
          };
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDealChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedDeals = [...prev.deals];
      updatedDeals[index] = {
        ...updatedDeals[index],
        [name]: value,
      };
      return {
        ...prev,
        deals: updatedDeals,
      };
    });
  }, []);

  const addDeal = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      deals: [
        ...prev.deals,
        {
          id: Date.now(),
          image: null,
          imagePreview: null,
          title: '',
          description: '',
          offer: '',
        },
      ],
    }));
  }, []);

  const removeDeal = useCallback((index) => {
    setFormData((prev) => {
      const updatedDeals = [...prev.deals];
      updatedDeals.splice(index, 1);
      return {
        ...prev,
        deals: updatedDeals,
      };
    });
  }, []);

  const handleFooterImageChange = useCallback((index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const updatedFooters = [...prev.footers];
          updatedFooters[index] = {
            ...updatedFooters[index],
            image: file,
            imagePreview: reader.result,
          };
          return {
            ...prev,
            footers: updatedFooters,
          };
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFooterChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFooters = [...prev.footers];
      updatedFooters[index] = {
        ...updatedFooters[index],
        [name]: value,
      };
      return {
        ...prev,
        footers: updatedFooters,
      };
    });
  }, []);

  const addFooter = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      footers: [
        ...prev.footers,
        {
          id: Date.now(),
          image: null,
          imagePreview: null,
          title: '',
          phone: '',
          description: '',
          price: '',
          offerPrice: '',
        },
      ],
    }));
  }, []);

  const removeFooter = useCallback((index) => {
    setFormData((prev) => {
      const updatedFooters = [...prev.footers];
      updatedFooters.splice(index, 1);
      return {
        ...prev,
        footers: updatedFooters,
      };
    });
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSave(formData);
    },
    [formData, onSave]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-8'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <button
            type='button'
            onClick={onCancel}
            className='inline-flex items-center text-gray-600 hover:text-gray-900 mr-4'>
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back
          </button>
          <h2 className='text-lg font-semibold'>
            {item ? 'Edit Advertisement' : 'Add New Advertisement'}
          </h2>
        </div>
      </div>

      {/* Banner Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='font-semibold text-gray-900 mb-4'>Banner</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer hover:border-red-500 transition-colors'
              onClick={() => document.getElementById('banner-image').click()}>
              {formData.banner.imagePreview ? (
                <img
                  src={formData.banner.imagePreview || '/placeholder.svg'}
                  alt='Banner preview'
                  className='max-h-full object-contain'
                />
              ) : (
                <>
                  <Upload className='h-10 w-10 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>Add banner image</p>
                </>
              )}
              <input
                type='file'
                id='banner-image'
                accept='image/*'
                className='hidden'
                onChange={handleBannerImageChange}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='banner-title'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Banner Title
              </label>
              <input
                type='text'
                id='banner-title'
                name='title'
                value={formData.banner.title}
                onChange={handleBannerInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>

            <div>
              <label
                htmlFor='banner-description'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Banner Description
              </label>
              <textarea
                id='banner-description'
                name='description'
                value={formData.banner.description}
                onChange={handleBannerInputChange}
                rows={5}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Limited Deals Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-semibold text-gray-900'>Limited Deal Section</h3>
          <button
            type='button'
            onClick={addDeal}
            className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Plus className='h-4 w-4 mr-1' />
            Add Deal
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {formData.deals.map((deal, index) => (
            <div
              key={deal.id || index}
              className='border border-gray-200 rounded-lg p-4 relative'>
              <button
                type='button'
                onClick={() => removeDeal(index)}
                className='absolute top-2 right-2 text-red-500 hover:text-red-700'>
                <Trash2 className='h-4 w-4' />
              </button>

              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:border-red-500 transition-colors mb-3'
                onClick={() =>
                  document.getElementById(`deal-image-${index}`).click()
                }>
                {deal.imagePreview ? (
                  <img
                    src={deal.imagePreview || '/placeholder.svg'}
                    alt={`Deal ${index + 1} preview`}
                    className='max-h-full object-contain'
                  />
                ) : (
                  <>
                    <Upload className='h-6 w-6 text-gray-400 mb-1' />
                    <p className='text-xs text-gray-500'>Add image</p>
                  </>
                )}
                <input
                  type='file'
                  id={`deal-image-${index}`}
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => handleDealImageChange(index, e)}
                />
              </div>

              <div className='space-y-2'>
                <input
                  type='text'
                  name='title'
                  placeholder='Deal title'
                  value={deal.title}
                  onChange={(e) => handleDealChange(index, e)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                />
                <textarea
                  name='description'
                  placeholder='Deal description'
                  value={deal.description}
                  onChange={(e) => handleDealChange(index, e)}
                  rows={2}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                />
                <input
                  type='text'
                  name='offer'
                  placeholder='Offer details'
                  value={deal.offer}
                  onChange={(e) => handleDealChange(index, e)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                />
              </div>
            </div>
          ))}

          {formData.deals.length === 0 && (
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-red-500 transition-colors'
              onClick={addDeal}>
              <Plus className='h-8 w-8 text-gray-400 mb-1' />
              <p className='text-sm text-gray-500'>Add deal</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-semibold text-gray-900'>Footer Section</h3>
          <button
            type='button'
            onClick={addFooter}
            className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Plus className='h-4 w-4 mr-1' />
            Add Footer
          </button>
        </div>

        <div className='space-y-4'>
          {formData.footers.map((footer, index) => (
            <div
              key={footer.id || index}
              className='border border-gray-200 rounded-lg p-4 relative'>
              <button
                type='button'
                onClick={() => removeFooter(index)}
                className='absolute top-2 right-2 text-red-500 hover:text-red-700'>
                <Trash2 className='h-4 w-4' />
              </button>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div
                  className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:border-red-500 transition-colors'
                  onClick={() =>
                    document.getElementById(`footer-image-${index}`).click()
                  }>
                  {footer.imagePreview ? (
                    <img
                      src={footer.imagePreview || '/placeholder.svg'}
                      alt={`Footer ${index + 1} preview`}
                      className='max-h-full object-contain'
                    />
                  ) : (
                    <>
                      <Upload className='h-6 w-6 text-gray-400 mb-1' />
                      <p className='text-xs text-gray-500'>Add image</p>
                    </>
                  )}
                  <input
                    type='file'
                    id={`footer-image-${index}`}
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => handleFooterImageChange(index, e)}
                  />
                </div>

                <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-3'>
                    <input
                      type='text'
                      name='title'
                      placeholder='Footer title'
                      value={footer.title}
                      onChange={(e) => handleFooterChange(index, e)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                    <input
                      type='text'
                      name='phone'
                      placeholder='Phone number'
                      value={footer.phone}
                      onChange={(e) => handleFooterChange(index, e)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                    <textarea
                      name='description'
                      placeholder='Footer description'
                      value={footer.description}
                      onChange={(e) => handleFooterChange(index, e)}
                      rows={2}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                  </div>
                  <div className='space-y-3'>
                    <input
                      type='text'
                      name='price'
                      placeholder='Price'
                      value={footer.price}
                      onChange={(e) => handleFooterChange(index, e)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                    <input
                      type='text'
                      name='offerPrice'
                      placeholder='Offer price'
                      value={footer.offerPrice}
                      onChange={(e) => handleFooterChange(index, e)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {formData.footers.length === 0 && (
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:border-red-500 transition-colors'
              onClick={addFooter}>
              <Plus className='h-8 w-8 text-gray-400 mb-1' />
              <p className='text-sm text-gray-500'>Add footer section</p>
            </div>
          )}
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
