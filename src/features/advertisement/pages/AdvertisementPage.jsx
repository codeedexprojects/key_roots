import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvertisementGrid } from '../components/AdvertisementGrid';
import { AdvertisementForm } from '../components/AdvertisementForm';
import { ExploreGrid } from '../components/ExploreGrid';
import { ExploreForm } from '../components/ExploreForm';
import { toast } from 'sonner';
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

  const handleSaveAdvertisement = async (data) => {
    setAdIsLoading(true);
    try {
      const response = await saveAdvertisement(data);

      if (response && !response.error) {
        toast.success('Advertisement saved successfully!');

        // Reload data by setting the activeTab to trigger the useEffect
        // This avoids duplicating the data fetching logic
        setActiveTab('advertisement');

        setAdEditMode(false);
        setCurrentAdvertisement(null);
      } else {
        console.error(
          'Error in API response:',
          response?.message || 'Unknown error'
        );
        toast.error(response?.message || 'Failed to save advertisement');
      }
    } catch (error) {
      console.error('Error saving advertisement:', error);
      toast.error('Failed to save advertisement. Please try again later.');
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

  const handleSaveExploreItem = async (data) => {
    setExploreIsLoading(true);
    try {
      const response = await saveExploreItem(data);

      if (response && !response.error) {
        toast.success('Explore item saved successfully!');

        // Reload data by setting the activeTab to trigger the useEffect
        // This avoids duplicating the data fetching logic
        setActiveTab('explore');

        setExploreEditMode(false);
        setCurrentExploreItem(null);
      } else {
        console.error(
          'Error in API response:',
          response?.message || 'Unknown error'
        );
        toast.error(response?.message || 'Failed to save explore item');
      }
    } catch (error) {
      console.error('Error saving explore item:', error);
      toast.error('Failed to save explore item. Please try again later.');
    } finally {
      setExploreIsLoading(false);
    }
  };

  useEffect(() => {
    // Move the fetch logic directly inside the useEffect
    const loadData = async () => {
      if (activeTab === 'advertisement') {
        setAdIsLoading(true);
        try {
          const response = await getAdvertisements();
          console.log(response);
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
            if (
              response.footer_sections &&
              response.footer_sections.length > 0
            ) {
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
            toast.error(response?.message || 'Failed to load advertisements');
            setAdvertisements([]);
          }
        } catch (error) {
          console.error('Error fetching advertisements:', error);
          toast.error('Failed to load advertisements. Please try again later.');
          setAdvertisements([]);
        } finally {
          setAdIsLoading(false);
        }
      } else if (activeTab === 'explore') {
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
            toast.error(response?.message || 'Failed to load explore items');
            setExploreItems([]);
          }
        } catch (error) {
          console.error('Error fetching explore items:', error);
          toast.error('Failed to load explore items. Please try again later.');
          setExploreItems([]);
        } finally {
          setExploreIsLoading(false);
        }
      }
    };

    loadData();
    // Dependencies:
    // - activeTab: We need to reload data when the tab changes
    // - getAdvertisements and getExploreItems are imported functions that don't change
  }, [activeTab]);

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
