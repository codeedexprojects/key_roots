import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvertisementGrid } from '../components/AdvertisementGrid';
import { AdvertisementForm } from '../components/AdvertisementForm';
import { ExploreGrid } from '../components/ExploreGrid';
import { ExploreForm } from '../components/ExploreForm';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdvertisements,
  saveAdvertisement,
  getExploreItems,
  saveExploreItem,
  deleteExploreItem,
} from '../services/advertisementService';
// Using modal dialog approach instead of AlertDialog

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
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handle delete confirmation dialog
  const handleDeleteConfirmation = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Handle the actual delete operation
  const handleDeleteExploreItem = async () => {
    if (!itemToDelete || !itemToDelete.id) {
      toast.error('No item selected for deletion');
      setDeleteDialogOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteExploreItem(itemToDelete.id);

      if (response && !response.error) {
        toast.success('Explore item deleted successfully!');
        
        // Update the local state by filtering out the deleted item
        setExploreItems(prevItems => 
          prevItems.filter(item => item.id !== itemToDelete.id)
        );

        // If we're currently editing this item, navigate back to the grid
        if (exploreEditMode && currentExploreItem && currentExploreItem.id === itemToDelete.id) {
          setExploreEditMode(false);
          setCurrentExploreItem(null);
        }
      } else {
        console.error(
          'Error in API response:',
          response?.message || 'Unknown error'
        );
        toast.error(response?.message || 'Failed to delete explore item');
      }
    } catch (error) {
      console.error('Error deleting explore item:', error);
      toast.error('Failed to delete explore item. Please try again later.');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Cancel delete operation
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
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
          console.log("explore", response);
          
          if (response && !response.error && response.data) {
            const transformedItems = response.data.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              // Handle seasons data - get the first season's header as seasonDescription
              seasonDescription: item.seasons && item.seasons.length > 0 ? item.seasons[0].header : undefined,
              // Get the first image from the images array if it exists
              image: item.images && item.images.length > 0 ? item.images[0].image : undefined,
              // Store the full images array for reference if needed
              images: item.images || [],
              // Store seasons data
              seasons: item.seasons || [],
              // Transform experiences into sights
              sights: item.experiences
                ? item.experiences.map((exp) => ({
                    id: Math.random().toString(36).substring(2, 9), // Generate random ID since experiences don't have IDs
                    description: exp.description,
                    header: exp.header,
                    subHeader: exp.sub_header,
                    // Get the first image if it exists
                    image: exp.images && exp.images.length > 0 ? exp.images[0].image : undefined,
                    // Store all images for the experience
                    images: exp.images || [],
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
              onDelete={handleDeleteConfirmation}
            />
          ) : (
            <ExploreForm
              item={currentExploreItem}
              onSave={handleSaveExploreItem}
              onCancel={handleCancelExploreEdit}
              onDelete={handleDeleteConfirmation}
              isLoading={exploreIsLoading}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 pb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Item</h3>
          <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-600 leading-relaxed">
          Are you sure you want to permanently delete this item? All associated data will be lost and cannot be recovered.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 p-6 pt-4 bg-gray-50 rounded-b-xl">
        <button
          onClick={handleCancelDelete}
          disabled={isDeleting}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteExploreItem}
          disabled={isDeleting}
          className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-20"
        >
          {isDeleting ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Deleting...</span>
            </div>
          ) : (
            'Delete'
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};