import { useState, useEffect } from 'react';
import { ExploreGrid } from '../components/ExploreGrid';
import { ExploreForm } from '../components/ExploreForm';
import { ExploreView } from '../components/ExploreView';
import { toast } from 'sonner';
import {
  getExploreItems,
  saveExploreItem,
  deleteExploreItem,
} from '../services/advertisementService';

export const ExplorePage = () => {
  const [exploreItems, setExploreItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentExploreItem, setCurrentExploreItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadExploreItems();
  }, []);

  const loadExploreItems = async () => {
    setIsLoading(true);
    try {
      const response = await getExploreItems();

      if (response && !response.error && response.data) {
        const transformedItems = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          images: item.images?.map((img) => img.image) || [],
          seasonDescription: item.season_description || '',
          seasons: item.seasons?.map((season) => ({
            seasonStartMonth: season.from_date
              ? new Date(season.from_date).toLocaleString('default', {
                  month: 'short',
                })
              : 'Jan',
            seasonEndMonth: season.to_date
              ? new Date(season.to_date).toLocaleString('default', {
                  month: 'short',
                })
              : 'May',
            seasonHeading: season.header || '',
            seasonTags: [
              {
                image: season.icon1 || null,
                description: season.icon1_description || '',
                imagePreview: season.icon1 || null,
              },
              {
                image: season.icon2 || null,
                description: season.icon2_description || '',
                imagePreview: season.icon2 || null,
              },
              {
                image: season.icon3 || null,
                description: season.icon3_description || '',
                imagePreview: season.icon3 || null,
              },
            ],
          })) || [
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
              subHeader: exp.sub_header || '',
              images: exp.images?.map((img) => img.image) || [],
              imagePreviews: exp.images?.map((img) => img.image) || [],
            })) || [],
        }));
        setExploreItems(transformedItems);
      } else {
        toast.error(response?.message || 'Failed to load explore items');
        setExploreItems([]);
      }
    } catch (error) {
      console.error('Error fetching explore items:', error);
      toast.error('Failed to load explore items. Please try again later.');
      setExploreItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsLoading(true);
    try {
      const isEdit = Boolean(formData.id);
      const response = await saveExploreItem(formData, isEdit);
      if (!response.error) {
        toast.success(
          `Explore item ${isEdit ? 'updated' : 'created'} successfully!`
        );
        await loadExploreItems();
        setEditMode(false);
        setCurrentExploreItem(null);
      } else {
        toast.error(response?.message || 'Failed to save explore item.');
      }
    } catch (error) {
      console.error('Error saving explore item:', error);
      toast.error('Something went wrong while saving. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentExploreItem(item);
    setEditMode(true);
    setViewMode(false);
  };

  const handleView = (item) => {
    setCurrentExploreItem(item);
    setViewMode(true);
    setEditMode(false);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        const response = await deleteExploreItem(item.id);
        if (response && response.success) {
          setExploreItems(
            exploreItems.filter((exploreItem) => exploreItem.id !== item.id)
          );
          toast.success('Explore item deleted successfully');
        } else {
          toast.error(response?.message || 'Failed to delete explore item');
        }
      } catch (error) {
        console.error('Error deleting explore item:', error);
        toast.error('Failed to delete explore item');
      }
    }
  };

  const handleAddNew = () => {
    setCurrentExploreItem(null);
    setEditMode(true);
    setViewMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setViewMode(false);
    setCurrentExploreItem(null);
  };

  if (editMode) {
    return (
      <ExploreForm
        item={currentExploreItem}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  if (viewMode) {
    return (
      <ExploreView
        item={currentExploreItem}
        onEdit={() => handleEdit(currentExploreItem)}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ExploreGrid
      items={exploreItems}
      isLoading={isLoading}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
      onAddNew={handleAddNew}
    />
  );
};
