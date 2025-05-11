import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Function to get advertisements
export const getAdvertisements = async () => {
  return apiRequest(
    () =>
      axiosInstance.get(
        'https://keyroute.pythonanywhere.com/api/admin/sections/'
      ),
    'Error occurred while fetching advertisements.'
  );
};

// Function to save advertisement data
export const saveAdvertisement = async (data) => {
  // Create FormData object for file uploads
  const formData = new FormData();

  // Add advertisement data
  if (data.banner.image) {
    formData.append('advertisements[0][image]', data.banner.image);
  }
  formData.append('advertisements[0][description]', data.banner.description);

  // Add limited deals data
  if (data.deals && data.deals.length > 0) {
    data.deals.forEach((deal, index) => {
      formData.append(`limited_deals[${index}][title]`, deal.title);
      formData.append(`limited_deals[${index}][description]`, deal.description);
      if (deal.image) {
        formData.append(`limited_deals[${index}][images][0]`, deal.image);
      }
      if (deal.secondImage) {
        formData.append(`limited_deals[${index}][images][1]`, deal.secondImage);
      }
    });
  }

  // Add footer sections data
  if (data.footers && data.footers.length > 0) {
    data.footers.forEach((footer, index) => {
      formData.append(`footer_sections[${index}][title]`, footer.title);
      formData.append(
        `footer_sections[${index}][description]`,
        footer.description
      );
      if (footer.image) {
        formData.append(`footer_sections[${index}][image]`, footer.image);
      }
    });
  }

  return apiRequest(
    () =>
      axiosInstance.post(
        'https://keyroute.pythonanywhere.com/api/admin/sections/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ),
    'Error occurred while saving advertisement.'
  );
};

// Function to get explore items
export const getExploreItems = async () => {
  return apiRequest(
    () =>
      axiosInstance.get('https://keyroute.pythonanywhere.com/explore/list/'),
    'Error occurred while fetching explore items.'
  );
};

// Function to save explore item
export const saveExploreItem = async (data) => {
  // Create FormData object for file uploads
  const formData = new FormData();

  // Add main explore data
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('season_description', data.seasonDescription);

  // Add main image if available
  if (data.image) {
    formData.append('image', data.image);
  }

  // Add experiences (sights)
  if (data.sights && data.sights.length > 0) {
    // Create experiences array
    const experiences = data.sights.map((sight) => ({
      description: sight.description,
      // We'll handle the image upload separately
    }));

    formData.append('experiences', JSON.stringify(experiences));

    // Add experience images
    data.sights.forEach((sight, index) => {
      if (sight.image) {
        formData.append(`experience_images_${index}`, sight.image);
      }
    });
  }

  return apiRequest(
    () =>
      axiosInstance.post(
        'https://keyroute.pythonanywhere.com/api/admin/explore/create/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ),
    'Error occurred while creating explore item.'
  );
};
