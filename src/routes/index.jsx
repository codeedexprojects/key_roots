import { Layout } from '@/components/common';
import {
  UsersListPage,
  UserDetailsPage,
  UserCreatePage,
} from '@/features/users/pages';
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
import { AdvertisementExplorePage } from '@/features/advertisement/pages';
import CategoryPage from '@/features/category/pages/CategoryPage';
import { RewardDetailsPage, RewardsListPage } from '@/features/rewards/pages';
import { ReviewsListPage } from '@/features/reviews/pages';
import { Navigate } from 'react-router';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { PrivateRoute } from '@/lib/PrivateRoute.jsx';
import PayoutPage from '@/features/payout/pages/PayoutPage';
import Home from '@/features/landing/pages/Home';
import VendorTermsAndConditions from '@/features/landing/pages/VendorTermsAndConditions';
import UserTerms from '@/features/landing/pages/UserTermsAndConditions';
import UserPrivacyPolicy from '@/features/landing/pages/UserPrivacyPolicy';
import VendorPrivacyPolicy from '@/features/landing/pages/VendorPrivacyPolicy';
import RightToDelete from '@/features/landing/pages/VendorDeleteAC';
import UserDeletePolicy from '@/features/landing/pages/UserDeleteAC';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/vendor-terms',
    element: <VendorTermsAndConditions />,
  },
  {
    path: '/user-terms',
    element: <UserTerms />,
  },
  {
    path: '/user-privacy',
    element: <UserPrivacyPolicy />,
  },
  {
    path: '/vendor-privacy',
    element: <VendorPrivacyPolicy />,
  },
  {
    path: '/vendor-delete',
    element: <RightToDelete />,
  },
  {
    path: '/user-delete',
    element: <UserDeletePolicy />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to='/admin/dashboard' /> },
      { path: 'dashboard', element: <DashboardPage /> },
      {
        path: 'users',
        children: [
          { index: true, element: <UsersListPage /> },
          { path: 'create', element: <UserCreatePage /> },
          { path: ':userId', element: <UserDetailsPage /> },
        ],
      },
      {
        path: 'vendors',
        children: [
          { index: true, element: <VendorsListPage /> },
          { path: 'create', element: <VendorCreatePage /> },
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
          { path: ':bookingId/:bookingType', element: <BookingDetailsPage /> },
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
        children: [{ index: true, element: <AdvertisementExplorePage /> }],
      },
      {
        path: 'category',
        children: [
          {
            index: true,
            element: (
              <Navigate
                to='buses'
                replace
              />
            ),
          },
          {
            path: 'buses',
            element: <CategoryPage />,
          },
          {
            path: 'packages',
            element: <CategoryPage />,
          },
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
        path: 'payouts',
        children: [{ index: true, element: <PayoutPage /> }],
      },
      {
        path: '*',
        element: (
          <Navigate
            to='/admin/dashboard'
            replace
          />
        ),
      },
    ],
  },
];

export default routes;
