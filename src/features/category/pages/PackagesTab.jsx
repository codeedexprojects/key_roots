import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainPackageCategories from '../components/MainPackageCategories';
import SubPackageCategories from '../components/SubPackageCategories';
import VendorPackageList from '../components/VendorPackageList';
import PackageDetails from '../components/PackageDetails';

import {
  getPackageCategories,
  getSubCategories,
  getPackagesBySubCategory,
  getPackageDetails,
  transformCategoryData,
  transformSubCategoryData,
  transformPackageData,
  transformPackageDetails,
} from '../services/categoryService';

const PackagesTab = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packageDetails, setPackageDetails] = useState(null);

  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isLoadingPackageDetails, setIsLoadingPackageDetails] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await getPackageCategories();
      if (response && response.data) {
        const transformedCategories = transformCategoryData(response.data);
        setCategories(transformedCategories);
      } else {
        toast.error(response?.message || 'Failed to load categories');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again later.');
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadSubCategories = async (categoryId) => {
    setIsLoadingSubCategories(true);
    try {
      const response = await getSubCategories(categoryId);

      if (response && response.subcategories) {
        const transformedSubCategories = transformSubCategoryData(
          response.subcategories
        );
        setSubCategories(transformedSubCategories);
      } else {
        toast.error(response?.message || 'Failed to load subcategories');
        setSubCategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories. Please try again later.');
      setSubCategories([]);
    } finally {
      setIsLoadingSubCategories(false);
    }
  };

  const handleSubCategoryRefresh = () => {
    if (selectedMainCategory) {
      loadSubCategories(selectedMainCategory.id);
    }
  };

  const loadPackages = async (subCategoryId) => {
    setIsLoadingPackages(true);
    try {
      const response = await getPackagesBySubCategory(subCategoryId);

      if (response) {
        // Handle direct array response
        const packagesData = Array.isArray(response)
          ? response
          : response.data || [];
        const transformedPackages = transformPackageData(packagesData);
        setPackages(transformedPackages);
      } else {
        toast.error(response?.message || 'Failed to load packages');
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages. Please try again later.');
      setPackages([]);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const loadPackageDetails = async (packageId) => {
    setIsLoadingPackageDetails(true);
    try {
      const response = await getPackageDetails(packageId);

      if (response) {
        const transformedDetails = transformPackageDetails(response);
        setPackageDetails(transformedDetails);
      } else {
        toast.error(response?.message || 'Failed to load package details');
        setPackageDetails(null);
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
      toast.error('Failed to load package details. Please try again later.');
      setPackageDetails(null);
    } finally {
      setIsLoadingPackageDetails(false);
    }
  };

  const handleMainCategoryClick = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory(null);
    setSelectedPackage(null);
    setPackageDetails(null);
    // Load subcategories for the selected category
    loadSubCategories(category.id);
  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedPackage(null);
    setPackageDetails(null);
    // Load packages for the selected subcategory
    loadPackages(subCategory.id);
  };

  const handlePackageClick = (packageItem) => {
    setSelectedPackage(packageItem);
    // Load package details
    loadPackageDetails(packageItem.id);
  };

  const handleBackToMain = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setSelectedPackage(null);
    setPackageDetails(null);
    setSubCategories([]);
    setPackages([]);
  };

  const handleBackToSub = () => {
    setSelectedPackage(null);
    setPackageDetails(null);
  };

  const handleBackToVendorList = () => {
    setSelectedSubCategory(null);
    setSelectedPackage(null);
    setPackageDetails(null);
    setPackages([]);
  };

  // Determine which view to show
  const renderContent = () => {
    if (selectedPackage && packageDetails) {
      return (
        <PackageDetails
          packageData={packageDetails}
          onBack={handleBackToSub}
          isLoading={isLoadingPackageDetails}
        />
      );
    } else if (selectedSubCategory) {
      return (
        <VendorPackageList
          packages={packages}
          onPackageClick={handlePackageClick}
          onBack={handleBackToVendorList}
          subCategoryTitle={selectedSubCategory.name}
          isLoading={isLoadingPackages}
        />
      );
    } else if (selectedMainCategory) {
      return (
        <SubPackageCategories
          mainCategory={selectedMainCategory}
          subCategories={subCategories}
          onSubCategoryClick={handleSubCategoryClick}
          onBack={handleBackToMain}
          isLoading={isLoadingSubCategories}
          onRefresh={handleSubCategoryRefresh}
          allCategories={categories}
        />
      );
    } else {
      return (
        <MainPackageCategories
          categories={categories}
          onCategoryClick={handleMainCategoryClick}
          isLoading={isLoadingCategories}
          onRefresh={loadCategories}
        />
      );
    }
  };

  return <div className='w-full'>{renderContent()}</div>;
};

export default PackagesTab;
