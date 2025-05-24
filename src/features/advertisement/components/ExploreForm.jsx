import { getImageUrl } from '@/lib/getImageUrl';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, ArrowLeft, Edit2, Calendar, Image as ImageIcon } from 'lucide-react';

export const ExploreForm = ({ item, onSave, onCancel, onDelete, isLoading }) => {
  const [formData, setFormData] = useState({
    id: null,
    images: [], // Changed from single image to array of images
    title: '',
    description: '',
    seasonDescription: '',
    seasons: [], 
    sights: [],
  });

  const createEmptySeasonIcon = () => ({
    file: null,
    preview: null,
    description: ''
  });

  const createEmptySeason = () => ({
    id: null,
    from_date: '',
    to_date: '',
    header: '',
    icons: [
      createEmptySeasonIcon(),
      createEmptySeasonIcon(),
      createEmptySeasonIcon()
    ]
  });

// Update the useEffect section where sights are processed
useEffect(() => {
  if (item) {
    // Helper function to normalize seasons
    const normalizeSeasons = (itemData) => {
      // Handle legacy single season format
      if (itemData.season && !itemData.seasons) {
        return [normalizeSeasonData(itemData.season)];
      }
      
      // Handle multiple seasons format
      if (itemData.seasons && Array.isArray(itemData.seasons)) {
        return itemData.seasons.map(season => normalizeSeasonData(season));
      }
      
      // Default empty season
      return [createEmptySeason()];
    };

    // Helper function to normalize season data
    const normalizeSeasonData = (seasonData) => {
      let normalizedIcons = [];

      // Handle array format (icons)
      if (seasonData?.icons && Array.isArray(seasonData.icons)) {
        normalizedIcons = seasonData.icons.map(icon => ({
          file: null,
          preview: icon.image || icon.preview || null,
          description: icon.description || ''
        }));
      } 
      // Handle backend format (icon1, icon2, icon3)
      else if (seasonData) {
        // Process icon1, icon2, icon3 format from backend
        for (let i = 1; i <= 3; i++) {
          const iconKey = `icon${i}`;
          const descriptionKey = `icon${i}_description`;
          
          if (seasonData[iconKey] || seasonData[descriptionKey]) {
            normalizedIcons.push({
              file: null,
              preview: seasonData[iconKey] || null,
              description: seasonData[descriptionKey] || ''
            });
          }
        }
      }

      // Ensure we always have exactly 3 icon slots
      while (normalizedIcons.length < 3) {
        normalizedIcons.push(createEmptySeasonIcon());
      }

      return {
        id: seasonData?.id || null,
        from_date: seasonData?.from_date || '',
        to_date: seasonData?.to_date || '',
        header: seasonData?.header || '',
        icons: normalizedIcons.slice(0, 3)
      };
    };

    // Normalize main images - handle both single image and array
    const normalizeMainImages = (itemData) => {
      if (itemData.images && Array.isArray(itemData.images)) {
        return itemData.images.map(img => ({
          file: null,
          preview: img,
          id: null
        }));
      } else if (itemData.image) {
        return [{
          file: null,
          preview: itemData.image,
          id: null
        }];
      }
      return [];
    };

    setFormData({
      id: item.id,
      images: normalizeMainImages(item),
      title: item.title || '',
      description: item.description || '',
      seasonDescription: item.season_description || item.seasonDescription || '',
      seasons: normalizeSeasons(item),
      // FIXED: Handle both API field names and normalize sight images properly
      sights: item.sights?.map((sight) => ({
        id: sight.id || null,
        images: sight.images?.map(img => ({
          file: null,
          preview: typeof img === 'string' ? img : img.image || img,
          id: null
        })) || [],
        header: sight.header || '',
        sub_header: sight.sub_header || sight.subHeader || '', // Handle both field names
        description: sight.description || ''
      })) || [],
    });
  } else {
    // Initialize with one empty season for new items
    setFormData(prev => ({
      ...prev,
      seasons: [createEmptySeason()]
    }));
  }
}, [item]);

  // Main image management functions
  const handleMainImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [];
      let processed = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file: file,
            preview: reader.result,
            id: null
          });
          processed++;
          
          if (processed === files.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMainImage = (imageIndex) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Season management functions
  const addSeason = () => {
    setFormData({
      ...formData,
      seasons: [...formData.seasons, createEmptySeason()]
    });
  };

  const removeSeason = (seasonIndex) => {
    const updatedSeasons = [...formData.seasons];
    updatedSeasons.splice(seasonIndex, 1);
    setFormData({
      ...formData,
      seasons: updatedSeasons.length > 0 ? updatedSeasons : [createEmptySeason()]
    });
  };

  const handleSeasonChange = (seasonIndex, e) => {
    const { name, value } = e.target;
    const updatedSeasons = [...formData.seasons];
    updatedSeasons[seasonIndex] = {
      ...updatedSeasons[seasonIndex],
      [name]: value,
    };
    setFormData({
      ...formData,
      seasons: updatedSeasons,
    });
  };

  const handleSeasonIconChange = (seasonIndex, iconIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedSeasons = [...formData.seasons];
        const updatedIcons = [...updatedSeasons[seasonIndex].icons];
        updatedIcons[iconIndex] = {
          ...updatedIcons[iconIndex],
          file: file,
          preview: reader.result,
        };
        updatedSeasons[seasonIndex] = {
          ...updatedSeasons[seasonIndex],
          icons: updatedIcons,
        };
        setFormData({
          ...formData,
          seasons: updatedSeasons,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSeasonIconDescriptionChange = (seasonIndex, iconIndex, value) => {
    const updatedSeasons = [...formData.seasons];
    const updatedIcons = [...updatedSeasons[seasonIndex].icons];
    updatedIcons[iconIndex] = {
      ...updatedIcons[iconIndex],
      description: value,
    };
    updatedSeasons[seasonIndex] = {
      ...updatedSeasons[seasonIndex],
      icons: updatedIcons,
    };
    setFormData({
      ...formData,
      seasons: updatedSeasons,
    });
  };

  const addSeasonIcon = (seasonIndex) => {
    const updatedSeasons = [...formData.seasons];
    if (updatedSeasons[seasonIndex].icons.length < 6) {
      updatedSeasons[seasonIndex].icons.push(createEmptySeasonIcon());
      setFormData({
        ...formData,
        seasons: updatedSeasons,
      });
    }
  };

  const removeSeasonIcon = (seasonIndex, iconIndex) => {
    const updatedSeasons = [...formData.seasons];
    updatedSeasons[seasonIndex].icons.splice(iconIndex, 1);
    if (updatedSeasons[seasonIndex].icons.length === 0) {
      updatedSeasons[seasonIndex].icons.push(createEmptySeasonIcon());
    }
    setFormData({
      ...formData,
      seasons: updatedSeasons,
    });
  };

  // Sight image management functions
  const handleSightImageChange = (sightIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [];
      let processed = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file: file,
            preview: reader.result,
            id: null
          });
          processed++;
          
          if (processed === files.length) {
            const updatedSights = [...formData.sights];
            updatedSights[sightIndex] = {
              ...updatedSights[sightIndex],
              images: [...(updatedSights[sightIndex].images || []), ...newImages]
            };
            setFormData({
              ...formData,
              sights: updatedSights,
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeSightImage = (sightIndex, imageIndex) => {
    const updatedSights = [...formData.sights];
    updatedSights[sightIndex].images = updatedSights[sightIndex].images.filter((_, index) => index !== imageIndex);
    setFormData({
      ...formData,
      sights: updatedSights,
    });
  };

  const handleSightChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSights = [...formData.sights];
    updatedSights[index] = {
      ...updatedSights[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      sights: updatedSights,
    });
  };

  const addSight = () => {
    setFormData({
      ...formData,
      sights: [
        ...formData.sights,
        { 
          images: [],
          header: '',
          sub_header: '',
          description: '' 
        },
      ],
    });
  };

  const removeSight = (index) => {
    const updatedSights = [...formData.sights];
    updatedSights.splice(index, 1);
    setFormData({
      ...formData,
      sights: updatedSights,
    });
  };
// Helper function to safely get image URL
const getSafeImageUrl = (image) => {
  if (!image) return null;
  
  // If it's already a data URL or blob URL, return as is
  if (typeof image === 'string' && (image.startsWith('data:') || image.startsWith('blob:'))) {
    return image;
  }
  
  // If it's a string path, use getImageUrl
  if (typeof image === 'string') {
    return getImageUrl(image);
  }
  
  // If it's an object with image property
  if (typeof image === 'object' && image.image) {
    return getImageUrl(image.image);
  }
  
  return null;
};

// Update all image src attributes to use this safe function
// Replace lines like:
// src={getImageUrl(image.preview) || '/placeholder.svg'}
// with:
// src={getSafeImageUrl(image.preview) || '/placeholder.svg'}
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <button
            type='button'
            onClick={onCancel}
            className='inline-flex items-center text-gray-600 hover:text-gray-900 mr-4'>
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back
          </button>
          <h2 className='text-lg font-semibold'>
            {item ? 'Edit Explore Item' : 'Add New Explore Item'}
          </h2>
        </div>
        
        {item && item.id && onDelete && (
          <button
            type='button'
            onClick={handleDelete}
            disabled={isLoading}
            className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            <Trash2 className='h-4 w-4 mr-2' />
            Delete Item
          </button>
        )}
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        {/* Basic Information Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* Main Images Section */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Explore Images
            </label>
            
            <div className='grid grid-cols-2 gap-3 mb-3'>
              {formData.images.map((image, index) => (
                <div key={index} className='relative group'>
                  <div className='border-2 border-gray-300 rounded-lg p-2 h-32 flex items-center justify-center'>
                  <img
  src={getSafeImageUrl(image.preview) || '/placeholder.svg'}
  alt={`Main image ${index + 1}`}
  className='max-h-full max-w-full object-contain'
/>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeMainImage(index)}
                    className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                    ×
                  </button>
                </div>
              ))}
              
              {/* Add Image Button */}
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors relative group'
                onClick={() => document.getElementById('main-images').click()}>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-8 h-8 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors'>
                    <Plus className='h-5 w-5 text-white' />
                  </div>
                </div>
              </div>
            </div>
            
            <input
              type='file'
              id='main-images'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleMainImageChange}
            />
          </div>

          <div className='space-y-4'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
                Ad Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            <div>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
                Ad Description
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>

            <div>
              <label htmlFor='seasonDescription' className='block text-sm font-medium text-gray-700 mb-1'>
                Ad Season Description
              </label>
              <textarea
                id='seasonDescription'
                name='seasonDescription'
                value={formData.seasonDescription}
                onChange={handleInputChange}
                rows={2}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              />
            </div>
          </div>
        </div>

        {/* Multiple Seasons Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center'>
              <h3 className='font-semibold text-gray-900'>Perfect seasons to go</h3>
              <Edit2 className='h-4 w-4 ml-2 text-gray-400' />
            </div>
            <button
              type='button'
              onClick={addSeason}
              className='inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
              <Plus className='h-4 w-4 mr-2' />
              Add Season
            </button>
          </div>

          <div className='space-y-6'>
            {formData.seasons.map((season, seasonIndex) => (
              <div key={seasonIndex} className='border border-gray-200 rounded-lg p-6 relative'>
                {/* Season Header */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center'>
                    <Calendar className='h-5 w-5 text-green-600 mr-2' />
                    <h4 className='font-medium text-gray-900'>
                      Season {seasonIndex + 1}
                      {season.header && ` - ${season.header}`}
                    </h4>
                  </div>
                  
                  {formData.seasons.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeSeason(seasonIndex)}
                      className='text-red-500 hover:text-red-700 p-1'>
                      <Trash2 className='h-4 w-4' />
                    </button>
                  )}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Left Column - Season Details */}
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs text-gray-600 mb-1'>From Date</label>
                        <input
                          type='date'
                          name='from_date'
                          value={season.from_date}
                          onChange={(e) => handleSeasonChange(seasonIndex, e)}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                        />
                      </div>
                      <div>
                        <label className='block text-xs text-gray-600 mb-1'>To Date</label>
                        <input
                          type='date'
                          name='to_date'
                          value={season.to_date}
                          onChange={(e) => handleSeasonChange(seasonIndex, e)}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-xs text-gray-600 mb-1'>Season Header</label>
                      <input
                        type='text'
                        name='header'
                        placeholder='Add season heading'
                        value={season.header}
                        onChange={(e) => handleSeasonChange(seasonIndex, e)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                      />
                    </div>
                  </div>

                  {/* Right Column - Season Icons */}
                  <div>
                    <div className='flex items-center justify-between mb-3'>
                      <label className='block text-xs text-gray-600'>Season Icons</label>
                      <button
                        type='button'
                        onClick={() => addSeasonIcon(seasonIndex)}
                        disabled={season.icons.length >= 6}
                        className='inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'>
                        <ImageIcon className='h-3 w-3 mr-1' />
                        Add Icon
                      </button>
                    </div>

                    <div className='grid grid-cols-3 gap-3'>
                      {season.icons.map((icon, iconIndex) => (
                        <div key={iconIndex} className='space-y-2'>
                          <div className='relative'>
                            <div
                              className='w-full h-16 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-primary transition-colors'
                              onClick={() => document.getElementById(`season-${seasonIndex}-icon-${iconIndex}`).click()}>
                             {icon.preview ? (
  <img
    src={getSafeImageUrl(icon.preview)}
    alt={`Season ${seasonIndex + 1} icon ${iconIndex + 1}`}
    className='w-full h-full object-cover rounded-md'
  />
) : (
  <ImageIcon className='h-6 w-6 text-gray-400' />
)}
                            </div>
                            
                            {season.icons.length > 1 && (
                              <button
                                type='button'
                                onClick={() => removeSeasonIcon(seasonIndex, iconIndex)}
                                className='absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600'>
                                ×
                              </button>
                            )}
                          </div>
                          
                          <input
                            type='file'
                            id={`season-${seasonIndex}-icon-${iconIndex}`}
                            accept='image/*'
                            className='hidden'
                            onChange={(e) => handleSeasonIconChange(seasonIndex, iconIndex, e)}
                          />
                          
                          <input
                            type='text'
                            placeholder='Description'
                            value={icon.description || ''}
                            onChange={(e) => handleSeasonIconDescriptionChange(seasonIndex, iconIndex, e.target.value)}
                            className='w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sights Section with Multiple Images */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-semibold text-gray-900'>
              Sights and experience
            </h3>
            <button
              type='button'
              onClick={addSight}
              className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
              <Plus className='h-4 w-4 mr-1' />
              Add More
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {formData.sights.map((sight, index) => (
              <div key={index} className='border border-gray-200 rounded-lg p-4 relative'>
                <button
                  type='button'
                  onClick={() => removeSight(index)}
                  className='absolute top-2 right-2 text-red-500 hover:text-red-700 z-10'>
                  <Trash2 className='h-4 w-4' />
                </button>

                {/* Multiple Images for Sight */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Images
                  </label>
                  
                  <div className='grid grid-cols-2 gap-2 mb-2'>
                    {sight.images?.map((image, imgIndex) => (
                      <div key={imgIndex} className='relative group'>
                        <div className='border border-gray-300 rounded-lg p-1 h-20 flex items-center justify-center'>
                        <img
  src={getSafeImageUrl(image.preview) || '/placeholder.svg'}
  alt={`Sight ${index + 1} image ${imgIndex + 1}`}
  className='max-h-full max-w-full object-contain'
/>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeSightImage(index, imgIndex)}
                          className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {/* Add Image Button for Sight */}
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors relative group'
                      onClick={() => document.getElementById(`sight-images-${index}`).click()}>
                      <div className='w-6 h-6 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors'>
                        <Plus className='h-4 w-4 text-white' />
                      </div>
                    </div>
                  </div>
                  
                  <input
                    type='file'
                    id={`sight-images-${index}`}
                    accept='image/*'
                    multiple
                    className='hidden'
                    onChange={(e) => handleSightImageChange(index, e)}
                  />
                </div>

                <div className='space-y-3'>
                  <div>
                    <label
                      htmlFor={`sight-header-${index}`}
                      className='block text-sm font-medium text-gray-700 mb-1'>
                      Header
                    </label>
                    <input
                      type='text'
                      id={`sight-header-${index}`}
                      name='header'
                      value={sight.header}
                      onChange={(e) => handleSightChange(index, e)}
                      placeholder='Enter header'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`sight-subheader-${index}`}
                      className='block text-sm font-medium text-gray-700 mb-1'>
                      Sub Header
                    </label>
                    <input
                      type='text'
                      id={`sight-subheader-${index}`}
                      name='sub_header'
                      value={sight.sub_header}
                      onChange={(e) => handleSightChange(index, e)}
                      placeholder='Enter sub header'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`sight-description-${index}`}
                      className='block text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      id={`sight-description-${index}`}
                      name='description'
                      value={sight.description}
                      onChange={(e) => handleSightChange(index, e)}
                      rows={2}
                      placeholder='Enter description'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.sights.length === 0 && (
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary transition-colors'
                onClick={addSight}>
                <Plus className='h-8 w-8 text-gray-400 mb-1' />
                <p className='text-sm text-gray-500'>Add sight</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={onCancel}
          className='px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-3'>
          Cancel
        </button>
        <button
          type='submit'
          disabled={isLoading}
          className='px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};