import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';

const MainPackageCategories = ({
  categories,
  onCategoryClick,
  isLoading,
  onRefresh,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: null,
    imagePreview: null,
  });

  console.log('categories: ', categories);

  const handleAddClick = () => {
    setEditingCategory(null);
    setNewCategory({ name: '', image: null, imagePreview: null });
    setShowAddForm(true);
  };

  const handleEditClick = (category, e) => {
    e.stopPropagation();
    setEditingCategory(category);
    setNewCategory({
      name: category.name || category.title,
      image: null,
      imagePreview: getImageUrl(category.image),
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = async (category, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${category.name || category.title}"?`
      )
    ) {
      try {
        setIsSubmitting(true);
        await deleteCategory(category.id);
        toast.success('Category deleted successfully');
        onRefresh();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category. It may be in use.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setNewCategory({ name: '', image: null, imagePreview: null });
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

  const handleNameChange = (e) => {
    setNewCategory({
      ...newCategory,
      name: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', newCategory.name.trim());

      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }

      setShowAddForm(false);
      setEditingCategory(null);
      setNewCategory({ name: '', image: null, imagePreview: null });
      onRefresh();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(
        `Failed to ${editingCategory ? 'update' : 'create'} category`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  return (
    <div className='w-full'>
      <h2 className='text-xl font-semibold text-gray-800 mb-5'>
        Main Package Categories
      </h2>

      {categories.length === 0 ? (
        <EmptyState
          title='No categories found'
          description='Create your first package category to get started.'
          actionLabel='Add Category'
          onAction={handleAddClick}
          icon='default'
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {categories.map((category) => (
            <div
              key={category.id}
              className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer relative group'
              onClick={() => onCategoryClick(category)}>
              <div className='h-48 overflow-hidden'>
                <img
                  src={getImageUrl(category.image) || '/placeholder.svg'}
                  alt={category.name || category.title}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Action buttons */}
              <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2'>
                <button
                  onClick={(e) => handleEditClick(category, e)}
                  className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors'
                  disabled={isSubmitting}
                  title='Edit Category'>
                  <FaEdit size={12} />
                </button>
                {category.id !== 9 && (
                  <button
                    onClick={(e) => handleDeleteClick(category, e)}
                    className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors'
                    disabled={isSubmitting}
                    title='Delete Category'>
                    <FaTrash size={12} />
                  </button>
                )}
              </div>

              <h3 className='p-4 text-center font-medium text-gray-800'>
                {category.name || category.title}
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
      )}

      {/* Modal for Add/Edit Category */}
      {showAddForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <h3 className='text-lg font-semibold mb-4'>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Category Name *
                </label>
                <input
                  type='text'
                  value={newCategory.name}
                  onChange={handleNameChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter category name'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Category Image
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {newCategory.imagePreview && (
                  <div className='mt-2'>
                    <img
                      src={newCategory.imagePreview}
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
                    : editingCategory
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

export default MainPackageCategories;
