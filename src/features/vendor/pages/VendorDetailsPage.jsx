import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { VendorInfoCard } from '../components/VendorInfoCard';
import { BusCard } from '../components/BusCard';
import { PackageCard } from '../components/PackageCard';
import { getVendorById } from '../services/vendorService';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MarkedCalender } from '../components/MarkedCalender';

export const VendorDetailsPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [buses, setBuses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [markedDates, setMarkedDates] = useState(['2025-02-04', '2025-02-05']);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      setLoading(true);
      try {
        const response = await getVendorById(vendorId);

        console.log(response);
        if (response && response.data) {
          const vendorData = response.data;
          const transformedVendor = {
            id: vendorData.user_id,
            name: vendorData.travels_name,
            location: vendorData.location || vendorData.city,
            earnings: 0,
            bookings: vendorData.buses?.length || 0,
            busesCount: vendorData.bus_count || 0,
            packagesCount: vendorData.package_count || 0,
            availableBuses: vendorData.buses?.length || 0,
            ongoingBuses: vendorData.ongoing_buses?.length || 0,
            image:
              vendorData.buses?.[0]?.travels_logo ||
              'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
            contactPerson: vendorData.full_name,
            phone: vendorData.phone || 'N/A',
            email: vendorData.email_address,
            address: `${vendorData.address || 'N/A'}, ${
              vendorData.city || ''
            }, ${vendorData.state || ''} - ${vendorData.pincode || ''}`,
          };

          setVendor(transformedVendor);

          if (vendorData.buses && vendorData.buses.length > 0) {
            const transformedBuses = vendorData.buses.map((bus) => ({
              id: bus.id,
              title: bus.bus_name,
              type: 'Bus',
              capacity: bus.capacity,
              vehicleRC: bus.vehicle_rc_number,
              status: 'Available',
              image:
                bus.travels_logo || '/placeholder.svg?height=192&width=384',
            }));
            setBuses(transformedBuses);
          } else {
            setBuses([]);
          }

          if (vendorData.packages && vendorData.packages.length > 0) {
            const transformedPackages = vendorData.packages.map((pkg) => ({
              id: pkg.id,
              destination: pkg.places || 'Package Tour',
              route: pkg.places || 'Tour Package',
              availableDates: `${pkg.days} days, ${pkg.nights} nights`,
              status: 'Open',
              image:
                pkg.header_image || '/placeholder.svg?height=192&width=384',
            }));
            setPackages(transformedPackages);
          } else {
            setPackages([]);
          }

          if (vendorData.busy_dates && vendorData.busy_dates.length > 0) {
            const dates = vendorData.busy_dates.map((entry) => entry.date);
            setMarkedDates(dates);
          } else {
            setMarkedDates([]);
          }
        } else {
          setVendor(null);
          setBuses([]);
          setPackages([]);
          setMarkedDates([]);
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[500px]'>
        <LoadingSpinner size='large' />
      </div>
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

        <div className='w-fit my-6'>
          <button
            onClick={() => setShowCalendar(true)}
            className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition'>
            Marked Dates
          </button>

          {showCalendar && (
            <div
              className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
              onClick={() => setShowCalendar(false)} // click outside closes
            >
              <div
                onClick={(e) => e.stopPropagation()} // prevent close on inside click
                className='w-full max-w-xl'>
                <MarkedCalender
                  markedDates={markedDates}
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                />
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <Link
          to='/admin/vendors'
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
            to={`/admin/vendors/${vendorId}/inventory`}
            className='inline-flex items-center text-blue-500 hover:text-blue-700'>
            <span className='text-sm'>See All</span>
            <ChevronRight className='h-4 w-4 ml-1' />
          </Link>
        </div>

        <div className='relative'>
          <div className='flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4 no-scrollbar'>
            {buses && buses.length > 0 ? (
              buses.map((bus) => (
                <div
                  key={bus.id}
                  className='w-72 flex-shrink-0'>
                  <BusCard
                    bus={bus}
                    vendorId={vendorId}
                  />
                </div>
              ))
            ) : (
              <EmptyState
                title='No buses added yet'
                description="Add buses to this vendor's inventory to get started."
                actionLabel='Add Bus'
                onAction={() =>
                  navigate(`/admin/vendors/${vendorId}/inventory?tab=buses`)
                }
                icon='bus'
              />
            )}
          </div>
        </div>
      </div>

      {/* Available Packages Section */}
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Available Packages</h2>
          <Link
            to={`/admin/vendors/${vendorId}/inventory?tab=packages`}
            className='inline-flex items-center text-blue-500 hover:text-blue-700'>
            <span className='text-sm'>See All</span>
            <ChevronRight className='h-4 w-4 ml-1' />
          </Link>
        </div>

        <div className='relative'>
          <div className='flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4 no-scrollbar'>
            {packages && packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className='w-72 flex-shrink-0'>
                  <PackageCard
                    pkg={pkg}
                    vendorId={vendorId}
                  />
                </div>
              ))
            ) : (
              <EmptyState
                title='No buses added yet'
                description="Add buses to this vendor's inventory to get started."
                actionLabel='Add Bus'
                onAction={() =>
                  navigate(`/admin/vendors/${vendorId}/inventory?tab=buses`)
                }
                icon='bus'
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
