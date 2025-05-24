import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';
import axios from 'axios';

export const getAdvertisements = async () => {
  return apiRequest(
    () => axiosInstance.get('/sections/'),
    'Error occurred while fetching advertisements.'
  );
};

export const getExploreItems = async () => {
  return apiRequest(
    () =>
      axios.get('https://api.keyrouteexpedo.com/api/admin/explore/list/', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYwNTk0OTA1LCJpYXQiOjE3NDc2MzQ5MDUsImp0aSI6IjhlNGEwYjY1ZWI0YTQwMGY4MzcwNDIzODQxODllNmQxIiwidXNlcl9pZCI6MX0.i4Fgo2JSHkT49irVEJrRQ8FOTQ9E_2rs2WmKeU8PW-k',
        },
      }),
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
  
  // Helper function to format date properly
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse and format the date
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return '';
    }
  };
  
  // 1. Sight data - match backend field expectations
  formData.append('sight[title]', data.title || '');
  formData.append('sight[description]', data.description || '');
  formData.append('sight[season_description]', data.seasonDescription || '');
  
  // FIXED: Handle main explore images properly - backend expects sight_image_1, sight_image_2, etc.
  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    // Handle multiple main images with correct field names
    data.images.forEach((imageObj, index) => {
      if (imageObj && imageObj.file && imageObj.file instanceof File) {
        // New file being uploaded - use 1-based indexing for backend
        formData.append(`sight_image_${index + 1}`, imageObj.file);
      }
    });
  } else if (data.image && data.image instanceof File) {
    // Backward compatibility for single image
    formData.append('sight_image_1', data.image);
  }
  
  // 2. Experience data - Handle multiple images per experience
  if (data.sights && data.sights.length > 0) {
    data.sights.forEach((sight, expIndex) => {
      formData.append(`experiences[${expIndex}][description]`, sight.description || '');
      formData.append(`experiences[${expIndex}][header]`, sight.header || '');
      formData.append(`experiences[${expIndex}][sub_header]`, sight.sub_header || '');
      
      // Handle multiple images for each experience
      if (sight.images && Array.isArray(sight.images)) {
        // Multiple images case - check for file property in image objects
        sight.images.forEach((imageObj, imageIndex) => {
          if (imageObj && imageObj.file && imageObj.file instanceof File) {
            formData.append(`experiences[${expIndex}][images][${imageIndex}]`, imageObj.file);
          }
        });
      } else if (sight.image && sight.image instanceof File) {
        // Single image case (backward compatibility)
        formData.append(`experiences[${expIndex}][images][0]`, sight.image);
      }
    });
  }
  
  // 3. Handle Multiple Seasons
  if (data.seasons && data.seasons.length > 0) {
    // For backward compatibility, if backend expects single season format,
    // send the first season as the main season
    const mainSeason = data.seasons[0];
    
    // Format dates properly
    const fromDate = formatDate(mainSeason.from_date);
    const toDate = formatDate(mainSeason.to_date);
    
    formData.append('season[from_date]', fromDate);
    formData.append('season[to_date]', toDate);
    formData.append('season[header]', mainSeason.header || '');
    
    // Handle season icons for the main season
    if (mainSeason.icons && mainSeason.icons.length > 0) {
      mainSeason.icons.forEach((icon, index) => {
        const iconNum = index + 1;
        
        // Add icon description
        formData.append(`season[icon${iconNum}_description]`, icon.description || '');
        
        // Add icon file if present
        if (icon.file && icon.file instanceof File) {
          formData.append(`season[icon${iconNum}]`, icon.file);
        }
      });
      
      // Fill remaining slots with empty descriptions if less than 3 icons
      for (let i = mainSeason.icons.length + 1; i <= 3; i++) {
        formData.append(`season[icon${i}_description]`, '');
      }
    } else {
      // If no icons provided, send empty descriptions
      formData.append('season[icon1_description]', '');
      formData.append('season[icon2_description]', '');
      formData.append('season[icon3_description]', '');
    }
    
    // OPTIONAL: If your backend supports multiple seasons, uncomment this section
    /*
    data.seasons.forEach((season, seasonIndex) => {
      const fromDate = formatDate(season.from_date);
      const toDate = formatDate(season.to_date);
      
      formData.append(`seasons[${seasonIndex}][from_date]`, fromDate);
      formData.append(`seasons[${seasonIndex}][to_date]`, toDate);
      formData.append(`seasons[${seasonIndex}][header]`, season.header || '');
      
      if (season.icons && season.icons.length > 0) {
        season.icons.forEach((icon, iconIndex) => {
          formData.append(`seasons[${seasonIndex}][icons][${iconIndex}][description]`, icon.description || '');
          
          if (icon.file && icon.file instanceof File) {
            formData.append(`seasons[${seasonIndex}][icons][${iconIndex}][image]`, icon.file);
          }
        });
      }
    });
    */
    
  } else {
    // Handle legacy single season format (backward compatibility)
    if (data.season) {
      const fromDate = formatDate(data.season.from_date);
      const toDate = formatDate(data.season.to_date);
      
      formData.append('season[from_date]', fromDate);
      formData.append('season[to_date]', toDate);
      formData.append('season[header]', data.season.header || '');
      
      if (data.season.icons && data.season.icons.length > 0) {
        data.season.icons.forEach((icon, index) => {
          const iconNum = index + 1;
          formData.append(`season[icon${iconNum}_description]`, icon.description || '');
          
          if (icon.file && icon.file instanceof File) {
            formData.append(`season[icon${iconNum}]`, icon.file);
          }
        });
        
        for (let i = data.season.icons.length + 1; i <= 3; i++) {
          formData.append(`season[icon${i}_description]`, '');
        }
      } else {
        formData.append('season[icon1_description]', '');
        formData.append('season[icon2_description]', '');
        formData.append('season[icon3_description]', '');
      }
    } else {
      // No season data provided
      formData.append('season[from_date]', '');
      formData.append('season[to_date]', '');
      formData.append('season[header]', '');
      formData.append('season[icon1_description]', '');
      formData.append('season[icon2_description]', '');
      formData.append('season[icon3_description]', '');
    }
  }
  
  // Debug logging
  console.log('Sending to backend:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: [File Object - ${value.name}, ${value.size} bytes]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  
  // Validate required fields
  const title = formData.get('sight[title]');
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }
  
  // Choose endpoint based on whether this is an edit or create operation
  if (data.id) {
    return apiRequest(
      () =>
        axiosInstance.patch(`/explore/${data.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      'Error occurred while updating explore item.'
    );
  } else {
    return apiRequest(
      () =>
        axiosInstance.post('/explore/create/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      'Error occurred while creating explore item.'
    );
  }
};

export const deleteExploreItem = async (id) => {
  if (!id) {
    console.error('No ID provided for deletion');
    return { error: true, message: 'No ID provided for deletion' };
  }

  try {
    console.log(`Deleting explore item with ID: ${id}`);
    
    const response = await apiRequest(
      () => axiosInstance.delete(`/explore/${id}/`),
      'Error occurred while deleting explore item.'
    );
    
    return response;
  } catch (error) {
    console.error('Error in deleteExploreItem:', error);
    return { 
      error: true, 
      message: error.message || 'Failed to delete explore item' 
    };
  }
};