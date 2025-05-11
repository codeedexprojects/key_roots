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
  Star,
  DollarSign,
  Award,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router';
import Logo from '../../public/Logo.png';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { name: 'Dashboard', icon: Home, to: '/' },
  { name: 'Users', icon: Users, to: '/users' },
  { name: 'Vendor', icon: Store, to: '/vendors' },
  { name: 'Reviews', icon: Star, to: '/reviews' },
  { name: 'Booking Details', icon: Calendar, to: '/booking' },
  { name: 'Payments', icon: CreditCard, to: '/payments' },
  { name: 'Advertisement', icon: MonitorSmartphone, to: '/advertisements' },
  { name: 'Category', icon: Grid3X3, to: '/category' },
  { name: 'Reward', icon: Award, to: '/rewards' },
  { name: 'Pay Out', icon: DollarSign, to: '/payouts' },
];

export const Sidebar = () => {
  const { logout } = useAuth();

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
      className='flex flex-col h-screen text-white bg-primary-red shadow-md z-20'>
      {/* Logo */}
      <div className='flex items-center justify-between p-4'>
        <NavLink
          to='/admin/dashboard'
          className='flex items-center'>
          <img
            src={Logo}
            alt='Logo'
            className='w-20'
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
      <div
        className={`p-4 mb-4 flex ${
          isOpen
            ? 'flex-row justify-between items-center'
            : 'flex-col items-start gap-4'
        }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
          {isOpen ? (
            <PanelLeftOpen className='h-6 w-6' />
          ) : (
            <PanelRightOpen className='h-6 w-6' />
          )}
        </button>

        <button
          onClick={() => logout()}
          className='flex items-center text-white text-md hover:text-red-200 transition-colors'>
          <LogOut className='w-6 h-6' />
          {isOpen && <span className='ml-2'>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};
