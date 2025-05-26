import { Bell, Search } from 'lucide-react';

export function Navbar() {
  return (
    <header className='w-full bg-white p-4 shadow-sm flex items-end justify-end'>
      {/* Notifications & Profile */}
      <div className='flex items-center gap-4'>
        {/* User Info */}
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full overflow-hidden bg-gray-300'>
            <img
              src='https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
              alt='Admin'
              className='h-full w-full object-cover'
            />
          </div>
          <span className='hidden md:inline font-medium'>Admin</span>
        </div>
      </div>
    </header>
  );
}
