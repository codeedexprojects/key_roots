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
  const [busCurrentPage, setBusCurrentPage] = useState(1);
  const [packageCurrentPage, setPackageCurrentPage] = useState(1);
  const [busTotalPages, setBusTotalPages] = useState(1);
  const [packageTotalPages, setPackageTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === 'buses') {
      fetchBuses(busCurrentPage);
    } else if (activeTab === 'package') {
      fetchPackages(packageCurrentPage);
    }
  }, [activeTab, busCurrentPage, packageCurrentPage]);

  const fetchBuses = async (page) => {
    setIsLoading(true);
    try {
      const response = await getBuses(page);
      setBuses(response.data);
      setBusTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackages = async (page) => {
    setIsLoading(true);
    try {
      const response = await getPackages(page);
      setPackages(response.data || []);
      setPackageTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusPageChange = (page) => {
    setBusCurrentPage(page);
  };

  const handlePackagePageChange = (page) => {
    setPackageCurrentPage(page);
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
            currentPage={busCurrentPage}
            totalPages={busTotalPages}
            onPageChange={handleBusPageChange}
          />
        </TabsContent>

        <TabsContent
          value='package'
          className='space-y-6'>
          <PackageCardGrid
            packages={packages}
            isLoading={isLoading}
            currentPage={packageCurrentPage}
            totalPages={packageTotalPages}
            onPageChange={handlePackagePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
