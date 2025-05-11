import { useState, useEffect, useCallback } from 'react';
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

  // Advertisement methods
  const fetchAdvertisements = useCallback(async () => {
    setAdIsLoading(true);
    try {
      const response = await getAdvertisements();
      if (response && !response.error) {
        // Transform the API response to match our component structure
        const transformedItems = [];

        // Process advertisements
        if (response.advertisements && response.advertisements.length > 0) {
          response.advertisements.forEach((ad, index) => {
            transformedItems.push({
              id: index + 1,
              banner: {
                image: ad.image,
                title: ad.title || `Advertisement ${index + 1}`,
                description: ad.description || '',
              },
              deals: [],
              footers: [],
            });
          });
        }

        // Add limited deals to the first advertisement or create a new one
        if (response.limited_deals && response.limited_deals.length > 0) {
          if (transformedItems.length === 0) {
            transformedItems.push({
              id: 1,
              banner: {
                image: '',
                title: 'Advertisement',
                description: '',
              },
              deals: [],
              footers: [],
            });
          }

          transformedItems[0].deals = response.limited_deals.map(
            (deal, index) => ({
              id: index + 1,
              image:
                deal.images && deal.images.length > 0 ? deal.images[0] : '',
              title: deal.title || '',
              description: deal.description || '',
              offer: deal.offer || '',
            })
          );
        }

        // Add footer sections to the first advertisement or create a new one
        if (response.footer_sections && response.footer_sections.length > 0) {
          if (transformedItems.length === 0) {
            transformedItems.push({
              id: 1,
              banner: {
                image: '',
                title: 'Advertisement',
                description: '',
              },
              deals: [],
              footers: [],
            });
          }

          transformedItems[0].footers = response.footer_sections.map(
            (footer, index) => ({
              id: index + 1,
              image: footer.image || '',
              title: footer.title || '',
              phone: footer.phone || '',
              description: footer.description || '',
              price: footer.price || '',
              offerPrice: footer.offer_price || '',
            })
          );
        }

        setAdvertisements(transformedItems);
      } else {
        console.error(
          'Error in API response:',
          response?.message || 'Unknown error'
        );
        addToast({
          title: 'Error',
          message: response?.message || 'Failed to load advertisements',
          type: 'error',
        });
        setAdvertisements([]);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      addToast({
        title: 'Error',
        message: 'Failed to load advertisements. Please try again later.',
        type: 'error',
      });
      setAdvertisements([]);
    } finally {
      setAdIsLoading(false);
    }
  }, [addToast]);

  const handleSaveAdvertisement = async (data) => {
    setAdIsLoading(true);
    try {
      const response = await saveAdvertisement(data);

      if (response && !response.error) {
        addToast({
          title: 'Success',
          message: 'Advertisement saved successfully!',
          type: 'success',
        });
        fetchAdvertisements();
        setAdEditMode(false);
        setCurrentAdvertisement(null);
      } else {
        console.error(
          'Error in API response:',
          response?.message || 'Unknown error'
        );
        addToast({
          title: 'Error',
          message: response?.message || 'Failed to save advertisement',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving advertisement:', error);
      addToast({
        title: 'Error',
        message: 'Failed to save advertisement. Please try again later.',
        type: 'error',
      });
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
  const fetchExploreItems = useCallback(async () => {
    setExploreIsLoading(true);
    try {
      const response = await getExploreItems();
      if (response && !response.error && response.data) {
        const transformedItems = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          seasonDescription: item.season_description,
          image: item.image,
          sights: item.experiences
            ? item.experiences.map((exp) => ({
                id: exp.id || Math.random().toString(36).substring(2, 9),
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
  }, [addToast]);

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

  useEffect(() => {
    if (activeTab === 'advertisement') {
      fetchAdvertisements();
    } else if (activeTab === 'explore') {
      fetchExploreItems();
    }
  }, [activeTab, fetchAdvertisements, fetchExploreItems]);

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
