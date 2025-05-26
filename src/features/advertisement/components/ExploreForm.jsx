'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Upload, ArrowLeft, X } from 'lucide-react';
import { SeasonTagInput } from '../components/SeasonTagInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/getImageUrl';
import { Plus } from 'lucide-react';

export const ExploreForm = ({ item, onSave, onCancel, isLoading }) => {
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

  console.log(item);

  const [formData, setFormData] = useState({
    id: null,
    images: [],
    imagePreviews: [],
    title: '',
    description: '',
    seasonDescription: '',
    seasons: [
      {
        seasonStartMonth: 'Jan',
        seasonEndMonth: 'May',
        seasonHeading: '',
        seasonTags: [
          { description: '', image: null, imagePreview: null },
          { description: '', image: null, imagePreview: null },
          { description: '', image: null, imagePreview: null },
        ],
      },
    ],
    experiences: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        images: [],
        imagePreviews: Array.isArray(item.images)
          ? item.images
          : item.image
          ? [item.image]
          : [],
        title: item.title || '',
        description: item.description || '',
        seasonDescription: item.seasonDescription || '',
        seasons:
          item.seasons?.length > 0
            ? item.seasons.slice(0, 3).map((season) => ({
                seasonStartMonth: season.seasonStartMonth || 'Jan',
                seasonEndMonth: season.seasonEndMonth || 'May',
                seasonHeading: season.seasonHeading || '',
                seasonTags: [
                  ...season.seasonTags.map((tag) => ({
                    image: null,
                    imagePreview: tag.image || null,
                    description: tag.description || '',
                  })),
                  ...Array(Math.max(0, 3 - season.seasonTags.length)).fill({
                    description: '',
                    image: null,
                    imagePreview: null,
                  }),
                ].slice(0, 3),
              }))
            : [
                {
                  seasonStartMonth: 'Jan',
                  seasonEndMonth: 'May',
                  seasonHeading: '',
                  seasonTags: [
                    { description: '', image: null, imagePreview: null },
                    { description: '', image: null, imagePreview: null },
                    { description: '', image: null, imagePreview: null },
                  ],
                },
              ],
        experiences:
          item.experiences?.map((exp) => ({
            description: exp.description || '',
            header: exp.header || '',
            subHeader: exp.subHeader || '',
            images: [],
            imagePreviews: Array.isArray(exp.images)
              ? exp.images
              : exp.image
              ? [exp.image]
              : [],
          })) || [],
      });
    } else {
      setFormData({
        id: null,
        images: [],
        imagePreviews: [],
        title: '',
        description: '',
        seasonDescription: '',
        seasons: [
          {
            seasonStartMonth: 'Jan',
            seasonEndMonth: 'May',
            seasonHeading: '',
            seasonTags: [
              { description: '', image: null, imagePreview: null },
              { description: '', image: null, imagePreview: null },
              { description: '', image: null, imagePreview: null },
            ],
          },
        ],
        experiences: [],
      });
    }
  }, [item]);

  const handleMainImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const newImages = [...formData.images, ...files];
        const newPreviews = [...formData.imagePreviews];

        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result);
            setFormData((prev) => ({
              ...prev,
              images: newImages,
              imagePreviews: [...newPreviews],
            }));
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [formData.images, formData.imagePreviews]
  );

  const removeMainImage = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleExperienceImageChange = useCallback((expIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => {
        const updatedExperiences = [...prev.experiences];
        const currentImages = updatedExperiences[expIndex].images || [];
        const currentPreviews =
          updatedExperiences[expIndex].imagePreviews || [];

        const newImages = [...currentImages, ...files];
        const newPreviews = [...currentPreviews];

        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result);
            setFormData((prevState) => {
              const updatedExp = [...prevState.experiences];
              updatedExp[expIndex] = {
                ...updatedExp[expIndex],
                images: newImages,
                imagePreviews: [...newPreviews],
              };
              return {
                ...prevState,
                experiences: updatedExp,
              };
            });
          };
          reader.readAsDataURL(file);
        });

        updatedExperiences[expIndex] = {
          ...updatedExperiences[expIndex],
          images: newImages,
        };

        return {
          ...prev,
          experiences: updatedExperiences,
        };
      });
    }
  }, []);

  const removeExperienceImage = useCallback((expIndex, imgIndex) => {
    setFormData((prev) => {
      const updatedExperiences = [...prev.experiences];
      updatedExperiences[expIndex] = {
        ...updatedExperiences[expIndex],
        images: updatedExperiences[expIndex].images.filter(
          (_, i) => i !== imgIndex
        ),
        imagePreviews: updatedExperiences[expIndex].imagePreviews.filter(
          (_, i) => i !== imgIndex
        ),
      };
      return {
        ...prev,
        experiences: updatedExperiences,
      };
    });
  }, []);

  const handleExperienceChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedExperiences = [...prev.experiences];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [name]: value,
      };
      return {
        ...prev,
        experiences: updatedExperiences,
      };
    });
  }, []);

  const addExperience = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          images: [],
          imagePreviews: [],
          description: '',
          header: '',
          subHeader: '',
        },
      ],
    }));
  }, []);

  const removeExperience = useCallback((index) => {
    setFormData((prev) => {
      const updatedExperiences = [...prev.experiences];
      updatedExperiences.splice(index, 1);
      return {
        ...prev,
        experiences: updatedExperiences,
      };
    });
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSave(formData);
    },
    [formData, onSave]
  );

  const seasonTagPlaceholders = [
    'Highlight of the season',
    'Another great thing',
    "Don't miss this!",
  ];

  const handleSeasonTagChange = (seasonIndex, tagIndex, newTag) => {
    const newSeasons = [...formData.seasons];
    newSeasons[seasonIndex].seasonTags[tagIndex] = newTag;
    setFormData({ ...formData, seasons: newSeasons });
  };

  const handleSeasonTagImageChange = (seasonIndex, tagIndex, file) => {
    setFormData((prev) => {
      const newSeasons = [...prev.seasons];
      const imagePreview = file ? URL.createObjectURL(file) : null;
      newSeasons[seasonIndex].seasonTags[tagIndex] = {
        ...newSeasons[seasonIndex].seasonTags[tagIndex],
        image: file,
        imagePreview,
      };
      console.log(
        `After updating season ${seasonIndex}, tag ${tagIndex}:`,
        newSeasons[seasonIndex].seasonTags[tagIndex]
      );
      return { ...prev, seasons: newSeasons };
    });
  };

  const addSeason = () => {
    if (formData.seasons.length < 3) {
      setFormData((prev) => ({
        ...prev,
        seasons: [
          ...prev.seasons,
          {
            seasonStartMonth: 'Jan',
            seasonEndMonth: 'May',
            seasonHeading: '',
            seasonTags: [
              { description: '', image: null, imagePreview: null },
              { description: '', image: null, imagePreview: null },
              { description: '', image: null, imagePreview: null },
            ],
          },
        ],
      }));
    }
  };

  const removeSeason = (seasonIndex) => {
    if (formData.seasons.length > 1) {
      const newSeasons = [...formData.seasons];
      newSeasons.splice(seasonIndex, 1);
      setFormData({ ...formData, seasons: newSeasons });
    }
  };

  const updateSeasonField = (seasonIndex, field, value) => {
    const newSeasons = [...formData.seasons];
    if (field === 'seasonStartMonth' || field === 'seasonEndMonth') {
      if (months.includes(value)) {
        newSeasons[seasonIndex][field] = value;
      } else {
        console.warn(
          `Invalid month value: "${value}", preserving current value: "${newSeasons[seasonIndex][field]}"`
        );
      }
    } else {
      newSeasons[seasonIndex][field] = value;
    }
    setFormData({ ...formData, seasons: newSeasons });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-8'>
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
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <div className='space-y-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Explore Images
              </label>
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:border-red-500 transition-colors'
                onClick={() => document.getElementById('main-images').click()}>
                <Upload className='h-8 w-8 text-gray-400 mb-2' />
                <p className='text-sm text-gray-500'>
                  Add images for Explore section
                </p>
                <p className='text-xs text-gray-400'>
                  Click to select multiple images
                </p>
              </div>
              <input
                type='file'
                id='main-images'
                accept='image/*'
                multiple
                className='hidden'
                onChange={handleMainImageChange}
              />
              {formData.imagePreviews.length > 0 && (
                <div className='grid grid-cols-2 gap-2'>
                  {formData.imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className='relative'>
                      <img
                        src={getImageUrl(preview) || '/placeholder.svg'}
                        alt={`Preview ${index + 1}`}
                        className='w-full h-24 object-cover rounded-md'
                      />
                      <button
                        type='button'
                        onClick={() => removeMainImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'>
                        <X className='w-3 h-3' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>
            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>
            <div>
              <label
                htmlFor='seasonDescription'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Season Description
              </label>
              <textarea
                id='seasonDescription'
                name='seasonDescription'
                value={formData.seasonDescription}
                onChange={handleInputChange}
                rows={2}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              />
            </div>
          </div>
        </div>

        <div className='mb-8'>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h3 className='text-xl font-semibold text-foreground'>
                Perfect season to go
              </h3>
              <p className='text-sm text-muted-foreground mt-1'>
                Define the best times to visit this destination (Max 3 seasons)
              </p>
            </div>
            <Button
              type='button'
              onClick={addSeason}
              disabled={formData.seasons.length >= 3}
              className='inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed'>
              <Plus className='h-4 w-4 mr-1' />
              Add Season ({formData.seasons.length}/3)
            </Button>
          </div>

          <div className='space-y-8'>
            {formData.seasons.map((season, seasonIndex) => (
              <div
                key={seasonIndex}
                className='border border-gray-200 rounded-lg p-6 relative'>
                {formData.seasons.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeSeason(seasonIndex)}
                    className='absolute top-4 right-4 h-8 w-8 p-0 rounded-full bg-background border border-border hover:bg-destructive hover:text-destructive-foreground'>
                    <X className='h-4 w-4' />
                  </Button>
                )}
                <div className='grid grid-cols-1 lg:grid-cols-1 gap-6'>
                  <Card>
                    <CardHeader className='pb-4'>
                      <CardTitle className='text-lg'>
                        Season {seasonIndex + 1} Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='space-y-3'>
                        <Label className='text-sm font-medium'>
                          Season Duration
                        </Label>
                        <div className='flex items-center gap-4'>
                          <div className='flex-1'>
                            <Select
                              value={season.seasonStartMonth || 'Jan'}
                              onValueChange={(value) =>
                                updateSeasonField(
                                  seasonIndex,
                                  'seasonStartMonth',
                                  value
                                )
                              }>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Start month' />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem
                                    key={month}
                                    value={month}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <span className='text-muted-foreground font-medium'>
                            to
                          </span>
                          <div className='flex-1'>
                            <Select
                              value={season.seasonEndMonth || 'May'}
                              onValueChange={(value) =>
                                updateSeasonField(
                                  seasonIndex,
                                  'seasonEndMonth',
                                  value
                                )
                              }>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='End month' />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem
                                    key={month}
                                    value={month}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor={`season-heading-${seasonIndex}`}
                          className='text-sm font-medium'>
                          Season Heading
                        </Label>
                        <Input
                          id={`season-heading-${seasonIndex}`}
                          type='text'
                          placeholder='Add season heading'
                          value={season.seasonHeading || ''}
                          onChange={(e) =>
                            updateSeasonField(
                              seasonIndex,
                              'seasonHeading',
                              e.target.value
                            )
                          }
                          className='border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground px-0'
                        />
                      </div>
                      <div className='space-y-4'>
                        <Label className='text-sm font-medium'>
                          Season Highlights
                        </Label>
                        <div className='space-y-4'>
                          {season.seasonTags.map((tag, tagIndex) => (
                            <SeasonTagInput
                              key={`${seasonIndex}-${tagIndex}`}
                              value={tag}
                              onChange={(index, newTag) =>
                                handleSeasonTagChange(
                                  seasonIndex,
                                  index,
                                  newTag
                                )
                              }
                              onImageChange={(index, file) =>
                                handleSeasonTagImageChange(
                                  seasonIndex,
                                  index,
                                  file
                                )
                              }
                              index={tagIndex}
                              seasonIndex={seasonIndex}
                              placeholder={seasonTagPlaceholders[tagIndex]}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-semibold text-gray-900'>
              Sights and experience
            </h3>
            <button
              type='button'
              onClick={addExperience}
              className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
              <Plus className='h-4 w-4 mr-1' />
              Add More
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {formData.experiences.map((experience, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4 relative'>
                <button
                  type='button'
                  onClick={() => removeExperience(index)}
                  className='absolute top-2 right-2 text-red-500 hover:text-red-700'>
                  <Trash2 className='h-4 w-4' />
                </button>
                <div className='space-y-3 mb-4'>
                  <div
                    className='border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center h-24 cursor-pointer hover:border-red-500 transition-colors'
                    onClick={() =>
                      document
                        .getElementById(`experience-images-${index}`)
                        .click()
                    }>
                    <Upload className='h-5 w-5 text-gray-400 mb-1' />
                    <p className='text-xs text-gray-500'>Add images</p>
                  </div>
                  <input
                    type='file'
                    id={`experience-images-${index}`}
                    accept='image/*'
                    multiple
                    className='hidden'
                    onChange={(e) => handleExperienceImageChange(index, e)}
                  />
                  {experience.imagePreviews &&
                    experience.imagePreviews.length > 0 && (
                      <div className='grid grid-cols-2 gap-1'>
                        {experience.imagePreviews.map((preview, imgIndex) => (
                          <div
                            key={imgIndex}
                            className='relative'>
                            <img
                              src={getImageUrl(preview) || '/placeholder.svg'}
                              alt={`Experience ${index + 1} image ${
                                imgIndex + 1
                              }`}
                              className='w-full h-16 object-cover rounded'
                            />
                            <button
                              type='button'
                              onClick={() =>
                                removeExperienceImage(index, imgIndex)
                              }
                              className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600'>
                              <X className='w-2 h-2' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <div className='space-y-2'>
                  <div>
                    <label
                      htmlFor={`experience-header-${index}`}
                      className='block text-sm font-medium text-gray-700 mb-1'>
                      Header
                    </label>
                    <input
                      type='text'
                      id={`experience-header-${index}`}
                      name='header'
                      value={experience.header}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`experience-subHeader-${index}`}
                      className='block text-sm font-medium text-gray-700 mb-1'>
                      Sub Header
                    </label>
                    <input
                      type='text'
                      id={`experience-subHeader-${index}`}
                      name='subHeader'
                      value={experience.subHeader}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`experience-description-${index}`}
                      className='block text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      id={`experience-description-${index}`}
                      name='description'
                      value={experience.description}
                      onChange={(e) => handleExperienceChange(index, e)}
                      rows={2}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.experiences.length === 0 && (
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-red-500 transition-colors'
                onClick={addExperience}>
                <Plus className='h-8 w-8 text-gray-400 mb-1' />
                <p className='text-sm text-gray-500'>Add experience</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
