import { Outlet } from 'react-router';
import { ScrollToTop, Navbar, Sidebar } from '@/components/common';

export function Layout() {
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      <ScrollToTop />
      <Sidebar />
      <div className='flex flex-col flex-1 h-screen overflow-hidden'>
        <Navbar />
        <main
          data-scroll-container
          className='flex-1 overflow-auto p-2 md:p-4 lg:p-6 bg-gray-50 no-scrollbar'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
