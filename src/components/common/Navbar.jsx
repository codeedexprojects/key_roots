import { Bell, Search } from 'lucide-react';

export function Navbar() {
  return (
    <header className='w-full bg-white p-4 shadow-sm flex items-center justify-between'>
      {/* Search Bar */}
      <div className='relative hidden md:block'>
        <input
          type='text'
          placeholder='Search...'
          className='w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-blue-300'
        />
        <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
      </div>

      {/* Notifications & Profile */}
      <div className='flex items-center gap-4'>
        {/* Notification Icon */}
        <div className='relative cursor-pointer'>
          <Bell className='h-6 w-6 text-gray-600' />
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
            3
          </span>
        </div>

        {/* User Info */}
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full overflow-hidden bg-gray-300'>
            <img
              src='/placeholder.svg?height=32&width=32'
              alt='Admin'
              className='h-full w-full object-cover'
            />
          </div>
          <span className='hidden md:inline font-medium'>Name</span>
        </div>
      </div>
    </header>
  );
}
