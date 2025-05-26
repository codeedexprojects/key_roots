import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

/**
 * Function to get all package categories
 * @returns {Promise} Promise that resolves to the categories data
 */
export const getPackageCategories = async () => {
  return apiRequest(
    () => axiosInstance.get('/category/'),
    'Error occurred while fetching package categories.'
  );
};

/**
 * Function to get subcategories by category ID
 * @param {string|number} categoryId - The ID of the category
 * @returns {Promise} Promise that resolves to the subcategories data
 */
export const getSubCategories = async (categoryId) => {
  return apiRequest(
    () => axiosInstance.get(`/sub-category/?category_id=${categoryId}`),
    `Error occurred while fetching subcategories for category ${categoryId}.`
  );
};

/**
 * Function to get packages by subcategory ID
 * @param {string|number} subCategoryId - The ID of the subcategory
 * @returns {Promise} Promise that resolves to the packages data
 */
export const getPackagesBySubCategory = async (subCategoryId) => {
  return apiRequest(
    () => axiosInstance.get(`/packages/?sub_category_id=${subCategoryId}`),
    `Error occurred while fetching packages for subcategory ${subCategoryId}.`
  );
};

/**
 * Function to get package details by ID
 * @param {string|number} packageId - The ID of the package
 * @returns {Promise} Promise that resolves to the package details
 */
export const getPackageDetails = async (packageId) => {
  return apiRequest(
    () => axiosInstance.get(`/packages/${packageId}/`),
    `Error occurred while fetching package details for ID ${packageId}.`
  );
};

/**
 * Transform category data from API response to component format
 * @param {Array} categories - Array of category objects from API
 * @returns {Array} Transformed category data
 */
export const transformCategoryData = (categories) => {
  if (!Array.isArray(categories)) return [];

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    title: category.name, // For backward compatibility
    image: category.image,
  }));
};

/**
 * Transform subcategory data from API response to component format
 * @param {Array} subcategories - Array of subcategory objects from API
 * @returns {Array} Transformed subcategory data
 */
export const transformSubCategoryData = (subcategories) => {
  if (!Array.isArray(subcategories)) return [];

  return subcategories.map((subCategory) => ({
    id: subCategory.id,
    name: subCategory.name,
    title: subCategory.name, // For backward compatibility
    image: subCategory.image,
    category: subCategory.category,
  }));
};

/**
 * Transform package data from API response to component format
 * @param {Array} packages - Array of package objects from API
 * @returns {Array} Transformed package data
 */
export const transformPackageData = (packages) => {
  if (!Array.isArray(packages)) return [];

  return packages.map((pkg) => ({
    id: pkg.id,
    title: pkg.sub_category_name || 'Package',
    places: pkg.places,
    days: pkg.days,
    duration: `${pkg.days} days`,
    ac_available: pkg.ac_available,
    guide_included: pkg.guide_included,
    sub_category_name: pkg.sub_category_name,
    // Add placeholder data for fields not in listing API
    image: pkg.header_image || '/placeholder.svg',
    route: pkg.places || 'Tour Package',
    price: 0, // Will be fetched from details API
  }));
};

/**
 * Transform package details from API response to component format
 * @param {Object} packageDetails - Package details object from API
 * @returns {Object} Transformed package details
 */
export const transformPackageDetails = (packageDetails) => {
  if (!packageDetails) return null;

  return {
    id: packageDetails.id,
    title: packageDetails.places || 'Package Tour',
    places: packageDetails.places,
    days: packageDetails.days,
    duration: `${packageDetails.days} days`,
    price_per_person: parseFloat(packageDetails.price_per_person || 0),
    extra_charge_per_km: parseFloat(packageDetails.extra_charge_per_km || 0),
    ac_available: packageDetails.ac_available,
    guide_included: packageDetails.guide_included,
    travels_name: packageDetails.travels_name,
    header_image: packageDetails.header_image,
    day_plans: packageDetails.day_plans || [],
    sub_category: packageDetails.sub_category,
    created_at: packageDetails.created_at,
    updated_at: packageDetails.updated_at,
  };
};

// ============ CRUD OPERATIONS ============

/**
 * Function to create a new category
 * @param {FormData} formData - Form data containing name and image
 * @returns {Promise} Promise that resolves to the created category
 */
export const createCategory = async (formData) => {
  return apiRequest(
    () => axiosInstance.post('/category/', formData),
    'Failed to create category.'
  );
};

/**
 * Function to update a category
 * @param {string|number} id - The ID of the category to update
 * @param {FormData} formData - Form data containing updated fields
 * @returns {Promise} Promise that resolves to the updated category
 */
export const updateCategory = async (id, formData) => {
  return apiRequest(
    () => axiosInstance.patch(`/category/${id}/`, formData),
    'Failed to update category.'
  );
};

/**
 * Function to delete a category
 * @param {string|number} id - The ID of the category to delete
 * @returns {Promise} Promise that resolves to the deletion result
 */
export const deleteCategory = async (id) => {
  return apiRequest(
    () => axiosInstance.delete(`/category/${id}/`),
    'Failed to delete category.'
  );
};

/**
 * Function to create a new subcategory
 * @param {FormData} formData - Form data containing name, image, and category
 * @returns {Promise} Promise that resolves to the created subcategory
 */
export const createSubCategory = async (formData) => {
  return apiRequest(
    () => axiosInstance.post('/sub-category/', formData),
    'Failed to create subcategory.'
  );
};

/**
 * Function to update a subcategory
 * @param {string|number} id - The ID of the subcategory to update
 * @param {FormData} formData - Form data containing updated fields
 * @returns {Promise} Promise that resolves to the updated subcategory
 */
export const updateSubCategory = async (id, formData) => {
  return apiRequest(
    () => axiosInstance.patch(`/sub-category/${id}/`, formData),
    'Failed to update subcategory.'
  );
};

/**
 * Function to delete a subcategory
 * @param {string|number} id - The ID of the subcategory to delete
 * @returns {Promise} Promise that resolves to the deletion result
 */
export const deleteSubCategory = async (id) => {
  return apiRequest(
    () => axiosInstance.delete(`/sub-category/${id}/`),
    'Failed to delete subcategory.'
  );
};
