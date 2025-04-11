// Mock API service for Category module

// Mock data for buses
const mockBuses = [
  {
    id: 1,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6018',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX18',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 2,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6019',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX19',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 3,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6020',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX20',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 4,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6021',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX21',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 5,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6022',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX22',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 6,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6023',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX23',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 7,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6024',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX24',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 8,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6025',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX25',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 9,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6026',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX26',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 10,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6027',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX27',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 11,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6028',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX28',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 12,
    name: 'Komban Travels',
    numberPlate: 'KL 58M 6029',
    busType: 'Coach',
    capacity: '45',
    vehicleId: '45DDXXXXXXXXX29',
    image: '/placeholder.svg?height=200&width=300',
  },
];

// Mock data for packages
const mockPackages = [
  {
    id: 1,
    title: 'Packages',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 2,
    title: '1 Day trip',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 3,
    title: 'Pilgrimage',
    image: '/placeholder.svg?height=200&width=300',
  },
];

// Mock data for bus details
const mockBusDetails = {
  id: 1,
  name: 'Komban Holidays',
  numberPlate: 'KL 58M 6018',
  packagePlaces: ['Munnar', 'Varkala'],
  guideAvailability: 'Yes',
  type: 'Non-AC',
  duration: {
    days: 2,
    nights: 3,
  },
  image: '/placeholder.svg?height=400&width=600',
  sightseeing: [
    {
      id: 1,
      place: 'Valara waterfall, cheeyappara',
      image: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 2,
      place: 'TATA tea museum, Ernakulam park',
      image: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 3,
      place: 'Chinnakanal waterfalls',
      image: '/placeholder.svg?height=150&width=200',
    },
    {
      id: 4,
      place: 'Mattupetty Dam',
      image: '/placeholder.svg?height=150&width=200',
    },
  ],
  stay: {
    name: 'Deshadan Mountain Resort',
    location: 'Munnar',
    distance: '2.7 km from Centre',
    rating: 4.5,
    facilities: ['Breakfast Included'],
    image: '/placeholder.svg?height=200&width=300',
  },
  meals: {
    type: 'Lunch',
    location: 'Munnar',
    name: 'Backwater Banquet',
    description:
      "Enjoy a taste of Kerala's rich culinary tradition, featuring local spices, seafood, and more. You can enjoy the experience at local hotel.",
    image: '/placeholder.svg?height=200&width=300',
  },
  activity: {
    title: 'Tour manager assistance',
    description:
      'Our experienced tour guides will assist you throughout the trip. They are knowledgeable and attentive at the destination to help navigate and through the tour.',
    image: '/placeholder.svg?height=200&width=300',
  },
};

// Function to get buses with pagination
export const getBuses = async (page = 1, limit = 9) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBuses = mockBuses.slice(startIndex, endIndex);

  return {
    data: paginatedBuses,
    totalPages: Math.ceil(mockBuses.length / limit),
    currentPage: page,
    totalItems: mockBuses.length,
  };
};

// Function to get packages
export const getPackages = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return mockPackages;
};

// Function to get bus details by ID
export const getBusDetails = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you would fetch the specific bus by ID
  // For now, we'll just return the mock data
  return { ...mockBusDetails, id: Number.parseInt(id) };
};
