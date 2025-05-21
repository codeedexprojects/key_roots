import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '@/lib/getImageUrl';

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
          imagePreview: item.banner.image,
          title: item.banner.title || '',
          description: item.banner.description || '',
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
    }
  }, [item]);

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          banner: {
            ...formData.banner,
            image: file,
            imagePreview: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      banner: {
        ...formData.banner,
        [name]: value,
      },
    });
  };

  const handleDealImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedDeals = [...formData.deals];
        updatedDeals[index] = {
          ...updatedDeals[index],
          image: file,
          imagePreview: reader.result,
        };
        setFormData({
          ...formData,
          deals: updatedDeals,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDealChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDeals = [...formData.deals];
    updatedDeals[index] = {
      ...updatedDeals[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      deals: updatedDeals,
    });
  };

  const addDeal = () => {
    setFormData({
      ...formData,
      deals: [
        ...formData.deals,
        {
          image: null,
          imagePreview: null,
          title: '',
          description: '',
          offer: '',
        },
      ],
    });
  };

  const removeDeal = (index) => {
    const updatedDeals = [...formData.deals];
    updatedDeals.splice(index, 1);
    setFormData({
      ...formData,
      deals: updatedDeals,
    });
  };

  const handleFooterImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedFooters = [...formData.footers];
        updatedFooters[index] = {
          ...updatedFooters[index],
          image: file,
          imagePreview: reader.result,
        };
        setFormData({
          ...formData,
          footers: updatedFooters,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFooterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFooters = [...formData.footers];
    updatedFooters[index] = {
      ...updatedFooters[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      footers: updatedFooters,
    });
  };

  const addFooter = () => {
    setFormData({
      ...formData,
      footers: [
        ...formData.footers,
        {
          image: null,
          imagePreview: null,
          title: '',
          phone: '',
          description: '',
          price: '',
          offerPrice: '',
        },
      ],
    });
  };

  const removeFooter = (index) => {
    const updatedFooters = [...formData.footers];
    updatedFooters.splice(index, 1);
    setFormData({
      ...formData,
      footers: updatedFooters,
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
          {item ? 'Edit Advertisement' : 'Add New Advertisement'}
        </h2>
      </div>

      {/* Banner Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-lg font-semibold mb-4'>Advertisement Section</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer hover:border-primary transition-colors'
              onClick={() => document.getElementById('banner-image').click()}>
              {formData.banner.imagePreview ? (
                <img
                  src={
                    getImageUrl(formData.banner.imagePreview) ||
                    '/placeholder.svg'
                  }
                  alt='Banner preview'
                  className='max-h-full object-contain'
                />
              ) : (
                <>
                  <Upload className='h-10 w-10 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>
                    Add image for advertisement section
                  </p>
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
                Ad Title
              </label>
              <input
                type='text'
                id='banner-title'
                name='title'
                value={formData.banner.title}
                onChange={handleBannerChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            <div>
              <label
                htmlFor='banner-description'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Ad Description
              </label>
              <textarea
                id='banner-description'
                name='description'
                value={formData.banner.description}
                onChange={handleBannerChange}
                rows={4}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Limited Deal Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Limited deal section</h2>
          <button
            type='button'
            onClick={addDeal}
            className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Plus className='h-4 w-4 mr-1' />
            Add More
          </button>
        </div>

        {formData.deals.length === 0 ? (
          <div className='flex flex-wrap gap-4 mb-4'>
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 w-32 cursor-pointer hover:border-primary transition-colors'
              onClick={addDeal}>
              <Plus className='h-6 w-6 text-gray-400 mb-1' />
              <p className='text-xs text-gray-500 text-center'>
                Add 3x more for limited deal section
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {formData.deals.map((deal, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4'>
                <div className='flex justify-end mb-2'>
                  <button
                    type='button'
                    onClick={() => removeDeal(index)}
                    className='text-red-500 hover:text-red-700'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary transition-colors'
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
                          <Upload className='h-8 w-8 text-gray-400 mb-1' />
                          <p className='text-xs text-gray-500'>Upload image</p>
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
                  </div>

                  <div className='space-y-3 md:col-span-2'>
                    <div>
                      <label
                        htmlFor={`deal-title-${index}`}
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Ad Title
                      </label>
                      <input
                        type='text'
                        id={`deal-title-${index}`}
                        name='title'
                        value={deal.title}
                        onChange={(e) => handleDealChange(index, e)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`deal-description-${index}`}
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Ad Description
                      </label>
                      <textarea
                        id={`deal-description-${index}`}
                        name='description'
                        value={deal.description}
                        onChange={(e) => handleDealChange(index, e)}
                        rows={2}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`deal-offer-${index}`}
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Add Offer
                      </label>
                      <input
                        type='text'
                        id={`deal-offer-${index}`}
                        name='offer'
                        value={deal.offer}
                        onChange={(e) => handleDealChange(index, e)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Footer section</h2>
          <button
            type='button'
            onClick={addFooter}
            className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Plus className='h-4 w-4 mr-1' />
            Add More
          </button>
        </div>

        {formData.footers.length === 0 ? (
          <div className='flex flex-wrap gap-4 mb-4'>
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 w-32 cursor-pointer hover:border-primary transition-colors'
              onClick={addFooter}>
              <Plus className='h-6 w-6 text-gray-400 mb-1' />
              <p className='text-xs text-gray-500 text-center'>
                Add footer item
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {formData.footers.map((footer, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4'>
                <div className='flex justify-end mb-2'>
                  <button
                    type='button'
                    onClick={() => removeFooter(index)}
                    className='text-red-500 hover:text-red-700'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary transition-colors'
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
                          <Upload className='h-8 w-8 text-gray-400 mb-1' />
                          <p className='text-xs text-gray-500'>
                            Add image for advertisement section
                          </p>
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
                  </div>

                  <div className='space-y-3 md:col-span-2'>
                    <div>
                      <label
                        htmlFor={`footer-title-${index}`}
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Ad Title
                      </label>
                      <input
                        type='text'
                        id={`footer-title-${index}`}
                        name='title'
                        value={footer.title}
                        onChange={(e) => handleFooterChange(index, e)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`footer-phone-${index}`}
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Add Phone number
                      </label>
                      <input
                        type='text'
                        id={`footer-phone-${index}`}
                        name='phone'
                        value={footer.phone}
                        onChange={(e) => handleFooterChange(index, e)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`footer-description-${index}`}
                        className='block text-sm font-medium text-gray-700 mb-1'>
                        Ad Description
                      </label>
                      <textarea
                        id={`footer-description-${index}`}
                        name='description'
                        value={footer.description}
                        onChange={(e) => handleFooterChange(index, e)}
                        rows={2}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label
                          htmlFor={`footer-price-${index}`}
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          Add Price
                        </label>
                        <input
                          type='text'
                          id={`footer-price-${index}`}
                          name='price'
                          value={footer.price}
                          onChange={(e) => handleFooterChange(index, e)}
                          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`footer-offer-price-${index}`}
                          className='block text-sm font-medium text-gray-700 mb-1'>
                          Add offer Price
                        </label>
                        <input
                          type='text'
                          id={`footer-offer-price-${index}`}
                          name='offerPrice'
                          value={footer.offerPrice}
                          onChange={(e) => handleFooterChange(index, e)}
                          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
