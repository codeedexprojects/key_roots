import Layout from '@/layouts/Layout';
import DashboardPage from '@/pages/DashboardPage';

const routes = [
  {
    path: '/admin',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
];

export default routes;
