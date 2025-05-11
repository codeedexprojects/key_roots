import React from 'react';
import routes from './routes';
import { AuthProvider } from './lib/authProvider';
import { ToastProvider } from './components/ui/toast-provider';
import { RouterProvider, createBrowserRouter } from 'react-router';

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
