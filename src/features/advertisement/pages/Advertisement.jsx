import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvertisementGrid } from '../components/AdvertisementGrid';
import { AdvertisementForm } from '../components/AdvertisementForm';
import { ExploreGrid } from '../components/ExploreGrid';
import { ExploreForm } from '../components/ExploreForm';
import {
  getAdvertisements,
  saveAdvertisement,
  getExploreItems,
  saveExploreItem,
} from '../services/advertisementService';

export const AdvertisementPage = () => {
  const [activeTab, setActiveTab] = useState('advertisement');

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
      const items = await getExploreItems();
      setExploreItems(items);
    } catch (error) {
      console.error('Error fetching explore items:', error);
    } finally {
      setExploreIsLoading(false);
    }
  };

  const handleSaveExploreItem = async (data) => {
    setExploreIsLoading(true);
    try {
      await saveExploreItem(data);
      fetchExploreItems();
      setExploreEditMode(false);
      setCurrentExploreItem(null);
      alert('Explore item saved successfully!');
    } catch (error) {
      console.error('Error saving explore item:', error);
      alert('Failed to save explore item. Please try again.');
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
    <div className='flex-1 overflow-auto p-2 md:p-4 lg:p-6'>
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
