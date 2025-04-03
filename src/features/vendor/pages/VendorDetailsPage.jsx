import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { VendorInfoCard } from '../components/VendorInfoCard';
import { BusCard } from '../components/BusCard';
import { PackageCard } from '../components/PackageCard';

export const VendorDetailsPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
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
        earnings: 2500,
        bookings: 25,
        busesCount: 5,
        packagesCount: 7,
        availableBuses: 4,
        ongoingBuses: 1,
        image:
          'https://www.indifi.com/blog/wp-content/uploads/2020/03/Offers-to-Customers-For-Travel-Agencies-.jpg',
        contactPerson: 'John Doe',
        phone: '+91 9876543210',
        email: 'contact@skywaytravels.com',
        address: '123 Main Street, Palakkad, Kerala, India - 678001',
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
            onClick={() => navigate('/vendors')}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
            Back to Vendors
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='mb-6 flex flex-row justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Vendor Details</h1>

        {/* Back Button */}
        <Link
          to='/vendors'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Go Back</span>
        </Link>
      </div>

      {/* Vendor Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 no-scrollbar'>
        <div className='bg-white rounded-lg shadow-sm p-4'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-100 text-green-600 mr-4'>
              <DollarSign className='h-6 w-6' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Total Amount</p>
              <p className='text-2xl font-semibold'>₹{vendor.earnings}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-4'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-100 text-blue-600 mr-4'>
              <Calendar className='h-6 w-6' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Total Bookings</p>
              <p className='text-2xl font-semibold'>{vendor.bookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Info Card */}
      <div className='mb-8'>
        <VendorInfoCard vendor={vendor} />
      </div>

      {/* Available Buses Section */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Available Buses</h2>
          <Link
            to={`/vendors/${vendorId}/inventory`}
            className='inline-flex items-center text-blue-500 hover:text-blue-700'>
            <span className='text-sm'>See All</span>
            <ChevronRight className='h-4 w-4 ml-1' />
          </Link>
        </div>

        <div className='relative'>
          <div className='flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4 no-scrollbar'>
            {buses.map((bus) => (
              <div
                key={bus.id}
                className='w-72 flex-shrink-0'>
                <BusCard bus={bus} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Packages Section */}
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Available Packages</h2>
          <Link
            to={`/vendors/${vendorId}/inventory?tab=packages`}
            className='inline-flex items-center text-blue-500 hover:text-blue-700'>
            <span className='text-sm'>See All</span>
            <ChevronRight className='h-4 w-4 ml-1' />
          </Link>
        </div>

        <div className='relative'>
          <div className='flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4 no-scrollbar'>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className='w-72 flex-shrink-0'>
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
