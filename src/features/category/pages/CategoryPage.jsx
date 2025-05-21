import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import BusesTab from './BusesTab';
import PackagesTab from './PackagesTab';

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('/packages') ? 'packages' : 'buses'
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/category/${tab}`);
  };

  return (
    <div className='w-full h-full bg-gray-50'>
      <div className='flex bg-white border-b border-gray-200'>
        <div
          className={`px-8 py-4 cursor-pointer font-medium transition-all ${
            activeTab === 'buses'
              ? 'border-b-2 border-red-700 text-red-700'
              : 'border-b-2 border-transparent'
          }`}
          onClick={() => handleTabChange('buses')}>
          Buses
        </div>
        <div
          className={`px-8 py-4 cursor-pointer font-medium transition-all ${
            activeTab === 'packages'
              ? 'border-b-2 border-red-700 text-red-700'
              : 'border-b-2 border-transparent'
          }`}
          onClick={() => handleTabChange('packages')}>
          Package
        </div>
      </div>
      <div className='p-5'>
        {activeTab === 'buses' ? <BusesTab /> : <PackagesTab />}
      </div>
    </div>
  );
};

export default CategoryPage;
