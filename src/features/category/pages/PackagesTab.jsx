import React, { useState } from 'react';
import MainPackageCategories from '../components/MainPackageCategories';
import SubPackageCategories from '../components/SubPackageCategories';
import VendorPackageList from '../components/VendorPackageList';
import PackageDetails from '../components/PackageDetails';

// Helper function to generate package data
function generatePackages(count, type) {
  const packages = [];
  const destinations = [
    'Munnar',
    'Varkala',
    'Wayanad',
    'Thekkady',
    'Kovalam',
    'Alleppey',
    'Kochi',
    'Kumarakom',
  ];

  for (let i = 1; i <= count; i++) {
    const randomDays = Math.floor(Math.random() * 3) + 1;
    const randomNights = randomDays > 1 ? randomDays - 1 : 0;
    const randomPrice = (Math.floor(Math.random() * 5) + 5) * 1000;
    const randomDestinations = shuffleArray([...destinations]).slice(0, 2);

    packages.push({
      id: i,
      title: `Komban Travels`,
      vehicleNo: `KL 58M ${6000 + i}`,
      image:
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      route: `Kochi - ${randomDestinations[0]}`,
      duration: `${randomDays} Night, ${randomNights} Day`,
      price: randomPrice,
      places: randomDestinations,
      guide: Math.random() > 0.5,
      ac: Math.random() > 0.3,
      stay: {
        resortName: 'Destination Mountain Resort',
        rating: Math.floor(Math.random() * 2) + 4,
        image:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        description: 'Luxury resort with mountain views',
        amenities: [
          'Swimming Pool',
          '24-hour Room Service',
          'Spa',
          'Restaurant',
        ],
      },
      meals: {
        title: 'Exclusive Banquet',
        description:
          'Three meals per day including traditional Kerala cuisine and continental options.',
        image:
          'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      },
      activity: {
        title: 'Tour manager assistance',
        description:
          'Professional tour guide to assist with all activities and sightseeing.',
        image:
          'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      },
      sightseeing: [
        {
          name: 'KTDC Tea Museum',
          description: 'Experience the history of tea cultivation',
          image:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        },
        {
          name: 'Chinnakanal Waterfall',
          description: 'Beautiful waterfall surrounded by lush greenery',
          image:
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        },
        {
          name: 'Mattupetty Dam',
          description: 'Scenic dam with boating facilities',
          image:
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        },
      ],
    });
  }

  return packages;
}

// Helper function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Mock data for package categories
const packageCategories = [
  {
    id: 1,
    title: 'Packages',
    image:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    subCategories: [
      {
        id: 101,
        title: 'Friends',
        image:
          'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'Friends'),
      },
      {
        id: 102,
        title: 'Family',
        image:
          'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'Family'),
      },
      {
        id: 103,
        title: 'School Trip',
        image:
          'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'School'),
      },
    ],
  },
  {
    id: 2,
    title: '1 Day Trip',
    image:
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    subCategories: [
      {
        id: 201,
        title: 'Adventure',
        image:
          'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'Adventure'),
      },
      {
        id: 202,
        title: 'Sightseeing',
        image:
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'Sightseeing'),
      },
    ],
  },
  {
    id: 3,
    title: 'Pilgrimage',
    image:
      'https://images.unsplash.com/photo-1519824145371-296894a0daa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    subCategories: [
      {
        id: 301,
        title: 'Temples',
        image:
          'https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'Temple'),
      },
      {
        id: 302,
        title: 'Churches',
        image:
          'https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'Church'),
      },
      {
        id: 303,
        title: 'Mosques',
        image:
          'https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        packages: generatePackages(9, 'Mosque'),
      },
    ],
  },
];

const PackagesTab = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleMainCategoryClick = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory(null);
    setSelectedPackage(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedPackage(null);
  };

  const handlePackageClick = (packageItem) => {
    setSelectedPackage(packageItem);
  };

  const handleBackToMain = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setSelectedPackage(null);
  };

  const handleBackToSub = () => {
    setSelectedPackage(null);
  };

  const handleBackToVendorList = () => {
    setSelectedSubCategory(null);
  };

  // Determine which view to show
  const renderContent = () => {
    if (selectedPackage) {
      return (
        <PackageDetails
          packageData={selectedPackage}
          onBack={handleBackToSub}
        />
      );
    } else if (selectedSubCategory) {
      return (
        <VendorPackageList
          packages={selectedSubCategory.packages}
          onPackageClick={handlePackageClick}
          onBack={handleBackToVendorList}
          subCategoryTitle={selectedSubCategory.title}
        />
      );
    } else if (selectedMainCategory) {
      return (
        <SubPackageCategories
          mainCategory={selectedMainCategory}
          onSubCategoryClick={handleSubCategoryClick}
          onBack={handleBackToMain}
        />
      );
    } else {
      return (
        <MainPackageCategories
          categories={packageCategories}
          onCategoryClick={handleMainCategoryClick}
        />
      );
    }
  };

  return <div className='w-full'>{renderContent()}</div>;
};

export default PackagesTab;
