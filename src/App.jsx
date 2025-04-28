import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import routes from './routes';
import { ToastProvider } from './components/ui/toast-provider';

const router = createBrowserRouter(routes);

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
