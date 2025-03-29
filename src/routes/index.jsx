import { Layout } from '@/components/common';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { DashboardPage } from '@/features/dashboard/pages/Dashboard';
import { UserDetailsPage } from '@/features/users/pages/UserDetailsPage';

const routes = [
  {
    path: '/admin',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
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
            path: 'details/:userId',
            element: <UserDetailsPage />,
          },
        ],
      },
    ],
  },
];

export default routes;
