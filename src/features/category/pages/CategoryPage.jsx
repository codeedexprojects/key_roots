import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusCardGrid from '../components/BusCardGrid';
import PackageCardGrid from '../components/PackageCardGrid';
import { getBuses, getPackages } from '../services/categoryService.js';

export const CategoryPage = () => {
  const [activeTab, setActiveTab] = useState('buses');
  const [buses, setBuses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === 'buses') {
      fetchBuses(currentPage);
    } else if (activeTab === 'package') {
      fetchPackages();
    }
  }, [activeTab, currentPage]);

  const fetchBuses = async (page) => {
    setIsLoading(true);
    try {
      const response = await getBuses(page);
      setBuses(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await getPackages();
      setPackages(response);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='flex-1 overflow-auto'>
      <h1 className='text-2xl font-semibold mb-6'>Category</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-full'>
        <TabsList className='mb-6'>
          <TabsTrigger value='buses'>Buses</TabsTrigger>
          <TabsTrigger value='package'>Package</TabsTrigger>
        </TabsList>

        <TabsContent
          value='buses'
          className='space-y-6'>
          <BusCardGrid
            buses={buses}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TabsContent>

        <TabsContent
          value='package'
          className='space-y-6'>
          <PackageCardGrid
            packages={packages}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
