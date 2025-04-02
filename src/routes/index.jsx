import { Layout } from '@/components/common';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { DashboardPage } from '@/features/dashboard/pages/Dashboard';
import { UserDetailsPage } from '@/features/users/pages/UserDetailsPage';
import {
  VendorDetailsPage,
  VendorInventoryPage,
  VendorsListPage,
} from '@/features/vendor/pages';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <UsersPage />,
          },
          {
            path: ':userId',
            element: <UserDetailsPage />,
          },
        ],
      },
      {
        path: 'vendors',
        children: [
          {
            index: true,
            element: <VendorsListPage />,
          },
          {
            path: ':vendorId',
            element: <VendorDetailsPage />,
          },
          {
            path: ':vendorId/inventory',
            element: <VendorInventoryPage />,
          },
        ],
      },
    ],
  },
];

export default routes;
