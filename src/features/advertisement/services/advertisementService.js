import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

export const getAdvertisements = async () => {
  return apiRequest(
    () => axiosInstance.get('/sections/'),
    'Error occurred while fetching advertisements.'
  );
};

export const getExploreItems = async () => {
  return apiRequest(
    () => axiosInstance.get('/explore/list/'),
    'Error occurred while fetching explore items.'
  );
};

export const saveAdvertisement = async (data) => {
  const formData = new FormData();
  // Banner data
  formData.append('advertisements[0][title]', data.banner.title || '');
  formData.append(
    'advertisements[0][description]',
    data.banner.description || ''
  );
  if (data.banner.image) {
    formData.append('advertisements[0][image]', data.banner.image);
  }

  // Limited deals
  if (data.deals && data.deals.length > 0) {
    data.deals.forEach((deal, index) => {
      formData.append(`limited_deals[${index}][title]`, deal.title || '');
      formData.append(
        `limited_deals[${index}][description]`,
        deal.description || ''
      );
      if (deal.image) {
        formData.append(`limited_deals[${index}][images][0]`, deal.image);
      }
    });
  }

  // Footer sections
  if (data.footers && data.footers.length > 0) {
    data.footers.forEach((footer, index) => {
      formData.append(`footer_sections[${index}][title]`, footer.title || '');
      formData.append(
        `footer_sections[${index}][description]`,
        footer.description || ''
      );
      if (footer.image) {
        formData.append(`footer_sections[${index}][image]`, footer.image);
      }
    });
  }

  return apiRequest(
    () =>
      axiosInstance.post('/sections/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    'Error occurred while saving advertisement.'
  );
};

export const saveExploreItem = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('season_description', data.seasonDescription);

  if (data.image) {
    formData.append('image', data.image);
  }

  if (data.sights && data.sights.length > 0) {
    const experiences = data.sights.map((sight) => ({
      description: sight.description,
    }));

    formData.append('experiences', JSON.stringify(experiences));

    data.sights.forEach((sight, index) => {
      if (sight.image) {
        formData.append(`experience_images_${index}`, sight.image);
      }
    });
  }

  return apiRequest(
    () =>
      axiosInstance.post('/explore/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    'Error occurred while creating explore item.'
  );
};
