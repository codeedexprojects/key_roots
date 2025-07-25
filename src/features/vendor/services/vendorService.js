import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Function to get all vendors
export const getAllVendors = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page, ...filters });
  return apiRequest(
    () => axiosInstance.get(`/vendors/pagination/?${params}`),
    'Error occurred while fetching vendors.'
  );
};

// Function to get vendor count
export const getVendorCount = async () => {
  return apiRequest(
    () => axiosInstance.get('/vendor/count/'),
    'Error occurred while fetching vendor count.'
  );
};

// Function to get vendor details by ID
export const getVendorById = async (vendorId) => {
  return apiRequest(
    () => axiosInstance.get(`/vendors/${vendorId}/`),
    `Error occurred while fetching vendor with ID ${vendorId}.`
  );
};

// Function to get buses for a specific vendor
export const getVendorBuses = async (vendorId) => {
  return apiRequest(
    () => axiosInstance.get(`/vendors/${vendorId}/buses/`),
    `Error occurred while fetching buses for vendor with ID ${vendorId}.`
  );
};



// Function to get packages for a specific vendor
export const getVendorPackages = async (vendorId) => {
  return apiRequest(
    () => axiosInstance.get(`/vendor/${vendorId}/packages/`),
    `Error occurred while fetching packages for vendor with ID ${vendorId}.`
  );
};

// Function to get details of a specific bus
export const getBusDetails = async (busId) => {
  return apiRequest(
    () => axiosInstance.get(`/bus/${busId}/`),
    `Error occurred while fetching bus details for ID ${busId}.`
  );
};

// Function to get details of a specific package
export const getPackageDetails = async (packageId) => {
  return apiRequest(
    () => axiosInstance.get(`/vendor/package/${packageId}/`),
    `Error occurred while fetching package details for ID ${packageId}.`
  );
};

export const createPackage = async (packageData) => {
  return apiRequest(
    () => axiosInstance.post('/create-package/', packageData),
    'Error occurred while creating the package.'
  );
};

export const addDayPlans = async (packageData,id) => {
  return apiRequest(
    () => axiosInstance.post(`/packages/${id}/add-day/`, packageData),
    'Error occurred while creating the package.'
  );
};


export const editPackage = async (packageId, packageData) => {
  return apiRequest(
    () => axiosInstance.patch(`/${packageId}/edit-package/`, packageData),
    `Error occurred while editing the package with ID ${packageId}.`
  );
};


export const getAllCategories = async () => {
  return apiRequest(
    () => axiosInstance.get('/categories/'),
    'Error occurred while fetching categories.'
  );
};
export const getSubCategoriesByCategoryId = async (categoryId) => {
  return apiRequest(
    () => axiosInstance.get(`/sub-category/?category_id=${categoryId}`),
    `Error occurred while fetching sub-categories for category ID ${categoryId}.`
  );
};


export const editPackageDay = async (packageId,day_number, packageData) => {
  return apiRequest(
    () => axiosInstance.patch(`/packages/${packageId}/day/${day_number}/edit/`, packageData),
    `Error occurred while editing the package with ID ${packageId}.`
  );
};


export const deleteDayImage = async (image_type,image_id) => {
  return apiRequest(
    () => axiosInstance.delete(`/images/${image_type}/${image_id}/`),
    `Error occurred while editing the package with ID `
  );
};

export const addDayImage = async (image_type,object_id,packageData) => {
  return apiRequest(
    () => axiosInstance.post(`/images/${image_type}/${object_id}/`, packageData),
    'Error occurred while creating the package.'
  );
};



export const transformSubCategoryData = (subcategories) => {
  if (!Array.isArray(subcategories)) return [];

  return subcategories.map((subCategory) => ({
    id: subCategory.id,
    name: subCategory.name,
    title: subCategory.name,
    image: subCategory.image,
    category: subCategory.category,
  }));
};
// Function to create a new vendor
export const createVendor = async (vendorData) => {
  return apiRequest(
    () => axiosInstance.post('/create-vendor/', vendorData),
    'Error occurred while creating vendor.'
  );
};

// Function to get all amenities
export const getAllAmenities = async () => {
  return apiRequest(
    () => axiosInstance.get('/amenities/'),
    'Error occurred while fetching amenities.'
  );
};

// Function to add the bus
export const addBusToVendor = async (vendorId, busData) => {
  // Add vendor_id to the FormData
  busData.append('vendor_id', vendorId);

  return apiRequest(
    () =>
      axiosInstance.post('/create-bus/', busData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    'Error occurred while adding bus to vendor.'
  );
};

// Function to edit bus details by ID
export const editBusById = async (busId, busData) => {
  return apiRequest(
    () =>
      axiosInstance.patch(`/${busId}/edit-bus/`, busData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    'Error occurred while editing the bus.'
  );
};

