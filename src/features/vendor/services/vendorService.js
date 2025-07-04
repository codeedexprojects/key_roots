import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Function to get all vendors
export const getAllVendors = async () => {
  return apiRequest(
    () => axiosInstance.get('/vendors/list/'),
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

// Function to create a new vendor
export const createVendor = async (vendorData) => {
  return apiRequest(
    () => axiosInstance.post('/create-vendor/', vendorData),
    'Error occurred while creating vendor.'
  );
};
