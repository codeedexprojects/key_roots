import React from 'react';
import routes from './routes';
import { AuthProvider } from './lib/authProvider';
import { Toaster } from './components/ui/sonner';
import { RouterProvider, createBrowserRouter } from 'react-router';

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <Toaster position='top-right' />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
