import React, { useState } from 'react';
import { FaPlus, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../services/categoryService';

const SubPackageCategories = ({
  mainCategory,
  subCategories,
  onSubCategoryClick,
  onBack,
  isLoading,
  onRefresh,
  allCategories,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({
    name: '',
    image: null,
    imagePreview: null,
    category: mainCategory?.id || '',
  });

  const handleAddClick = () => {
    setEditingSubCategory(null);
    setNewSubCategory({
      name: '',
      image: null,
      imagePreview: null,
      category: mainCategory?.id || '',
    });
    setShowAddForm(true);
  };

  const handleEditClick = (subCategory, e) => {
    e.stopPropagation();
    setEditingSubCategory(subCategory);
    setNewSubCategory({
      name: subCategory.name || subCategory.title,
      image: null,
      imagePreview: getImageUrl(subCategory.image),
      category: subCategory.category || mainCategory?.id || '',
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = async (subCategory, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${
          subCategory.name || subCategory.title
        }"?`
      )
    ) {
      try {
        setIsSubmitting(true);
        await deleteSubCategory(subCategory.id);
        toast.success('Subcategory deleted successfully');
        onRefresh();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        toast.error('Failed to delete subcategory. It may be in use.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setEditingSubCategory(null);
    setNewSubCategory({
      name: '',
      image: null,
      imagePreview: null,
      category: mainCategory?.id || '',
    });
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

  const handleNameChange = (e) => {
    setNewSubCategory({
      ...newSubCategory,
      name: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    setNewSubCategory({
      ...newSubCategory,
      category: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSubCategory.name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }

    if (!newSubCategory.category) {
      toast.error('Category is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', newSubCategory.name.trim());
      formData.append('category', newSubCategory.category);

      if (newSubCategory.image) {
        formData.append('image', newSubCategory.image);
      }

      if (editingSubCategory) {
        await updateSubCategory(editingSubCategory.id, formData);
        toast.success('Subcategory updated successfully');
      } else {
        await createSubCategory(formData);
        toast.success('Subcategory created successfully');
      }

      setShowAddForm(false);
      setEditingSubCategory(null);
      setNewSubCategory({
        name: '',
        image: null,
        imagePreview: null,
        category: mainCategory?.id || '',
      });
      onRefresh();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast.error(
        `Failed to ${editingSubCategory ? 'update' : 'create'} subcategory`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='w-full'>
        <div className='flex items-center gap-4 mb-5'>
          <button
            className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
            onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <h2 className='text-xl font-semibold text-gray-800'>
            {mainCategory?.name || mainCategory?.title} - Sub Categories
          </h2>
        </div>
        <div className='flex justify-center items-center min-h-[400px]'>
          <LoadingSpinner size='large' />
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex items-center gap-4 mb-5'>
        <button
          className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
          onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
        <h2 className='text-xl font-semibold text-gray-800'>
          {mainCategory?.name || mainCategory?.title} - Sub Categories
        </h2>
      </div>

      {subCategories.length === 0 ? (
        <EmptyState
          title='No subcategories found'
          description='Create your first subcategory to get started.'
          actionLabel='Add Sub-Category'
          onAction={handleAddClick}
          icon='default'
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer relative group'
              onClick={() => onSubCategoryClick(subCategory)}>
              <div className='h-48 overflow-hidden'>
                <img
                  src={getImageUrl(subCategory.image) || '/placeholder.svg'}
                  alt={subCategory.name || subCategory.title}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Action buttons */}
              <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2'>
                <button
                  onClick={(e) => handleEditClick(subCategory, e)}
                  className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors'
                  disabled={isSubmitting}
                  title='Edit Subcategory'>
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(subCategory, e)}
                  className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors'
                  disabled={isSubmitting}
                  title='Delete Subcategory'>
                  <FaTrash size={12} />
                </button>
              </div>

              <h3 className='p-4 text-center font-medium text-gray-800'>
                {subCategory.name || subCategory.title}
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
      )}

      {/* Modal for Add/Edit Subcategory */}
      {showAddForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold mb-4'>
              {editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Subcategory Name *
                </label>
                <input
                  type='text'
                  value={newSubCategory.name}
                  onChange={handleNameChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter subcategory name'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Category *
                </label>
                <select
                  value={newSubCategory.category}
                  onChange={handleCategoryChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required>
                  <option value=''>Select a category</option>
                  {allCategories &&
                    allCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}>
                        {category.name || category.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Subcategory Image
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {newSubCategory.imagePreview && (
                  <div className='mt-2'>
                    <img
                      src={newSubCategory.imagePreview}
                      alt='Preview'
                      className='w-20 h-20 object-cover rounded-md'
                    />
                  </div>
                )}
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={handleCancelAdd}
                  className='flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
                  disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50'
                  disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Saving...'
                    : editingSubCategory
                    ? 'Update'
                    : 'Create'}
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
