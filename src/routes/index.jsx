import { Layout } from '@/components/common';
import { UsersListPage, UserDetailsPage } from '@/features/users/pages';
import { DashboardPage } from '@/features/dashboard/pages/Dashboard';
import {
  VendorDetailsPage,
  VendorInventoryPage,
  VendorsListPage,
} from '@/features/vendor/pages';
import { BookingDetailsPage, BookingListPage } from '@/features/booking/pages';
import {
  PaymentDetailsPage,
  PaymentsListPage,
} from '@/features/payments/pages';
import { AdvertisementPage } from '@/features/advertisement/pages/Advertisement';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'users',
        children: [
          { index: true, element: <UsersListPage /> },
          { path: ':userId', element: <UserDetailsPage /> },
        ],
      },
      {
        path: 'vendors',
        children: [
          { index: true, element: <VendorsListPage /> },
          { path: ':vendorId', element: <VendorDetailsPage /> },
          { path: ':vendorId/inventory', element: <VendorInventoryPage /> },
        ],
      },
      {
        path: 'booking',
        children: [
          { index: true, element: <BookingListPage /> },
          { path: ':bookingId', element: <BookingDetailsPage /> },
        ],
      },
      {
        path: 'payments',
        children: [
          { index: true, element: <PaymentsListPage /> },
          { path: ':paymentId', element: <PaymentDetailsPage /> },
        ],
      },
      {
        path: 'advertisements',
        children: [{ index: true, element: <AdvertisementPage /> }],
      },
    ],
  },
];

export default routes;
