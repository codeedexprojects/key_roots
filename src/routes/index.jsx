import { Layout } from '@/components/common';
import { UsersListPage, UserDetailsPage } from '@/features/users/pages';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import {
  VendorDetailsPage,
  VendorInventoryPage,
  VendorsListPage,
  VendorBusDetailsPage,
  PackageDetailsPage,
  VendorCreatePage,
} from '@/features/vendor/pages';
import { BookingDetailsPage, BookingListPage } from '@/features/booking/pages';
import {
  PaymentDetailsPage,
  PaymentsListPage,
} from '@/features/payments/pages';
import { AdvertisementPage } from '@/features/advertisement/pages/AdvertisementPage';
import { CategoryPage, BusDetailsPage } from '@/features/category/pages';
import { RewardDetailsPage, RewardsListPage } from '@/features/rewards/pages';
import { ReviewsListPage } from '@/features/reviews/pages';
import { Navigate } from 'react-router';

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
          { path: 'create', element: <VendorCreatePage /> },
          { path: ':vendorId', element: <VendorDetailsPage /> },
          { path: ':vendorId', element: <VendorDetailsPage /> },
          { path: ':vendorId/inventory', element: <VendorInventoryPage /> },
          { path: ':vendorId/buses/:busId', element: <VendorBusDetailsPage /> },
          {
            path: ':vendorId/packages/:packageId',
            element: <PackageDetailsPage />,
          },
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
      {
        path: 'category',
        children: [
          { index: true, element: <CategoryPage /> },
          { path: 'buses/:busId', element: <BusDetailsPage /> },
        ],
      },
      {
        path: 'rewards',
        children: [
          { index: true, element: <RewardsListPage /> },
          { path: ':rewardId', element: <RewardDetailsPage /> },
        ],
      },
      {
        path: 'reviews',
        children: [{ index: true, element: <ReviewsListPage /> }],
      },
      {
        path: '*',
        element: (
          <Navigate
            to='/'
            replace
          />
        ),
      },
    ],
  },
];

export default routes;
