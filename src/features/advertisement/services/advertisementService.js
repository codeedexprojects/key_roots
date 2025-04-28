import { axiosInstance } from '@/lib/axiosInstance';
import { apiRequest } from '@/lib/apiRequest';

// Advertisement & Explore module service

// Mock data for advertisements
const mockAdvertisements = [
  {
    id: 1,
    banner: {
      image: '/placeholder.svg?height=200&width=300',
      title: 'Summer Special Offers',
      description:
        'Enjoy amazing discounts on all summer destinations. Book now for the best deals!',
    },
    deals: [
      {
        id: 1,
        image: '/placeholder.svg?height=150&width=150',
        title: 'Beach Getaway',
        description: 'Relax on pristine beaches',
        offer: '20% OFF',
      },
      {
        id: 2,
        image: '/placeholder.svg?height=150&width=150',
        title: 'Mountain Retreat',
        description: 'Escape to the mountains',
        offer: '15% OFF',
      },
    ],
    footers: [
      {
        id: 1,
        image: '/placeholder.svg?height=150&width=150',
        title: 'Premium Bus Service',
        phone: '+91 9876543210',
        description: 'Luxury travel experience',
        price: '₹5000',
        offerPrice: '₹4200',
      },
    ],
  },
  {
    id: 2,
    banner: {
      image: '/placeholder.svg?height=200&width=300',
      title: 'Monsoon Packages',
      description:
        'Experience the beauty of rain with our special monsoon packages. Limited time offers!',
    },
    deals: [
      {
        id: 1,
        image: '/placeholder.svg?height=150&width=150',
        title: 'Waterfall Tour',
        description: 'Visit stunning waterfalls',
        offer: '25% OFF',
      },
    ],
    footers: [
      {
        id: 1,
        image: '/placeholder.svg?height=150&width=150',
        title: 'Deluxe Accommodation',
        phone: '+91 9876543211',
        description: 'Stay in comfort',
        price: '₹3500',
        offerPrice: '₹2800',
      },
    ],
  },
  {
    id: 3,
    banner: {
      image: '/placeholder.svg?height=200&width=300',
      title: 'Festival Special',
      description:
        'Celebrate festivals with our special travel packages. Book early for best rates!',
    },
    deals: [
      {
        id: 1,
        image: '/placeholder.svg?height=150&width=150',
        title: 'Cultural Tour',
        description: 'Immerse in local culture',
        offer: '10% OFF',
      },
      {
        id: 2,
        image: '/placeholder.svg?height=150&width=150',
        title: 'Food Festival',
        description: 'Taste local cuisines',
        offer: '15% OFF',
      },
    ],
    footers: [],
  },
];

// Mock data for explore items
const mockExploreItems = [
  {
    id: 1,
    image: '/placeholder.svg?height=200&width=300',
    title: 'Discover the magic of varkala cliff',
    description:
      'Experience the breathtaking views and serene atmosphere of Varkala Cliff, a paradise for beach lovers and nature enthusiasts.',
    seasonDescription:
      'Best visited during winter months from October to February when the weather is pleasant.',
    sights: [
      {
        id: 1,
        image: '/placeholder.svg?height=150&width=200',
        description: 'Varkala waterfall, cheeyappara',
      },
      {
        id: 2,
        image: '/placeholder.svg?height=150&width=200',
        description: 'TATA tea museum, Ernakulam park',
      },
    ],
  },
  {
    id: 2,
    image: '/placeholder.svg?height=200&width=300',
    title: 'Wayanad - Serenity',
    description:
      'Immerse yourself in the tranquil beauty of Wayanad, where lush forests and misty mountains create a perfect retreat.',
    seasonDescription:
      'Visit during the post-monsoon season (September to May) for the best experience.',
    sights: [
      {
        id: 1,
        image: '/placeholder.svg?height=150&width=200',
        description: 'Chembra Peak',
      },
      {
        id: 2,
        image: '/placeholder.svg?height=150&width=200',
        description: 'Banasura Sagar Dam',
      },
    ],
  },
];

// Mock function to get advertisements
export const getAdvertisements = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, this would be an API call
  // return await apiClient.get('/api/advertisement');

  return mockAdvertisements;
};

// Mock function to save advertisement data
export const saveAdvertisement = async (data) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Advertisement data saved:', data);

  // In a real app, this would be an API call
  // return await apiClient.post('/api/advertisement', data);

  return { success: true, message: 'Advertisement saved successfully' };
};

// Function to get explore items
export const getExploreItems = async () => {
  return apiRequest(
    () =>
      axiosInstance.get('https://keyroute.pythonanywhere.com/explore/list/'),
    'Error occurred while fetching explore items.'
  );
};

// Function to save explore item
export const saveExploreItem = async (data) => {
  // Create FormData object for file uploads
  const formData = new FormData();

  // Add main explore data
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('season_description', data.seasonDescription);

  // Add main image if available
  if (data.image) {
    formData.append('image', data.image);
  }

  // Add experiences (sights)
  if (data.sights && data.sights.length > 0) {
    // Create experiences array
    const experiences = data.sights.map((sight) => ({
      description: sight.description,
      // We'll handle the image upload separately
    }));

    formData.append('experiences', JSON.stringify(experiences));

    // Add experience images
    data.sights.forEach((sight, index) => {
      if (sight.image) {
        formData.append(`experience_images_${index}`, sight.image);
      }
    });
  }

  return apiRequest(
    () =>
      axiosInstance.post(
        'https://keyroute.pythonanywhere.com/api/admin/explore/create/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ),
    'Error occurred while creating explore item.'
  );
};
