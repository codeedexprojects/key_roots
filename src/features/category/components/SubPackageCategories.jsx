import React, { useState } from 'react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';

const SubPackageCategories = ({ mainCategory, onSubCategoryClick, onBack }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({
    title: '',
    image: null,
    imagePreview: null,
  });

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewSubCategory({ title: '', image: null, imagePreview: null });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewSubCategory({
        ...newSubCategory,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleTitleChange = (e) => {
    setNewSubCategory({
      ...newSubCategory,
      title: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would add this to the subcategories list
    // and possibly send it to a backend
    console.log('New subcategory:', newSubCategory);
    setShowAddForm(false);
    setNewSubCategory({ title: '', image: null, imagePreview: null });
  };

  return (
    <div className='w-full'>
      <div className='flex items-center gap-4 mb-5'>
        <button
          className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
          onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
        <h2 className='text-xl font-semibold text-gray-800'>
          {mainCategory.title} - Sub Categories
        </h2>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {mainCategory.subCategories.map((subCategory) => (
          <div
            key={subCategory.id}
            className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer'
            onClick={() => onSubCategoryClick(subCategory)}>
            <div className='h-48 overflow-hidden'>
              <img
                src={subCategory.image || '/placeholder.svg'}
                alt={subCategory.title}
                className='w-full h-full object-cover'
              />
            </div>
            <h3 className='p-4 text-center font-medium text-gray-800'>
              {subCategory.title}
            </h3>
          </div>
        ))}

        <div
          className='bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors'
          onClick={handleAddClick}>
          <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-2 mt-12'>
            <FaPlus />
          </div>
          <h3 className='p-4 text-center font-medium text-gray-700'>
            Add Sub-Category
          </h3>
        </div>
      </div>

      {showAddForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Add New Sub-Category
            </h3>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Upload Image
                </label>
                <div className='relative h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center'>
                  {newSubCategory.imagePreview ? (
                    <div className='absolute inset-0 rounded-lg overflow-hidden'>
                      <img
                        src={newSubCategory.imagePreview || '/placeholder.svg'}
                        alt='Preview'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ) : (
                    <div className='flex flex-col items-center text-gray-500'>
                      <FaPlus className='mb-2' />
                      <span>Add photo</span>
                    </div>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    required
                    className='absolute inset-0 opacity-0 cursor-pointer'
                  />
                </div>
              </div>

              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Header Text
                </label>
                <input
                  type='text'
                  value={newSubCategory.title}
                  onChange={handleTitleChange}
                  placeholder='Enter sub-category title'
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent'
                />
              </div>

              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                  onClick={handleCancelAdd}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800'>
                  Add Sub-Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubPackageCategories;
