import {
  Home,
  Users,
  LogOut,
  PanelLeftOpen,
  PanelRightOpen,
  Store,
  Calendar,
  CreditCard,
  MonitorSmartphone,
  Grid3X3,
  DollarSign,
  Award,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router';

const menuItems = [
  { name: 'Dashboard', icon: Home, to: '/admin/dashboard' },
  { name: 'Users', icon: Users, to: '/admin/users' },
  { name: 'Vendor', icon: Store, to: '/admin/vendors' },
  { name: 'Booking Details', icon: Calendar, to: '/admin/bookings' },
  { name: 'Payments', icon: CreditCard, to: '/admin/payments' },
  { name: 'Advertisement', icon: MonitorSmartphone, to: '/admin/ads' },
  { name: 'Category', icon: Grid3X3, to: '/admin/categories' },
  { name: 'Pay Out', icon: DollarSign, to: '/admin/payouts' },
  { name: 'Reward', icon: Award, to: '/admin/rewards' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth >= 768 ? setIsOpen(true) : setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.aside
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='flex flex-col h-screen text-white bg-primary shadow-md z-20'>
      {/* Logo */}
      <div className='flex items-center justify-between p-4'>
        <NavLink
          to='/admin/dashboard'
          className='flex items-center'>
          <img
            src='https://www.svgrepo.com/show/4263/placeholder.svg'
            alt='Logo'
            className='w-8'
          />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className='ml-3 text-xl font-bold text-white'>
                KEYROUTE
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Menu Items */}
      <nav className='flex-grow mt-4'>
        <ul className='space-y-2 px-2'>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-white/10
                  ${isActive ? 'bg-white/20 font-medium' : 'text-white'}
                  ${!isOpen ? 'justify-center' : ''}`
                }>
                <item.icon className='h-5 w-5' />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className='ml-3'>
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle & Logout */}
      <div className='p-4 mt-auto flex flex-col items-start'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className='mb-4'>
          {isOpen ? (
            <PanelLeftOpen className='h-6 w-6' />
          ) : (
            <PanelRightOpen className='h-6 w-6' />
          )}
        </button>

        <button
          onClick={() => console.log('Handle logout')}
          className='flex items-center text-white text-sm hover:text-red-200 transition-colors'>
          <LogOut className='w-4 h-4 mr-2' />
          {isOpen && 'Logout'}
        </button>
      </div>
    </motion.aside>
  );
};
