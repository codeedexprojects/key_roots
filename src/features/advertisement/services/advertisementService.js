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

export const deleteExploreItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/explore/${id}/`);
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    }
    return { error: true, message: 'Failed to delete explore item' };
  } catch (error) {
    console.error(`Error deleting explore item with ID ${id}:`, error);
    return {
      error: true,
      message:
        error.response?.data?.message ||
        `Error occurred while deleting explore item with ID ${id}.`,
    };
  }
};

export const saveAdvertisement = async (data) => {
  const formData = new FormData();
  formData.append('advertisements[0][title]', data.banner.title || '');
  formData.append(
    'advertisements[0][description]',
    data.banner.description || ''
  );
  if (data.banner.image) {
    formData.append('advertisements[0][image]', data.banner.image);
  }

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

export const saveExploreItem = async (data, isEdit = false) => {
  const formData = new FormData();

  // SIGHT FIELDS
  formData.append('sight[title]', data.title || '');
  formData.append('sight[description]', data.description || '');
  formData.append(
    'sight[season_description]',
    data.seasonDescription || 'Default season description'
  );

  // MULTIPLE SIGHT IMAGES
  if (data.imagePreviews && data.imagePreviews.length > 0) {
    data.imagePreviews.forEach((preview, index) => {
      if (isEdit && preview.id) {
        formData.append(`sight_image[${index}][id]`, preview.id);
        if (data.images[index] instanceof File) {
          formData.append(`sight_image[${index}][file]`, data.images[index]);
        }
      } else if (data.images[index] instanceof File) {
        formData.append(`sight_image_${index + 1}`, data.images[index]);
      }
    });
  }

  // MULTIPLE SEASONS SUPPORT (up to 3 seasons)
  if (data.seasons && data.seasons.length > 0) {
    data.seasons.slice(0, 3).forEach((season, seasonIndex) => {
      const startMonth =
        season.seasonStartMonth && months.includes(season.seasonStartMonth)
          ? season.seasonStartMonth
          : 'Jan';
      const endMonth =
        season.seasonEndMonth && months.includes(season.seasonEndMonth)
          ? season.seasonEndMonth
          : 'Dec';
      const fromDate = `${new Date().getFullYear()}-${String(
        months.indexOf(startMonth) + 1
      ).padStart(2, '0')}-01`;
      const toDate = `${new Date().getFullYear()}-${String(
        months.indexOf(endMonth) + 1
      ).padStart(2, '0')}-28`;

      if (isEdit && season.id) {
        formData.append(`season[${seasonIndex}][id]`, season.id);
      }

      formData.append(`season[${seasonIndex}][from_date]`, fromDate);
      formData.append(`season[${seasonIndex}][to_date]`, toDate);
      formData.append(
        `season[${seasonIndex}][header]`,
        season.seasonHeading || ''
      );

      const tags =
        Array.isArray(season.seasonTags) && season.seasonTags.length > 0
          ? season.seasonTags
          : [
              {
                description: 'N/A',
                originalImage: null,
                isImageRemoved: false,
              },
              {
                description: 'N/A',
                originalImage: null,
                isImageRemoved: false,
              },
              {
                description: 'N/A',
                originalImage: null,
                isImageRemoved: false,
              },
            ];

      for (let tagIndex = 0; tagIndex < 3; tagIndex++) {
        const tag = tags[tagIndex] || {
          description: 'N/A',
          originalImage: null,
          isImageRemoved: false,
        };

        // Handle season tag images
        if (tag.image && tag.image instanceof File) {
          // New image uploaded
          formData.append(
            `season[${seasonIndex}][icon${tagIndex + 1}]`,
            tag.image
          );
        } else if (tag.isImageRemoved) {
          // Explicitly mark for removal
          formData.append(`season[${seasonIndex}][icon${tagIndex + 1}]`, '');
        }
        // If unchanged (tag.originalImage exists but no new image or removal), do not append iconX field

        formData.append(
          `season[${seasonIndex}][icon${tagIndex + 1}_description]`,
          tag.description || 'N/A'
        );
      }
    });
  } else {
    formData.append('season[0][from_date]', '2025-01-01');
    formData.append('season[0][to_date]', '2025-12-31');
    formData.append('season[0][header]', '');
    formData.append('season[0][icon1_description]', 'N/A');
    formData.append('season[0][icon2_description]', 'N/A');
    formData.append('season[0][icon3_description]', 'N/A');
  }

  // EXPERIENCES WITH MULTIPLE IMAGES
  (data.experiences || []).forEach((exp, index) => {
    if (isEdit && exp.id) {
      formData.append(`experiences[${index}][id]`, exp.id);
    }

    formData.append(
      `experiences[${index}][description]`,
      exp?.description || ''
    );
    formData.append(`experiences[${index}][header]`, exp?.header || '');
    formData.append(`experiences[${index}][sub_header]`, exp?.subHeader || '');

    if (exp.imagePreviews && exp.imagePreviews.length > 0) {
      exp.imagePreviews.forEach((preview, imgIndex) => {
        if (exp.images[imgIndex] instanceof File) {
          formData.append(
            `experiences[${index}][images][${imgIndex}]`,
            exp.images[imgIndex]
          );
        }
      });
    }
  });

  console.log('FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const endpoint = isEdit ? `/explore/${data.id}/` : `/explore/create/`;

  return await apiRequest(
    () =>
      axiosInstance[isEdit ? 'put' : 'post'](endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    'Error occurred while submitting explore item.'
  );
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// ===== ADVERTISEMENT API FUNCTIONS =====
export const getAdvertisementHeaders = async () => {
  return apiRequest(
    () => axiosInstance.get('/advertisement/'),
    'Error occurred while fetching advertisements.'
  );
};

export const getAdvertisementHeaderById = async (id) => {
  return apiRequest(
    () => axiosInstance.get(`/advertisement/${id}`),
    `Error occurred while fetching advertisement with ID ${id}.`
  );
};

export const saveAdvertisementHeader = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title || '');
  formData.append('subtitle', data.subtitle || '');
  formData.append('type', data.type || '');
  if (data.image) {
    formData.append('image', data.image);
  }

  return apiRequest(
    () =>
      axiosInstance.post('/create/advertisement/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    'Error occurred while creating advertisement.'
  );
};

export const deleteAdvertisementHeader = async (id) => {
  try {
    const response = await axiosInstance.delete(`/advertisement/${id}/`);
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    }
    return { error: true, message: 'Failed to delete advertisement' };
  } catch (error) {
    console.error(`Error deleting advertisement with ID ${id}:`, error);
    return {
      error: true,
      message:
        error.response?.data?.message ||
        `Error occurred while deleting advertisement with ID ${id}.`,
    };
  }
};

// ===== LIMITED DEALS API FUNCTIONS =====
export const getLimitedDeals = async () => {
  return apiRequest(
    () => axiosInstance.get('/limited-deals/'),
    'Error occurred while fetching limited deals.'
  );
};

export const getLimitedDealById = async (id) => {
  return apiRequest(
    () => axiosInstance.get(`/limited-deals/${id}`),
    `Error occurred while fetching limited deal with ID ${id}.`
  );
};

export const saveLimitedDeal = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title || '');
  formData.append('offer', data.offer || '');
  formData.append('terms_and_conditions', data.terms_and_conditions || '');
  formData.append('subtitle', data.subtitle || '');
  if (data.image) {
    formData.append('images', data.image);
  }

  return apiRequest(
    () =>
      axiosInstance.post('/create/limited-deal/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    'Error occurred while creating limited deal.'
  );
};

export const deleteLimitedDeal = async (id) => {
  try {
    const response = await axiosInstance.delete(`/limited-deals/${id}/`);
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    }
    return { error: true, message: 'Failed to delete limited deal' };
  } catch (error) {
    console.error(`Error deleting limited deal with ID ${id}:`, error);
    return {
      error: true,
      message:
        error.response?.data?.message ||
        `Error occurred while deleting limited deal with ID ${id}.`,
    };
  }
};

// ===== REFER & EARN API FUNCTIONS =====
export const getReferEarn = async () => {
  return apiRequest(
    () => axiosInstance.get('/refer-and-earn/'),
    'Error occurred while fetching refer & earn items.'
  );
};

export const getReferEarnById = async (id) => {
  return apiRequest(
    () => axiosInstance.get(`/refer-and-earn/${id}`),
    `Error occurred while fetching refer & earn item with ID ${id}.`
  );
};

export const saveReferEarn = async (data) => {
  const formData = new FormData();
  formData.append('price', data.price || '');
  if (data.image) {
    formData.append('image', data.image);
  }

  return apiRequest(
    () =>
      axiosInstance.post('/create/refer-and-earn/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    'Error occurred while creating refer & earn item.'
  );
};

export const updateReferEarn = async (id, data) => {
  const formData = new FormData();
  formData.append('price', data.price || '');
  if (data.image) {
    formData.append('image', data.image);
  }

  return apiRequest(
    () =>
      axiosInstance.patch(`/refer-and-earn/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    'Error occurred while updating refer & earn item.'
  );
};

