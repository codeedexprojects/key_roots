import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Store,
  Calendar,
  CreditCard,
  MonitorSmartphone,
  Grid3X3,
  DollarSign,
  Award,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Users' },
    { icon: Store, label: 'Vendor' },
    { icon: Calendar, label: 'Booking Details' },
    { icon: CreditCard, label: 'Payments' },
    { icon: MonitorSmartphone, label: 'Advertisement' },
    { icon: Grid3X3, label: 'Category' },
    { icon: DollarSign, label: 'Pay Out' },
    { icon: Award, label: 'Reward' },
  ];

  return (
    <motion.div
      className='h-screen bg-primary flex flex-col justify-between'
      initial={{ width: isSidebarOpen ? '16rem' : '4rem' }}
      animate={{ width: isSidebarOpen ? '16rem' : '4rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}>
      {/* Top - Logo and Menu */}
      <div>
        {/* Logo */}
        <div className='p-4'>
          <div className='flex items-center'>
            <div className='bg-white p-2 rounded-md'>
              <img
                src={'https://www.svgrepo.com/show/4263/placeholder.svg'}
                alt='Keyroute'
                className='h-5 w-5'
              />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className='ml-3 text-white font-bold text-xl'>
                  KEYROUTE
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menu Items */}
        <div className='mt-4'>
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              className={`flex items-center py-3 px-4 cursor-pointer ${
                item.active ? 'bg-red-800' : 'hover:bg-red-800'
              }`}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}>
              <item.icon className='h-5 w-5 text-white' />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className='ml-4 text-white'>
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom - Collapse + Logout */}
      <div className='p-4'>
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className='p-2 rounded-full hover:bg-gray-100 bg-white text-primary'>
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>

        {/* Logout */}
        <motion.div
          className='flex items-center py-3 px-4 mt-4 cursor-pointer hover:bg-red-800'
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}>
          <LogOut className='h-5 w-5 text-white' />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className='ml-4 text-white'>
                Logout
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
