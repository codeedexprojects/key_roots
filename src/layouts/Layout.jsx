import { Sidebar, Navbar } from '@/components/common';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      <Sidebar />
      <div className='flex flex-col flex-1 h-screen overflow-hidden'>
        <Navbar />
        <main className='flex-1 overflow-auto p-6 bg-gray-50'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
