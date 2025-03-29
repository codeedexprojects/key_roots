import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      <Sidebar />
      <div className='flex flex-col flex-1 h-screen overflow-hidden'>
        <Navbar />
        <main className='flex-1 overflow-auto p-2 md:p-4 lg:p-6 bg-gray-50'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
