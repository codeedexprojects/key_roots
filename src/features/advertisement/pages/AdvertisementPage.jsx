import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvertisementGrid } from '../components/AdvertisementGrid';
import { AdvertisementForm } from '../components/AdvertisementForm';
import { ExploreGrid } from '../components/ExploreGrid';
import { ExploreForm } from '../components/ExploreForm';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { useToast } from '@/components/ui/toast-provider';
import {
  getAdvertisements,
  saveAdvertisement,
  getExploreItems,
  saveExploreItem,
} from '../services/advertisementService';

export const AdvertisementPage = () => {
  const [activeTab, setActiveTab] = useState('advertisement');
  const { addToast } = useToast();

  // Advertisement state
  const [advertisements, setAdvertisements] = useState([]);
  const [adEditMode, setAdEditMode] = useState(false);
  const [currentAdvertisement, setCurrentAdvertisement] = useState(null);
  const [adIsLoading, setAdIsLoading] = useState(false);

  // Explore state
  const [exploreItems, setExploreItems] = useState([]);
  const [exploreEditMode, setExploreEditMode] = useState(false);
  const [currentExploreItem, setCurrentExploreItem] = useState(null);
  const [exploreIsLoading, setExploreIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'advertisement') {
      fetchAdvertisements();
    } else if (activeTab === 'explore') {
      fetchExploreItems();
    }
  }, [activeTab]);

  // Advertisement methods
  const fetchAdvertisements = async () => {
    setAdIsLoading(true);
    try {
      const items = await getAdvertisements();
      setAdvertisements(items);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setAdIsLoading(false);
    }
  };

  const handleSaveAdvertisement = async (data) => {
    setAdIsLoading(true);
    try {
      await saveAdvertisement(data);
      fetchAdvertisements();
      setAdEditMode(false);
      setCurrentAdvertisement(null);
      alert('Advertisement saved successfully!');
    } catch (error) {
      console.error('Error saving advertisement:', error);
      alert('Failed to save advertisement. Please try again.');
    } finally {
      setAdIsLoading(false);
    }
  };

  const handleEditAdvertisement = (item) => {
    setCurrentAdvertisement(item);
    setAdEditMode(true);
  };

  const handleAddNewAdvertisement = () => {
    setCurrentAdvertisement(null);
    setAdEditMode(true);
  };

  const handleCancelAdEdit = () => {
    setAdEditMode(false);
    setCurrentAdvertisement(null);
  };

  // Explore methods
  const fetchExploreItems = async () => {
    setExploreIsLoading(true);
    try {
      const response = await getExploreItems();
      if (response && !response.error && response.data) {
        // Transform API response to match the expected format
        const transformedItems = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          seasonDescription: item.season_description,
          image: item.image,
          sights: item.experiences
            ? item.experiences.map((exp) => ({
                id: exp.id || Math.random().toString(36).substr(2, 9),
                description: exp.description,
                image: exp.image,
              }))
            : [],
        }));
        setExploreItems(transformedItems);
      } else {
        console.error(
          'Error in API response:',
          response?.message || 'Unknown error'
        );
        addToast({
          title: 'Error',
          message: response?.message || 'Failed to load explore items',
          type: 'error',
        });
        setExploreItems([]);
      }
    } catch (error) {
      console.error('Error fetching explore items:', error);
      addToast({
        title: 'Error',
        message: 'Failed to load explore items. Please try again later.',
        type: 'error',
      });
      setExploreItems([]);
    } finally {
      setExploreIsLoading(false);
    }
  };

  const handleSaveExploreItem = async (data) => {
    setExploreIsLoading(true);
    try {
      const response = await saveExploreItem(data);

      if (response && !response.error) {
        addToast({
          title: 'Success',
          message: 'Explore item saved successfully!',
          type: 'success',
        });
        fetchExploreItems();
        setExploreEditMode(false);
        setCurrentExploreItem(null);
      } else {
        console.error(
          'Error in API response:',
          response?.message || 'Unknown error'
        );
        addToast({
          title: 'Error',
          message: response?.message || 'Failed to save explore item',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving explore item:', error);
      addToast({
        title: 'Error',
        message: 'Failed to save explore item. Please try again later.',
        type: 'error',
      });
    } finally {
      setExploreIsLoading(false);
    }
  };

  const handleEditExploreItem = (item) => {
    setCurrentExploreItem(item);
    setExploreEditMode(true);
  };

  const handleAddNewExploreItem = () => {
    setCurrentExploreItem(null);
    setExploreEditMode(true);
  };

  const handleCancelExploreEdit = () => {
    setExploreEditMode(false);
    setCurrentExploreItem(null);
  };

  return (
    <div className='flex-1 overflow-auto '>
      <h1 className='text-2xl font-semibold mb-6'>Advertisement & Explore</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-full'>
        <TabsList className='mb-6'>
          <TabsTrigger value='advertisement'>Advertisement</TabsTrigger>
          <TabsTrigger value='explore'>Explore</TabsTrigger>
        </TabsList>

        <TabsContent
          value='advertisement'
          className='space-y-6'>
          {!adEditMode ? (
            <AdvertisementGrid
              items={advertisements}
              isLoading={adIsLoading}
              onEdit={handleEditAdvertisement}
              onAddNew={handleAddNewAdvertisement}
            />
          ) : (
            <AdvertisementForm
              item={currentAdvertisement}
              onSave={handleSaveAdvertisement}
              onCancel={handleCancelAdEdit}
              isLoading={adIsLoading}
            />
          )}
        </TabsContent>

        <TabsContent
          value='explore'
          className='space-y-6'>
          {!exploreEditMode ? (
            <ExploreGrid
              items={exploreItems}
              isLoading={exploreIsLoading}
              onEdit={handleEditExploreItem}
              onAddNew={handleAddNewExploreItem}
            />
          ) : (
            <ExploreForm
              item={currentExploreItem}
              onSave={handleSaveExploreItem}
              onCancel={handleCancelExploreEdit}
              isLoading={exploreIsLoading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
