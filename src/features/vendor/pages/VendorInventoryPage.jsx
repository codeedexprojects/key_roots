import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export const VendorInventoryPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab =
    searchParams.get('tab') === 'packages' ? 'packages' : 'buses';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [vendor, setVendor] = useState(null);
  const [buses, setBuses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch vendor details
    const fetchVendorDetails = () => {
      setLoading(true);

      // Sample vendor data
      const vendorData = {
        id: Number.parseInt(vendorId),
        name: 'Skyway Travels',
        location: 'Palakkad',
      };

      // Sample buses data
      const busesData = [
        {
          id: 1,
          title: 'Volvo AC Sleeper',
          type: 'Sleeper',
          capacity: 36,
          vehicleRC: 'KL-10-AB-1234',
          status: 'Available',
          image:
            'https://gst-contracts.s3.ap-southeast-1.amazonaws.com/uploads/bcc/cms/asset/avatar/324800/banner6.jpg',
        },
        {
          id: 2,
          title: 'Mercedes Benz Traveller',
          type: 'Seater',
          capacity: 20,
          vehicleRC: 'KL-10-CD-5678',
          status: 'Ongoing',
          image:
            'https://gst-contracts.s3.ap-southeast-1.amazonaws.com/uploads/bcc/cms/asset/avatar/324800/banner6.jpg',
        },
        {
          id: 3,
          title: 'Scania Multi-Axle',
          type: 'Sleeper',
          capacity: 42,
          vehicleRC: 'KL-10-EF-9012',
          status: 'Available',
          image:
            'https://gst-contracts.s3.ap-southeast-1.amazonaws.com/uploads/bcc/cms/asset/avatar/324800/banner6.jpg',
        },
        {
          id: 4,
          title: 'Tata AC Seater',
          type: 'Seater',
          capacity: 32,
          vehicleRC: 'KL-10-GH-3456',
          status: 'Available',
          image:
            'https://gst-contracts.s3.ap-southeast-1.amazonaws.com/uploads/bcc/cms/asset/avatar/324800/banner6.jpg',
        },
        {
          id: 5,
          title: 'Ashok Leyland Sleeper',
          type: 'Sleeper',
          capacity: 30,
          vehicleRC: 'KL-10-IJ-7890',
          status: 'Available',
          image:
            'https://gst-contracts.s3.ap-southeast-1.amazonaws.com/uploads/bcc/cms/asset/avatar/324800/banner6.jpg',
        },
      ];

      // Sample packages data
      const packagesData = [
        {
          id: 'PKG001',
          destination: 'Munnar Hill Station',
          route: 'Palakkad → Munnar',
          availableDates: 'Mon, Wed, Fri',
          status: 'Open',
          image:
            'https://www.indiantempletour.com/wp-content/uploads/2016/08/Untitled-design109.png',
        },
        {
          id: 'PKG002',
          destination: 'Wayanad Wildlife',
          route: 'Palakkad → Wayanad',
          availableDates: 'Tue, Thu, Sat',
          status: 'Open',
          image:
            'https://www.indiantempletour.com/wp-content/uploads/2016/08/Untitled-design109.png',
        },
        {
          id: 'PKG003',
          destination: 'Alleppey Backwaters',
          route: 'Palakkad → Alleppey',
          availableDates: 'Wed, Sat, Sun',
          status: 'Closed',
          image:
            'https://www.indiantempletour.com/wp-content/uploads/2016/08/Untitled-design109.png',
        },
        {
          id: 'PKG004',
          destination: 'Kovalam Beach',
          route: 'Palakkad → Trivandrum → Kovalam',
          availableDates: 'Fri, Sat, Sun',
          status: 'Open',
          image:
            'https://www.indiantempletour.com/wp-content/uploads/2016/08/Untitled-design109.png',
        },
        {
          id: 'PKG005',
          destination: 'Thekkady Wildlife',
          route: 'Palakkad → Thekkady',
          availableDates: 'Mon, Thu, Sun',
          status: 'Open',
          image:
            'https://www.indiantempletour.com/wp-content/uploads/2016/08/Untitled-design109.png',
        },
        {
          id: 'PKG006',
          destination: 'Vagamon Hills',
          route: 'Palakkad → Vagamon',
          availableDates: 'Tue, Fri, Sun',
          status: 'Closed',
          image:
            'https://www.indiantempletour.com/wp-content/uploads/2016/08/Untitled-design109.png',
        },
        {
          id: 'PKG007',
          destination: 'Kochi City Tour',
          route: 'Palakkad → Kochi',
          availableDates: 'Mon, Wed, Sat',
          status: 'Open',
          image:
            'https://www.indiantempletour.com/wp-content/uploads/2016/08/Untitled-design109.png',
        },
      ];

      setVendor(vendorData);
      setBuses(busesData);
      setPackages(packagesData);
      setLoading(false);
    };

    fetchVendorDetails();
  }, [vendorId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(
      `/vendors/${vendorId}/inventory${
        tab === 'packages' ? '?tab=packages' : ''
      }`
    );
  };

  if (loading) {
    return (
      <>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      </>
    );
  }

  if (!vendor) {
    return (
      <>
        <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
          <p className='text-gray-500'>Vendor not found.</p>
          <button
            onClick={() => navigate('/admin/vendors')}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
            Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className='mb-6 flex flex-row justify-between items-center'>
        <div>
          <h1 className='text-2xl font-semibold mb-2'>
            {vendor.name} Inventory
          </h1>
          <p className='text-gray-500'>{vendor.location}</p>
        </div>
        <Link
          to={`/vendors/${vendorId}`}
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Go Back</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200 mb-6'>
        <div className='flex -mb-px'>
          <button
            className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'buses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('buses')}>
            Buses ({buses.length})
          </button>
          <button
            className={`ml-8 py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'packages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('packages')}>
            Packages ({packages.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'buses' ? (
        <div className='space-y-6'>
          {buses.map((bus) => (
            <div
              key={bus.id}
              className='bg-white rounded-lg shadow-sm overflow-hidden'>
              <div className='md:flex'>
                <div className='md:w-1/3 h-48 md:h-auto bg-gray-200'>
                  <img
                    src={bus.image || '/placeholder.svg?height=192&width=384'}
                    alt={bus.title}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='p-6 md:w-2/3'>
                  <h3 className='font-semibold text-lg mb-2'>{bus.title}</h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Type</p>
                      <p className='font-medium'>{bus.type}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Capacity</p>
                      <p className='font-medium'>{bus.capacity} seats</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Vehicle RC</p>
                      <p className='font-medium'>{bus.vehicleRC}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Status</p>
                      <p
                        className={`font-medium ${
                          bus.status === 'Available'
                            ? 'text-green-600'
                            : bus.status === 'Ongoing'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}>
                        {bus.status}
                      </p>
                    </div>
                  </div>

                  <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='space-y-6'>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className='bg-white rounded-lg shadow-sm overflow-hidden'>
              <div className='md:flex'>
                <div className='md:w-1/3 h-48 md:h-auto bg-gray-200'>
                  <img
                    src={pkg.image || '/placeholder.svg?height=192&width=384'}
                    alt={pkg.destination}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='p-6 md:w-2/3'>
                  <h3 className='font-semibold text-lg mb-2'>
                    {pkg.destination}
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Route</p>
                      <p className='font-medium'>{pkg.route}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Available Dates</p>
                      <p className='font-medium'>{pkg.availableDates}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Package ID</p>
                      <p className='font-medium'>{pkg.id}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Status</p>
                      <p
                        className={`font-medium ${
                          pkg.status === 'Open'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                        {pkg.status}
                      </p>
                    </div>
                  </div>

                  <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
