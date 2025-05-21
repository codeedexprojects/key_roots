import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const MainPackageCategories = ({ categories, onCategoryClick }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    title: '',
    image: null,
    imagePreview: null,
  });

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewCategory({ title: '', image: null, imagePreview: null });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCategory({
        ...newCategory,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleTitleChange = (e) => {
    setNewCategory({
      ...newCategory,
      title: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would add this to the categories list
    // and possibly send it to a backend
    console.log('New category:', newCategory);
    setShowAddForm(false);
    setNewCategory({ title: '', image: null, imagePreview: null });
  };

  return (
    <div className='w-full'>
      <h2 className='text-xl font-semibold text-gray-800 mb-5'>
        Main Package Categories
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {categories.map((category) => (
          <div
            key={category.id}
            className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer'
            onClick={() => onCategoryClick(category)}>
            <div className='h-48 overflow-hidden'>
              <img
                src={category.image || '/placeholder.svg'}
                alt={category.title}
                className='w-full h-full object-cover'
              />
            </div>
            <h3 className='p-4 text-center font-medium text-gray-800'>
              {category.title}
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
            Add More
          </h3>
        </div>
      </div>

      {showAddForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Add New Category
            </h3>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Upload Image
                </label>
                <div className='relative h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center'>
                  {newCategory.imagePreview ? (
                    <div className='absolute inset-0 rounded-lg overflow-hidden'>
                      <img
                        src={newCategory.imagePreview || '/placeholder.svg'}
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
                  Title
                </label>
                <input
                  type='text'
                  value={newCategory.title}
                  onChange={handleTitleChange}
                  placeholder='Enter category title'
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPackageCategories;