export const deleteReferEarn = async (id) => {
  try {
    const response = await axiosInstance.delete(`/refer-and-earn/${id}/`);
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    }
    return { error: true, message: 'Failed to delete refer & earn item' };
  } catch (error) {
    console.error(`Error deleting refer & earn item with ID ${id}:`, error);
    return {
      error: true,
      message:
        error.response?.data?.message ||
        `Error occurred while deleting refer & earn item with ID ${id}.`,
    };
  }
};

// ===== FOOTER SECTION API FUNCTIONS =====
export const getFooterSections = async () => {
  return apiRequest(
    () => axiosInstance.get('/footer-sections/'),
    'Error occurred while fetching footer sections.'
  );
};

export const getFooterSectionById = async (id) => {
  return apiRequest(
    () => axiosInstance.get(`/footer-sections/${id}`),
    `Error occurred while fetching footer section with ID ${id}.`
  );
};

export const saveFooterSection = async (data) => {
  const formData = new FormData();
  formData.append('package', data.package || '');
  if (data.mainImage) {
    formData.append('main_image', data.mainImage);
  }
  if (data.extraImages.length > 0) {
    formData.append('image1', data.extraImages[0]);
  }
  if (data.extraImages.length > 1) {
    formData.append('image2', data.extraImages[1]);
  }

  return apiRequest(
    () =>
      axiosInstance.post('/create/footer-section/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    'Error occurred while creating footer section.'
  );
};

export const deleteFooterSection = async (id) => {
  try {
    const response = await axiosInstance.delete(`/footer-sections/${id}/`);
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    }
    return { error: true, message: 'Failed to delete footer section' };
  } catch (error) {
    console.error(`Error deleting footer section with ID ${id}:`, error);
    return {
      error: true,
      message:
        error.response?.data?.message ||
        `Error occurred while deleting footer section with ID ${id}.`,
    };
  }
};
