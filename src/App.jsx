import React, { useContext, useEffect } from 'react';
import routes from './routes';
import { AuthProvider } from './lib/authProvider';
import { Toaster } from './components/ui/sonner';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { registerLogoutCallback } from './lib/authUtil';
import { AuthContext } from './lib/authContext';

const router = createBrowserRouter(routes);

// This wrapper is here to register the logout function
const AppContent = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    registerLogoutCallback(logout);
  }, [logout]);

  return (
    <>
      <Toaster position='top-right' />
      <RouterProvider router={router} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
